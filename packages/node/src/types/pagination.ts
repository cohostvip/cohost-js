/**
 * Pagination parameters for a paginated API request.
 */
export interface Pagination {
    /** Number of results per page. */
    size: number;

    /** Page number (starting from 1). */
    page: number;

    /** Continuation */
    continuation?: string;
}

export interface PaginationResponse extends Pagination {
    /** Total number of results available. */
    total: number;


}


export type PaginatedResults<T> = {
    /** The results for the current page. */
    results: T[];

    /** Pagination information. */
    pagination: PaginationResponse;

}