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

export const PRODUCT_STATUS = Object.freeze({
  LISTED: "listed",
  SOLD: "sold",
  UNLISTED: "unlisted",
  BLOCKED: "blocked",
});

export const PRODUCT_CATEGORIES = Object.freeze({
  ELECTRONICS: "Electronics",
  CLOTHING: "Clothing",
  DAILY_USE: "Daily Use",
  CYCLE: "Cycle",
  OTHERS: "Others",
});

export const PRODUCT_CONDITION = Object.freeze({
  EXCELLENT: "Excellent",
  GOOD: "Good",
  POOR: "Poor",
});

export const PRODUCT_PAYMENT = Object.freeze({
  CASH: "Cash",
  UPI: "UPI",
  BOTH: "Both",
});

export const PRODUCT_USAGE_DURATION = Object.freeze({
  NEW: "New",
  USED: "Used",
  REFURBISHED: "Refurbished",
});

export const PRODUCT_NEGOTIABLE = Object.freeze({
  YES: "Yes",
  NO: "No",
});

export const DEAL_STATUS = Object.freeze({
  NEGOTIATION: "negotiation",
  DEAL_CONFIRMED: "deal_confirmed",
  PICKUP_SCHEDULED: "pickup_scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const enumToArray = (enumObj) => Object.values(enumObj);
