/*
How to use the enums:

import { PRODUCT_STATUS, USER_ROLES } from "../config/constants.js";

PRODUCT_STATUS.SOLD
USER_ROLES.ADMIN
*/

// Object Freeze will prevent the object from being modified
export const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  SUPPORT: "support",
});

export const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
});

export const PRODUCT_STATUS = Object.freeze({
  LISTED: "listed",
  SOLD: "sold",
  UNLISTED: "unlisted",
  BLOCKED: "blocked",
});

export const PRODUCT_CATEGORIES = Object.freeze({
  ELECTRONICS: "electronics",
  CLOTHING: "clothing",
  DAILY_USE: "daily_use",
  CYCLE: "cycle",
  OTHERS: "others",
});

export const PRODUCT_CONDITION = Object.freeze({
  EXCELLENT: "excellent",
  GOOD: "good",
  POOR: "poor",
});

export const PRODUCT_PAYMENT = Object.freeze({
  CASH: "cash",
  UPI: "upi",
  BOTH: "both",
});

export const PRODUCT_USAGE_DURATION = Object.freeze({
  NEW: "new",
  USED: "used",
  REFURBISHED: "refurbished",
});

export const PRODUCT_NEGOTIABLE = Object.freeze({
  YES: "yes",
  NO: "no",
});

export const DEAL_STATUS = Object.freeze({
  NEGOTIATION: "negotiation",
  DEAL_CONFIRMED: "deal_confirmed",
  PICKUP_SCHEDULED: "pickup_scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const REPORT_REASONS = Object.freeze({
  SPAM: "spam",
  FAKE: "fake",
  INAPPROPRIATE: "inappropriate",
  SCAM: "scam",
  OTHER: "other",
});

export const enumToArray = (enumObj) => Object.values(enumObj);
