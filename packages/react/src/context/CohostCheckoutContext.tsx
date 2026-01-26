import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useCohostClient } from './CohostContext';
import type { CartSession, Customer, PersonAddress, UpdatableCartSession } from '@cohostvip/cohost-node';

export type CohostCheckoutProviderProps = {
    cartSessionId: string;
    children: React.ReactNode;
};

export type CohostCheckoutContextType = {
    cartSessionId: string;
    cartSession: CartSession | null;
    joinGroup: (groupId: string) => Promise<{ itemId: string | null; error?: { message: string; status?: number } }>;
    updateItem: (offeringId: string, quantity: number, options?: any) => Promise<void>;

    incrementItem: (offeringId: string, options?: any) => Promise<void>;
    decrementItem: (offeringId: string) => Promise<void>;

    updateCartSession: (data: Partial<UpdatableCartSession>) => Promise<void>;
    placeOrder: () => Promise<CartSession | undefined>;
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


    const placeOrder = async () => {
        assertCartSession();

        try {
            const res = await client.cart.placeOrder(cartSessionId, {});
            return res;
        } catch (error) {
            logError("Error placing order:", error);
        }
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
            return;
        }
        const fetchCartSession = async () => {
            try {
                const cart = await client.cart.get(cartSessionId);
                setCartSession(cart);
            } catch (error) {
                logError("Error fetching cart session:", error);

                // rethrow the error to be handled by the caller
                throw error;
            }
        };

        fetchCartSession();
    }, [cartSessionId]);

    return (
        <CohostCheckoutContext.Provider value={{
            cartSessionId,
            cartSession,

            /** 
             * Item quantity management
             */
            updateItem,
            incrementItem,
            decrementItem,

            updateCartSession,
            placeOrder,
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
