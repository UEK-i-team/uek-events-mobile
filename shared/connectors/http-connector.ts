import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Konfiguracja dla retry logic
 */
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

/**
 * Bazowa klasa HTTP Connector z automatycznym retry mechanizmem
 */
export class HttpConnector {
  protected axiosInstance: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;
  private retryCondition: (error: AxiosError) => boolean;

  constructor(baseURL: string, retryConfig?: RetryConfig) {
    this.maxRetries = retryConfig?.maxRetries ?? 3;
    this.retryDelay = retryConfig?.retryDelay ?? 1000;
    this.retryCondition = retryConfig?.retryCondition ?? this.defaultRetryCondition;

    // Tworzenie instancji Axios
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Domyślny warunek dla retry - ponawiaj tylko dla błędów sieciowych i 5xx
   */
  private defaultRetryCondition(error: AxiosError): boolean {
    if (!error.response) {
      // Błąd sieciowy (brak połączenia)
      return true;
    }

    const status = error.response.status;
    // Ponawiaj dla błędów serwera (5xx)
    return status >= 500 && status < 600;
  }

  /**
   * Opóźnienie przed ponowną próbą (exponential backoff)
   */
  private async delay(retryCount: number): Promise<void> {
    const delayTime = this.retryDelay * Math.pow(2, retryCount);
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  /**
   * Konfiguracja interceptorów
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Możesz tu dodać np. tokeny autoryzacji
        console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor z retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retryCount?: number };

        if (!config) {
          return Promise.reject(error);
        }

        // Inicjalizacja licznika prób
        config._retryCount = config._retryCount ?? 0;

        // Sprawdzenie czy należy ponowić próbę
        const shouldRetry =
          config._retryCount < this.maxRetries && this.retryCondition(error);

        if (shouldRetry) {
          config._retryCount += 1;
          console.warn(
            `⚠️ Retry attempt ${config._retryCount}/${this.maxRetries} for ${config.url}`
          );

          // Czekaj przed ponowną próbą (exponential backoff)
          await this.delay(config._retryCount - 1);

          // Ponów request
          return this.axiosInstance.request(config);
        }

        console.error(`❌ Request failed after ${config._retryCount} retries:`, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Metoda do ustawienia tokenu autoryzacji
   */
  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Metoda do usunięcia tokenu autoryzacji
   */
  public removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Metoda GET
   */
  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * Metoda POST
   */
  protected async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * Metoda PUT
   */
  protected async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * Metoda PATCH
   */
  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * Metoda DELETE
   */
  protected async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

