import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useCohostCheckout } from './CohostCheckoutContext';
import { useCohostClient } from './CohostContext';
import { CreditCardInformation, Tokenizer } from '../lib/tokenizers/types';
import { authnetTokenizer } from '../lib/tokenizers/authnet';

export type PaymentElementProviderProps = {
    children: React.ReactNode;
    /**
     * Always fetch the payment intent from the `/payment/payment-intent` endpoint
     * instead of reusing `cartSession.meta.paymentIntent`.
     *
     * Enable this when you need the endpoint-only fields that are built fresh per
     * request and not persisted on the cart — e.g. the Authorize.Net `paymentRequest`
     * payload for the Accept Hosted iframe. Defaults to `false` (use the cached
     * `meta.paymentIntent` when present).
     */
    forceFetchPaymentIntent?: boolean;
};

export type PaymentElementContextType = {
    tokenizeCard: (cardInfo: CreditCardInformation) => Promise<any>;
    paymentIntent: any | null;
    isLoading: boolean;
};

const PaymentElementContext = createContext<PaymentElementContextType | null>(null);

const tokenizers: Record<string, Tokenizer> = {
    'authnet': authnetTokenizer
}



export const PaymentElementProvider: React.FC<PaymentElementProviderProps> = ({ children, forceFetchPaymentIntent = false }) => {
    const { cartSession, cartSessionId } = useCohostCheckout();
    const { client, debug } = useCohostClient();

    const [paymentIntent, setPaymentIntent] = useState<any | null>(null);
    const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchAttemptedRef = useRef(false);

    const tokenizeCard = async (cardInfo: CreditCardInformation) => {
        if (!tokenizer) {
            throw new Error("Tokenizer not found");
        }

        if (!paymentIntent) {
            throw new Error("Payment intent not found");
        }

        return await tokenizer.tokenize(cardInfo, paymentIntent);
    }

    useEffect(() => {
        if (!tokenizer) {
            return;
        }

        tokenizer.registerScripts();
    }, [tokenizer]);

    useEffect(() => {
        if (paymentIntent?.provider) {
            setTokenizer(tokenizers[paymentIntent.provider] || null);
        }
    }, [paymentIntent]);

    useEffect(() => {
        if (!cartSession) {
            return;
        }

        // Reuse the cached intent on the cart unless the caller wants the fresh,
        // endpoint-only payload (e.g. Auth.Net `paymentRequest`).
        if (!forceFetchPaymentIntent && cartSession.meta?.paymentIntent) {
            setPaymentIntent(cartSession.meta.paymentIntent);
            return;
        }

        // Only fetch once per mount
        if (fetchAttemptedRef.current) {
            return;
        }

        fetchAttemptedRef.current = true;
        setIsLoading(true);

        client.cart.getPaymentIntent(cartSessionId)
            .then((result) => {
                setPaymentIntent(result);
            })
            .catch((error) => {
                if (debug) {
                    console.error("Error fetching payment intent:", error);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [cartSession, cartSessionId, client, forceFetchPaymentIntent]);

    return (
        <PaymentElementContext.Provider value={{
            tokenizeCard,
            paymentIntent,
            isLoading,
        }}>
            {children}
        </PaymentElementContext.Provider>
    );
};

/**
 * Hook to access the current PaymentElementContext
 * Must be used inside a <PaymentElementProvider>
 */
export const usePaymentElement = (): PaymentElementContextType => {
    const ctx = useContext(PaymentElementContext);
    if (!ctx) throw new Error("usePaymentElement must be used within a PaymentElementProvider");
    return ctx;
};
