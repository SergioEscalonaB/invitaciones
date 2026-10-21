
import * as runtime from "@prisma/client/runtime/index-browser";

export type * from "../models";
export type * from "./prismaNamespace";

export const Decimal = runtime.Decimal;

export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as new (
    secret: never,
  ) => typeof runtime.DbNull,
  JsonNull: runtime.NullTypes.JsonNull as new (
    secret: never,
  ) => typeof runtime.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull as new (
    secret: never,
  ) => typeof runtime.AnyNull,
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const DbNull = runtime.DbNull;

/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const JsonNull = runtime.JsonNull;

/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const AnyNull = runtime.AnyNull;

export const ModelName = {
  Event: "Event",
  Invitation: "Invitation",
  AdminSession: "AdminSession",
  AdminLoginThrottle: "AdminLoginThrottle",
} as const;

export type ModelName = (typeof ModelName)[keyof typeof ModelName];

/*
 * Enums
 */

export const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable",
} as const);

export type TransactionIsolationLevel =
  (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

export const EventScalarFieldEnum = {
  id: "id",
  slug: "slug",
  celebrantName: "celebrantName",
  celebrantTitle: "celebrantTitle",
  celebrantAge: "celebrantAge",
  date: "date",
  displayTime: "displayTime",
  venueName: "venueName",
  venueAddress: "venueAddress",
  googleMapsUrl: "googleMapsUrl",
  dressCode: "dressCode",
  dressCodeDetails: "dressCodeDetails",
  welcomeMessage: "welcomeMessage",
  emotionalQuote: "emotionalQuote",
  parentsNames: "parentsNames",
  godparentsNames: "godparentsNames",
  itinerary: "itinerary",
  giftsInfo: "giftsInfo",
  rsvpDeadline: "rsvpDeadline",
  contactPhone: "contactPhone",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export type EventScalarFieldEnum =
  (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];

export const InvitationScalarFieldEnum = {
  id: "id",
  token: "token",
  guestName: "guestName",
  allowedGuests: "allowedGuests",
  status: "status",
  confirmedGuests: "confirmedGuests",
  attendees: "attendees",
  note: "note",
  sentAt: "sentAt",
  respondedAt: "respondedAt",
  eventId: "eventId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export type InvitationScalarFieldEnum =
  (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum];

export const AdminSessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
} as const;

export type AdminSessionScalarFieldEnum =
  (typeof AdminSessionScalarFieldEnum)[keyof typeof AdminSessionScalarFieldEnum];

export const AdminLoginThrottleScalarFieldEnum = {
  id: "id",
  failures: "failures",
  blockedUntil: "blockedUntil",
  updatedAt: "updatedAt",
} as const;

export type AdminLoginThrottleScalarFieldEnum =
  (typeof AdminLoginThrottleScalarFieldEnum)[keyof typeof AdminLoginThrottleScalarFieldEnum];

export const SortOrder = {
  asc: "asc",
  desc: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const NullableJsonNullValueInput = {
  DbNull: DbNull,
  JsonNull: JsonNull,
} as const;

export type NullableJsonNullValueInput =
  (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

export const JsonNullValueInput = {
  JsonNull: JsonNull,
} as const;

export type JsonNullValueInput =
  (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];

export const QueryMode = {
  default: "default",
  insensitive: "insensitive",
} as const;

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

export const JsonNullValueFilter = {
  DbNull: DbNull,
  JsonNull: JsonNull,
  AnyNull: AnyNull,
} as const;

export type JsonNullValueFilter =
  (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

export const NullsOrder = {
  first: "first",
  last: "last",
} as const;

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
