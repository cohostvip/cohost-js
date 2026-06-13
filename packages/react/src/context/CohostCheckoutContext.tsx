import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useCohostClient } from './CohostContext';
import type {
    AuthNetIframeResponse,
    CartSession,
    Customer,
    InlineTransactionInput,
    PersonAddress,
    PlaceOrderInput,
    PlaceOrderResult,
    UpdatableCartSession,
} from '@cohostvip/cohost-node';

export type { AuthNetIframeResponse, InlineTransactionInput, PlaceOrderInput, PlaceOrderResult };

export type CohostCheckoutProviderProps = {
    cartSessionId: string;
    children: React.ReactNode;
};

/** Lifecycle of the cart-session load. `error` ⇒ the session id was not found / unfetchable. */
export type CohostCheckoutStatus = 'loading' | 'ready' | 'error';

export type CohostCheckoutContextType = {
    cartSessionId: string;
    cartSession: CartSession | null;
    /** Whether the cart session loaded. Gate payment UI on `ready`. */
    status: CohostCheckoutStatus;
    /** The load error when `status === 'error'` (e.g. 404 session not found). */
    error: Error | null;
    joinGroup: (groupId: string) => Promise<{ itemId: string | null; error?: { message: string; status?: number } }>;
    updateItem: (offeringId: string, quantity: number, options?: any) => Promise<void>;

    incrementItem: (offeringId: string, options?: any) => Promise<void>;
    decrementItem: (offeringId: string) => Promise<void>;

    updateCartSession: (data: Partial<UpdatableCartSession>) => Promise<void>;
    placeOrder: (input?: PlaceOrderInput) => Promise<PlaceOrderResult | undefined>;
    /**
     * Submit the success callback from the Auth.Net Accept Hosted iframe.
     *
     * Pass the verbatim payload received from the iframe — the SDK extracts
     * the `transId`, builds the `place-order` body, and submits it. The
     * server then independently validates the transaction against
     * Authorize.Net before creating the order.
     */
    submitAuthnetIframeTransaction: (
        iframeResponse: AuthNetIframeResponse
    ) => Promise<PlaceOrderResult | undefined>;
    processPayment: (data: unknown) => Promise<unknown>;
    applyCoupon: (code: string) => Promise<void>;
    removeCoupon: (id: string) => Promise<void>;
    setCustomer: (customer: Partial<Customer>) => Promise<void>;
    setBillingAddress: (address: Partial<PersonAddress>) => Promise<void>;
};


export const CohostCheckoutContext = createContext<CohostCheckoutContextType | null>(null);

