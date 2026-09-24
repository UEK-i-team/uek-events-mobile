import { isAxiosError } from "axios";

export interface SafeErrorDescription {
  name?: string;
  message: string;
  code?: string;
  status?: number;
  method?: string;
  url?: string;
}

/**
 * Picks log-safe fields from an error. Never log a raw AxiosError: its config
 * carries request headers, including the Authorization bearer token.
 */
export function describeError(error: unknown): SafeErrorDescription {
  if (isAxiosError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      method: error.config?.method,
      url: error.config?.url?.split("?")[0],
    };
  }

  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { message: String(error) };
}
