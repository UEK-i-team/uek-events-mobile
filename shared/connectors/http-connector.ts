import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export interface IHttpConnector {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
}

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

export class HttpConnector implements IHttpConnector {
  protected axiosInstance: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;
  private retryCondition: (error: AxiosError) => boolean;

  constructor(baseURL: string, retryConfig?: RetryConfig) {
    this.maxRetries = retryConfig?.maxRetries ?? 3;
    this.retryDelay = retryConfig?.retryDelay ?? 1000;
    this.retryCondition =
      retryConfig?.retryCondition ?? this.defaultRetryCondition.bind(this);

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 6000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  private defaultRetryCondition(error: AxiosError): boolean {
    if (!error.response) {
      return true;
    }
    const status = error.response.status;
    // Retry on server errors (5xx)
    return status >= 500 && status < 600;
  }

  private async delay(retryCount: number): Promise<void> {
    // Exponential backoff: 1s, 2s, 4s...
    const delayTime = this.retryDelay * Math.pow(2, retryCount);
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor with retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & {
          _retryCount?: number;
        };

        if (!config) {
          return Promise.reject(error);
        }

        config._retryCount = config._retryCount ?? 0;

        const shouldRetry =
          config._retryCount < this.maxRetries && this.retryCondition(error);

        if (shouldRetry) {
          config._retryCount += 1;
          console.warn(
            `⚠️ Retry attempt ${config._retryCount}/${this.maxRetries} for ${config.url}`,
          );

          await this.delay(config._retryCount - 1);

          return this.axiosInstance.request(config);
        }

        console.error(
          `❌ Request failed after ${config._retryCount} retries: ${error.message}`,
        );
        return Promise.reject(error);
      },
    );
  }
}
