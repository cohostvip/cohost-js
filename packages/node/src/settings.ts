/**
 * Optional settings for customizing the behavior of the CohostClient.
 */
export interface CohostClientSettings {
    /** Enable verbose debug output for all API requests. */
    debug?: boolean;

    /** Override the default API base URL (defaults to apiBaseUrl). */
    apiUrl?: string;
}

// settings.ts
export const defaultSettings = {
    baseUrl: 'https://api.cohost.vip',
    headers: {
        'Content-Type': 'application/json',
    },
};

// In dev or testing, you can override this in the browser or Node
export let runtimeOverrides: {
    baseUrl?: string;
    headers?: Record<string, string>;
} = {};

export function setSdkOverrides(overrides: typeof runtimeOverrides) {
    runtimeOverrides = overrides;
}

