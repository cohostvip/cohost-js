import { CohostClient, CohostClientOptions } from './client';
export { type CohostClientSettings } from './settings';

/**
 * Factory method for creating a CohostClient instance.
 * 
 * Example:
 * ```ts
 * const client = createCohostClient({ token: 'your-token' });
 * ```
 */
export function createCohostClient(options: CohostClientOptions): CohostClient {
    return new CohostClient(options);
}


export { CohostClient }
export { type Coupon } from './api/coupons';
export { UsersAPI } from './api/users';

export * from '@cohostvip/cohost-types';