import { EventsAPI } from './api/events';
import { OrdersAPI } from './api/orders';
import { SessionsAPI } from './api/sessions';
import { CouponsAPI } from './api/coupons';
import { UsersAPI } from './api/users';
import { apiBaseUrl } from './apiVersion';
import { request, RequestFn } from './http/request';
import { CohostClientSettings } from './settings';
import { PaginatedResults } from './types/pagination';

/**
 * Configuration options for instantiating a CohostClient.
 */
export interface CohostClientOptions {
  /** API token used for authenticated requests. Defaults to COHOST_API_TOKEN or NEXT_PUBLIC_COHOST_API_TOKEN env var. */
  token?: string;

  /** Optional client settings such as debug mode or custom API URL. */
  settings?: CohostClientSettings;
}

/**
 * CohostClient provides grouped access to various API modules such as Events and Orders.
 */
export class CohostClient {
  public readonly events: EventsAPI;
  public readonly orders: OrdersAPI;
  public readonly cart: SessionsAPI;
  public readonly coupons: CouponsAPI;
  public readonly users: UsersAPI;
  public readonly apiUrl: string;

  private readonly baseOptions: CohostClientOptions;
  private readonly requestFn: RequestFn;

  constructor(options: CohostClientOptions = {}, customRequestFn?: RequestFn) {
    const token = options.token || process.env.COHOST_API_TOKEN || process.env.NEXT_PUBLIC_COHOST_API_TOKEN || null;
    const settings = options.settings || {};

    this.baseOptions = { ...options, token: token ?? undefined };
    this.apiUrl = settings.apiUrl || apiBaseUrl;

    const sharedRequest = customRequestFn ?? request({
      token,
      baseUrl: this.apiUrl,
      debug: settings.debug,
    });

    this.requestFn = sharedRequest;

    this.events = new EventsAPI(sharedRequest, settings);
    this.orders = new OrdersAPI(sharedRequest, settings);
    this.cart = new SessionsAPI(sharedRequest, settings);
    this.coupons = new CouponsAPI(sharedRequest, settings);
    this.users = new UsersAPI(sharedRequest, settings);
  }

  /**
   * Make a generic request to any endpoint.
   * Use this for custom endpoints not covered by the resource-specific APIs.
   *
   * @example
   * ```typescript
   * const profile = await client.request<OrganizerProfile>('/groov/profile/o-org_party');
   * ```
   */
  public request<T = any>(
    path: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: any;
      query?: Record<string, string | number | boolean | string[] | undefined>;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return this.requestFn<T>(path, options);
  }

  /**
   * Make a paginated request to any list endpoint.
   * Automatically handles pagination parameters and returns typed results.
   *
   * @example
   * ```typescript
   * const result = await client.paginatedRequest<Event>('/groov/events', {
   *   pagination: { page: 1, size: 20 }
   * });
   * console.log(result.results); // Event[]
   * console.log(result.pagination.total); // total count
   * ```
   */
  public paginatedRequest<T = any>(
    path: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: any;
      query?: Record<string, string | number | boolean | string[] | undefined>;
      headers?: Record<string, string>;
      pagination?: {
        size: number;
        page: number;
        continuation?: string;
      };
    }
  ): Promise<PaginatedResults<T>> {
    return this.requestFn<PaginatedResults<T>>(path, options);
  }

  /**
   * Returns a new CohostClient instance with overridden request behavior
   */
  public requestWithOverrides(overrides: {
    token?: string;
    baseUrl?: string;
    headers?: Record<string, string>;
  }): CohostClient {
    const { token, settings = {} } = this.baseOptions;

    const overriddenRequest: RequestFn = (path, options = {}) =>
      request({
        token: overrides.token ?? token ?? null,
        baseUrl: overrides.baseUrl ?? settings.apiUrl ?? apiBaseUrl,
        debug: settings.debug,
      })(path, {
        ...options,
        headers: {
          ...(overrides.headers || {}),
          ...(options.headers || {}),
        },
      });

    return new CohostClient(
      {
        token: overrides.token ?? token,
        settings: {
          ...settings,
          apiUrl: overrides.baseUrl ?? settings.apiUrl,
        },
      },
      overriddenRequest
    );
  }
}
