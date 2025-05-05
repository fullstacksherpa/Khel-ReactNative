import { Env } from '@env';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { signOut } from '@/lib/auth/index';
import {
  getAccessToken,
  getToken,
  setToken,
  setUserId,
} from '@/lib/auth/utils';

// Extend Axios config to support auth metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

// Extend Axios error to handle typed config
interface CustomAxiosError extends AxiosError {
  config: CustomAxiosRequestConfig;
}

// Create Axios instance
export const client: AxiosInstance = axios.create({
  baseURL: Env.API_URL,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
client.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    // Attach access token unless explicitly disabled
    if (accessToken && config.requiresAuth !== false) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// REFRESH TOKEN QUEUE
// =========================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// =========================
// RESPONSE INTERCEPTOR
// =========================
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: CustomAxiosError) => {
    const originalRequest = error.config;

    // Only handle 401 errors on requests that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = getToken();
      if (!token?.refresh) {
        signOut();
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken: string) => {
            originalRequest.headers.set(
              'Authorization',
              `Bearer ${newAccessToken}`
            );
            resolve(client(originalRequest));
          });
        });
      }

      // Start refreshing process
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${Env.API_URL}/authentication/refresh`,
          {
            refresh_token: token.refresh,
          }
        );

        const { access_token, refresh_token, user_id } =
          refreshResponse.data.data;

        // Update stored tokens
        setToken({ access: access_token, refresh: refresh_token });
        setUserId(user_id);

        onRefreshed(access_token); // Notify all subscribers waiting for new token

        originalRequest.headers.set('Authorization', `Bearer ${access_token}`);

        return client(originalRequest); // Retry original request
      } catch (refreshError) {
        signOut(); // Force logout
        console.error('Refresh token failed ❌', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