export const CohostCheckoutProvider: React.FC<CohostCheckoutProviderProps> = ({
    cartSessionId,
    children,
}) => {

    const { client, debug } = useCohostClient();
    const [cartSession, setCartSession] = React.useState<CartSession | null>(null);
    const [status, setStatus] = React.useState<CohostCheckoutStatus>('loading');
    const [error, setError] = React.useState<Error | null>(null);

    const logError = (message: string, error?: unknown) => {
        if (debug) {
            console.error(message, error);
        }
    };

    const assertCartSession = () => {
        if (!cartSession) {
            logError("CohostCheckoutProvider requires a cartSession");
            throw new Error("CohostCheckoutProvider requires a cartSession");
        }
    }

    const applyCoupon = async (code: string): Promise<void> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.applyCoupon(cartSessionId, code);
            setCartSession(updatedCart);

        } catch (error) {
            logError("Error applying coupon:", error);
            throw error;
        }
    }


    const removeCoupon = async (id: string): Promise<void> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.deleteCoupon(cartSessionId, id);
            setCartSession(updatedCart);

        } catch (error) {
            logError("Error removing coupon:", error);
            throw error;
        }
    }

    const joinGroup = async (groupId: string): Promise<{ itemId: string | null; error?: { message: string; status?: number } }> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.joinTableCommitment(cartSessionId, groupId);

            setCartSession(updatedCart);

            const itemId = updatedCart
                .items
                .find((item: any) => item.tableCommitmentId === groupId)?.id || null;

            return { itemId };
        } catch (error: any) {
            logError("Error joining group:", error);
            return {
                itemId: null,
                error: {
                    message: error?.message || 'Failed to join group',
                    status: error?.status || error?.response?.status,
                },
            };
        }
    }

    const updateItem = async (itemId: string, quantity: number, options?: any) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.updateItem(cartSessionId, { itemId, quantity, options });
            setCartSession(updatedCart);
        } catch (error) {
            logError("Error updating cart item:", error);
        }
    }

    const incrementItem = async (itemId: string, options?: any) => {
        assertCartSession();

        try {
            const item = cartSession?.items.find(item => item.id === itemId);

            if (!item) {
                return;
            }

            const qty = Math.max(item.quantity + 1, item.offering?.minimumQuantity || 1);

            if (item.offering?.maximumQuantity && qty > item.offering.maximumQuantity) {
                return;
            }

            if (item.quantity !== qty) {
                await updateItem(itemId, qty, options);
            }
        } catch (error) {
            logError("Error incrementing cart item:", error);
        }
    };

    const decrementItem = async (itemId: string) => {
        assertCartSession();

        try {
            const item = cartSession?.items.find(item => item.id === itemId);

            if (!item) {
                return;
            }

            const qty = item.quantity === (item.offering.minimumQuantity || 1) ? 0 : item.quantity - 1;

            if (item.quantity !== qty) {
                await updateItem(itemId, qty);
            }
        } catch (error) {
            logError("Error decrementing cart item:", error);
        }
    };

    const updateCartSession = async (data: Partial<UpdatableCartSession>) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.update(cartSessionId, data);
            setCartSession(updatedCart);
        } catch (error) {
            logError("Error updating cart session:", error);
        }
    };

    const setCustomer = async (customer: Partial<Customer>) => {
        assertCartSession();

        try {

            const updatedCart = await client.cart.update(cartSessionId, {
                customer: {
                    ...cartSession?.customer,
                    ...customer,
                },
            });
            setCartSession(updatedCart);
        } catch (error) {
            logError("Error setting customer:", error);
        }
    }

    const setBillingAddress = async (address: Partial<PersonAddress>) => {
        assertCartSession();

        const customer: Partial<Customer> = {
            ...cartSession?.customer,
            billingAddress: {
                ...cartSession?.customer?.billingAddress,
                ...address,
                first: address.first || cartSession?.customer?.billingAddress?.first || cartSession?.customer?.first || '',
                last: address.last || cartSession?.customer?.billingAddress?.last || cartSession?.customer?.last || '',
            } as any,
        }

        return setCustomer(customer);
    }


    const placeOrder = async (input: PlaceOrderInput = {}) => {
        assertCartSession();

        try {
            const res = await client.cart.placeOrder(cartSessionId, input);
            return res;
        } catch (error) {
            logError("Error placing order:", error);
        }
    }

    const submitAuthnetIframeTransaction = async (iframeResponse: AuthNetIframeResponse) => {
        assertCartSession();

        const transId = iframeResponse?.transactionData?.transId;
        if (!transId) {
            const err = new Error('Auth.Net iframe response is missing transactionData.transId');
            logError("Invalid iframe response:", err);
            throw err;
        }

        return placeOrder({
            transaction: {
                provider: 'authnet',
                transId,
                iframeResponse,
            },
        });
    }


    const processPayment = async (data: unknown) => {
        assertCartSession();

        try {
            const res = await client.cart.processPayment(cartSessionId, data);
            return res;
        } catch (error) {
            logError("Error processing payment:", error);
        }
    }


    useEffect(() => {
        if (!cartSessionId) {
            logError("CohostCheckoutProvider requires a cartSessionId");
            setCartSession(null);
            setStatus('error');
            setError(new Error('CohostCheckoutProvider requires a cartSessionId'));
            return;
        }

        let live = true;
        setStatus('loading');
        setError(null);

        client.cart
            .get(cartSessionId)
            .then((cart) => {
                if (!live) return;
                setCartSession(cart);
                setStatus('ready');
            })
            .catch((err) => {
                if (!live) return;
                logError("Error fetching cart session:", err);
                // A missing/unfetchable session must NOT leave a stale cart around — callers
                // (e.g. <CohostPaymentFrame>) gate payment UI on `status === 'ready'`.
                setCartSession(null);
                setError(err instanceof Error ? err : new Error(String(err)));
                setStatus('error');
            });

        return () => {
            live = false;
        };
    }, [cartSessionId]);

    return (
        <CohostCheckoutContext.Provider value={{
            cartSessionId,
            cartSession,
            status,
            error,

            /**
             * Item quantity management
             */
            updateItem,
            incrementItem,
            decrementItem,

            updateCartSession,
            placeOrder,
            submitAuthnetIframeTransaction,
            joinGroup,
            processPayment,
            applyCoupon,
            removeCoupon,
            setCustomer,
            setBillingAddress,
            
        }}>
            {children}
        </CohostCheckoutContext.Provider>
    );
};

/**
 * Hook to access the current CohostCheckoutContext
 * Must be used inside a <CohostCheckoutProvider>
 */
export const useCohostCheckout = (): CohostCheckoutContextType => {
    const ctx = useContext(CohostCheckoutContext);
    if (!ctx) throw new Error("useCohostCheckout must be used within a CohostCheckoutProvider");
    return ctx;
};
