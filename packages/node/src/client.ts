import { EventsAPI } from './api/events';
import { OrdersAPI } from './api/orders';
import { SessionsAPI } from './api/sessions';
import { CouponsAPI } from './api/coupons';
import { apiBaseUrl } from './apiVersion';
import { request, RequestFn } from './http/request';
import { CohostClientSettings } from './settings';

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
  public readonly apiUrl: string;

  private readonly baseOptions: CohostClientOptions;

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

    this.events = new EventsAPI(sharedRequest, settings);
    this.orders = new OrdersAPI(sharedRequest, settings);
    this.cart = new SessionsAPI(sharedRequest, settings);
    this.coupons = new CouponsAPI(sharedRequest, settings);
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
