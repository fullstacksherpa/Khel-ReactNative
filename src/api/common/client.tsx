import { Env } from '@env';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { signOut } from '@/lib';
import {
  getAccessToken,
  getToken,
  removeToken,
  setToken,
  setUserId,
} from '@/lib/auth/utils';

// Extend Axios's request config type
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean; // Allow optional requiresAuth property
  _retry?: boolean;
}

// Create an Axios client
export const client = axios.create({
  baseURL: Env.API_URL,
});

// ✅ Request Interceptor: Attach Access Token
client.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken && config.requiresAuth !== false) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle Token Expiry & Refresh Automatically
client.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If request failed with 401 (Unauthorized) & is NOT a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      const token = getToken(); // Get stored token
      if (!token?.refresh) {
        removeToken(); // No refresh token → Log out user
        return Promise.reject(error);
      }

      try {
        // 🔄 Request a new access token using refresh token
        const response = await axios.post(
          `${Env.API_URL}/authentication/refresh`,
          {
            refresh_token: token.refresh,
          }
        );
        console.log('Refreshing token...');

        // ✅ Ensure you're extracting the tokens from the response correctly
        const { access_token, refresh_token, user_id } = response.data;

        // Save new access & refresh tokens
        setToken({ access: access_token, refresh: refresh_token });
        setUserId(user_id);

        // 🔄 Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return client(originalRequest); // Retry request
      } catch (refreshError) {
        signOut(); // Refresh failed → Log out user
        console.error('Token refresh failed:', refreshError); // Log the error for debugging
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//way to use auth header
// client.get('/public-endpoint', { requiresAuth: false });
// client.get('/private-endpoint'); // Defaults to requiresAuth: true
