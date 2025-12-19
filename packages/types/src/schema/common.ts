import { z } from "zod";

export type ApiVersion = "2025-04-15" | "2025-07-15" | "2025-12-15";

export const apiVersion: ApiVersion = "2025-12-15";

export const apiVersionSchema = z.enum(["2025-04-15", "2025-07-15", "2025-12-15"]).default("2025-12-15");

/**
 * A namespaced identifier representing the entity an order is associated with.
 *
 * Must begin with one of the following prefixes:
 * - "evt_" for events
 * - "ven_" for venues
 * - "org_" for organizers
 *
 * @example "evt_abc123"
 * @example "org_def456"
 *
 * @schema string()
 * @pattern ^((evt|ven|org)_[a-zA-Z0-9]+)$
 */
export const contextIdSchema = z.string().regex(/^((evt|ven|org)_[a-zA-Z0-9]+)$/);

/**
 * Schema for MultipartText - a rich content object that supports multiple representations of text.
 * Allows content to be stored and retrieved in various formats (HTML, plain text, markdown, or structured blocks).
 * This enables flexible rendering and editing across different contexts and platforms.
 */
export const multipartTextSchema = z.object({
  /** HTML version of the content. */
  html: z.string().optional().describe("HTML version of the content"),

  /** Plain text version of the content. */
  text: z.string().optional().describe("Plain text version of the content"),

  /** Markdown version of the content. */
  md: z.string().optional().describe("Markdown version of the content"),

  /** Optional rich editor blocks (if structured editing is supported). */
  blocks: z.array(z.any()).nullable().optional().describe("Optional rich editor blocks for structured editing"),
});

/**
 * A photo object with resolution options and optional metadata.
 */
export const photoSchema = z.object({
  /** High-resolution (2x) image URL. */
  "2x": z.string().optional(),

  /** Internal photo ID, if stored in a media system. */
  id: z.string().optional(),

  /**
   * Primary image URL.
   * This is the default image URL to be used when no other resolution is specified.
   *
   * @example "https://picsum.photos/500"
   *
   *
   * @x-faker image.imageUrl
   */
  url: z.string().min(5).max(2048),

  /** Width of the image in pixels. */
  width: z.number().optional(),

  /** Height of the image in pixels. */
  height: z.number().optional(),

  /** Optional caption for the image. */
  caption: z.string().optional(),
});

/**
 * Base metadata for any record stored in the system.
 * Includes an ID and timestamps for creation and optional updates.
 *
 * @export
 */
export const dataRecordSchema = z.object({
  /**
   * Unique identifier for the record.
   * @example "rec_123abc"
   */
  id: z.string(),

  /**
   * ISO 8601 timestamp indicating when the record was created.
   * @example "2025-04-16T10:15:00Z"
   */
  created: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid ISO 8601 date string",
  }).default(new Date().toISOString()),

  /**
   * ISO 8601 timestamp indicating when the record was last updated, if applicable.
   * @example "2025-04-18T08:00:00Z"
   */
  changed: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid ISO 8601 date string",
  }).default(new Date().toISOString()),
});

export const upsertableDataRecordSchema = dataRecordSchema.extend({
  id: dataRecordSchema.shape.id.optional(),
});

/**
 * Extension of `DataRecord` for resources returned from RESTful APIs.
 * Includes a schema version to ensure compatibility with evolving formats.
 *
 * @export
 */
export const versionedDataRecordSchema = dataRecordSchema.extend({
  /**
   * Schema version identifier for this record.
   * Helps manage compatibility across client-server contracts.
   * @example "2025-01-10"
   */
  version: apiVersionSchema,
});
