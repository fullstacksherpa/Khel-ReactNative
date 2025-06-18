import { Env } from '@env';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { showMessage } from 'react-native-flash-message';

import { signOut } from '@/lib/auth/index';
import {
  getAccessToken,
  getToken,
  setToken,
  setUserId,
} from '@/lib/auth/utils';

// ------------------------
// Custom Axios Interfaces
// ------------------------

/**
 * Extend Axios request config to carry our auth metadata.
 * - requiresAuth: disable auth header if set to false
 * - _retry: internal flag to prevent infinite retry loops
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

/**
 * Extend AxiosError to type our custom config
 */
interface CustomAxiosError extends AxiosError {
  config: CustomAxiosRequestConfig;
}

// ------------------------
// Axios Instances
// ------------------------

/**
 * Main HTTP client used for API calls
 */
export const client: AxiosInstance = axios.create({
  baseURL: Env.API_URL,
});

/**
 * Dedicated client for refreshing tokens.
 * Using a separate instance prevents our interceptors from
 * re-firing on the refresh endpoint itself.
 */
const refreshClient: AxiosInstance = axios.create({
  baseURL: Env.API_URL,
});

const isPublicRoute = (url?: string): boolean => {
  if (!url) return false;

  const publicRoutes = [
    '/authentication/user',
    '/authentication/token',
    '/authentication/refresh',
    '/authentication/reset-password',
  ];

  // Match exact or partial (for PATCH /reset-password, etc.)
  return publicRoutes.some((route) => url.startsWith(route));
};

// =========================
// REQUEST INTERCEPTOR
// =========================

client.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    const isPublic = isPublicRoute(config.url);

    // Only attach token if it's not a public route and not explicitly disabled
    const shouldAttachToken =
      accessToken && config.requiresAuth !== false && !isPublic;

    if (shouldAttachToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
let refreshTimeout: NodeJS.Timeout | null = null;
const REFRESH_TIMEOUT_MS = 20000; // 20 seconds

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const onRefreshTimeout = () => {
  showMessage({
    message: 'Session refresh timed out. Please log in again.',
    type: 'danger',
    icon: 'danger',
  });
  signOut();
  refreshSubscribers = [];
  isRefreshing = false;
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);

  if (!refreshTimeout) {
    refreshTimeout = setTimeout(() => {
      onRefreshTimeout();
    }, REFRESH_TIMEOUT_MS);
  }
};

// =========================
// RESPONSE INTERCEPTOR
// =========================

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: CustomAxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = getToken();
      if (!token?.refresh) {
        signOut();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] =
                `Bearer ${newAccessToken}`;
            }
            resolve(client(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await refreshClient.post(
          '/authentication/refresh',
          {
            refresh_token: token.refresh,
          }
        );
        const { access_token, refresh_token, user_id } =
          refreshResponse.data.data;

        setToken({ access: access_token, refresh: refresh_token });
        setUserId(user_id);

        onRefreshed(access_token);

        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
          refreshTimeout = null;
        }

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        signOut();
        console.error('Refresh token failed ❌', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      showMessage({
        message: 'You are not authorized to perform this action.',
        type: 'danger',
        icon: 'warning',
      });
    }

    return Promise.reject(error);
  }
);

// SELF DOCS
{
  /**

 Overall Token Refresh Flow
Initial Request: When your app makes an API request with an expired access token

401 Response: Server responds with 401 Unauthorized

Refresh Attempt: Interceptor detects this and tries to refresh the token

Queue Management: While refreshing, other requests are queued

Token Update: On successful refresh, update tokens and retry original request

Queue Processing: Execute all queued requests with new token

Error Handling: If refresh fails, log user out 

Queue Timeout: If refresh takes too long (e.g., 10s), force logout and notify user
  */
}
