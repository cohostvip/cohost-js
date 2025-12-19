import { useContext } from 'react';
import { CohostStartCheckoutContext } from '../context/CohostStartCheckoutContext';
import { useCohostClient } from '../context/CohostContext';

export interface StartCheckoutOptions {
    items: Array<{
        offeringId: string;
        quantity: number;
        options?: Record<string, any>;
    }>;
}

/**
 * Hook to start the checkout process.
 *
 * @example
 * ```tsx
 * const { startCheckout, isStarting } = useCohostStartCheckout();
 *
 * const handleCheckout = async () => {
 *   const cartSessionId = await startCheckout({
 *     items: [
 *       { offeringId: 'ticket_123', quantity: 2 }
 *     ]
 *   });
 *
 *   if (cartSessionId) {
 *     router.push(`/checkout/${cartSessionId}`);
 *   }
 * };
 * ```
 */
export const useCohostStartCheckout = () => {
    const ctx = useContext(CohostStartCheckoutContext);
    const { client } = useCohostClient();

    if (!ctx) {
        throw new Error('useCohostStartCheckout must be used within a CohostStartCheckoutProvider');
    }

    const { contextId, getCartSessionId } = ctx;

    /**
     * Start the checkout process by creating a cart session and adding items to it.
     *
     * @param options - The items to add to the cart
     * @returns The cart session ID or null if the operation failed
     */
    const startCheckout = async (options: StartCheckoutOptions): Promise<string | null> => {
        try {
            // Get or create a cart session
            let cartSessionId = await getCartSessionId();

            if (!cartSessionId) {
                console.error('Failed to create cart session');
                return null;
            }

            // Add items to the cart session
            for (const item of options.items) {
                if (item.quantity > 0) {
                    await client.cart.updateItem(cartSessionId, {
                        itemId: item.offeringId,
                        quantity: item.quantity,
                        options: item.options,
                    });
                }
            }

            return cartSessionId;
        } catch (error) {
            console.error('Error starting checkout:', error);
            return null;
        }
    };

    return {
        startCheckout,
        contextId,
    };
};
