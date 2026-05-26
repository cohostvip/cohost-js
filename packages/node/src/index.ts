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
export { OrganizersAPI, type Organizer, type OrganizerInput, type OrganizerLink } from './api/organizers';
export { UsersAPI } from './api/users';
export {
    type AuthNetIframeResponse,
    type InlineTransactionInput,
    type PlaceOrderInput,
    type PlaceOrderResult,
} from './api/sessions';

export * from '@cohostvip/cohost-types';