import { PaginatedRequest } from "../../types";
import { apiBaseUrl } from "../apiVersion";
import { CohostError } from "../error/CohostError";
import { defaultSettings, runtimeOverrides } from "../settings";
import { Pagination } from "../types/pagination";

/**
 * Options for configuring the request handler.
 */
interface RequestProps {
  /** API token for authentication (Bearer token). */
  token: string | null;

  /** Base URL of the API (defaults to versioned `apiBaseUrl`). */
  baseUrl?: string;

  /** Enable debug logging of requests/responses. */
  debug?: boolean;
}

/**
 * Supported HTTP methods.
 */
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestOptions = {
  method?: RequestMethod;
  data?: any;
  query?: Record<string, string | number | boolean | string[] | undefined>;
  headers?: Record<string, string>;
  pagination?: Pagination;
};

export const paginatedOptions = (req: PaginatedRequest<any>, options?: Partial<RequestOptions>): RequestOptions => {
  const { pagination, ...rest } = req;
  return {
    query: rest,
    pagination,
    ...options,
  };
};

/**
 * Builds a query string from a flat object, supporting array values via repeated keys.
 */
const buildQueryString = (
  input?: Record<string, string | number | boolean | string[] | undefined>
): string => {
  if (!input) return "";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.set(key, String(value));
    }
  }
  return params.toString() ? `?${params.toString()}` : "";
};

/**
 * A function that performs a request to the Cohost API.
 * The generic <T> allows you to specify the expected response type.
 */
type RequestFn = <T = any>(
  path: string,
  options?: RequestOptions
) => Promise<T>;

/**
 * Creates a request function configured with authentication and client defaults.
 * The returned function supports generic return typing via <T>.
 */
const request = ({ token, baseUrl = apiBaseUrl, debug = false }: RequestProps): RequestFn => {
  return async function <T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", data, query, pagination, headers = {} } = options;

    const _query = {
      ...query,
      ...pagination,
    };

    const queryString = buildQueryString(_query);
    const finalBaseUrl = runtimeOverrides.baseUrl ?? baseUrl;
    const url = `${finalBaseUrl}${path}${queryString}`;

    const reqHeaders: Record<string, string> = {
      ...defaultSettings.headers,
      ...runtimeOverrides.headers,
      ...headers,
    };

    if (token) {
      reqHeaders["Authorization"] = `Bearer ${token}`;
    }

    const body = data && method !== "GET" ? JSON.stringify(data) : undefined;

    if (debug) {
      console.log(`[Cohost SDK] Request: ${method} ${url}`);
      if (body) console.log(`[Cohost SDK] Body:`, body);

      const cleanHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(reqHeaders)) {
        if (key.toLowerCase() === "authorization") {
            const tokenValue = value?.split(" ")[1];
            cleanHeaders[key] = "Bearer <token-" + (tokenValue ? `${tokenValue[0]}...${tokenValue.slice(-4)}>` : "");
        } else {
          cleanHeaders[key] = value;
        }
      }

      console.log(`[Cohost SDK] Headers:`, cleanHeaders);
    }

    const res = await fetch(url, {
      method,
      headers: reqHeaders,
      body,
    });

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const responseBody = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody);
      console.error(`[Cohost SDK] Error(${res.status}): ${message}`, { url });
      throw new CohostError(message || res.statusText, {
        errorCode: res.statusText || "API_ERROR",
        statusCode: res.status,
      });
    }

    if (
      typeof responseBody === "object" &&
      responseBody !== null &&
      (responseBody as any).status === "ok" &&
      "data" in responseBody
    ) {
      return (responseBody as { data: T }).data;
    }

    return responseBody as T;
  };
};

export { type RequestProps, type RequestFn };
export { request };
