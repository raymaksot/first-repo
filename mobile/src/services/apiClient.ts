import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

let tokenProvider: (() => Promise<string | null> | string | null) | null = null;
let baseURL: string | undefined = undefined;

export function configureApiClient(options: { baseURL?: string; getToken?: () => Promise<string | null> | string | null }) {
  baseURL = options.baseURL ?? baseURL;
  tokenProvider = options.getToken ?? tokenProvider;
}

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: baseURL ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? undefined,
    timeout: 20_000,
  });

  client.interceptors.request.use(async (config) => {
    if (tokenProvider) {
      const token = typeof tokenProvider === 'function' ? await tokenProvider() : null;
      if (token) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });

  return client;
}

let sharedClient: AxiosInstance | null = null;

export function apiClient(): AxiosInstance {
  if (!sharedClient) {
    sharedClient = createClient();
  }
  return sharedClient;
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient().get<T>(url, config);
  return data;
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient().post<T>(url, body, config);
  return data;
}

export async function apiPut<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient().put<T>(url, body, config);
  return data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient().delete<T>(url, config);
  return data;
}