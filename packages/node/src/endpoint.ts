import { RequestFn } from "./http/request";
import { CohostClientSettings } from "./settings";

/**
 * Base class for all API endpoint groups within the Cohost SDK.
 * Provides shared access to the configured request function and settings.
 */
export class CohostEndpoint {
  /** Shared request function injected from the client */
  protected request: RequestFn;

  /** Client settings passed during instantiation */
  protected settings: CohostClientSettings;

  /**
   * Constructs a new endpoint group.
   *
   * @param request - The shared request function for performing API calls
   * @param settings - The client-wide settings passed from the parent client
   */
  constructor(request: RequestFn, settings: CohostClientSettings) {
    this.request = request;
    this.settings = settings;
  }
}
