import { FC } from "react";
import { CohostStartCheckoutContext } from "../context/CohostStartCheckoutContext";
import { useCohostClient } from "../context/CohostContext";

export const CohostStartCheckoutProvider: FC<{
    contextId: string;
    /**
     * Optional payment capture mode for carts started here:
     *   - "capture" (default) — auth + capture immediately.
     *   - "auth_only" — authorize (hold) only; capture later.
     * Omit to inherit the event-level setting / system default.
     */
    captureMode?: "capture" | "auth_only";
    children: React.ReactNode;
}> = ({ contextId, captureMode, children }) => {
    const { client } = useCohostClient();

    const getCartSessionId = async () => {
        const params = new URLSearchParams(window.location.search);
        const tracking: Record<string, string> = {};
        const forward: Record<string, any> = {};

        for (const [key, value] of params.entries()) {
            if (key.startsWith("utm_") || key.startsWith("ctm_")) {
                tracking[key] = value;
            } else {
                forward[key] = value;
            }
        }

        const cart = await client.cart.start({
            contextId,
            ...(captureMode ? { captureMode } : {}),
            sessionContext: {
                userAgent: navigator.userAgent,
                tracking,
                forward,
            }
        });

        return cart?.id ?? null;
    };

    return (
        <CohostStartCheckoutContext.Provider value={{ contextId, getCartSessionId }}>
            {children}
        </CohostStartCheckoutContext.Provider>
    );
};
