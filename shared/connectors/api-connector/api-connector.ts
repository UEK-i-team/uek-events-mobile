import { HttpConnector } from "../http-connector";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.uek-events.com";

export const apiConnector = new HttpConnector(API_BASE_URL, {
  maxRetries: 3,
  retryDelay: 1000,
});
