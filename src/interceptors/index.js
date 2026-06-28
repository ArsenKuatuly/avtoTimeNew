import axios from 'axios';
import { BASE_URL } from '../config/api.config';

const TOKEN_KEY   = 'avtotime_token';
const REFRESH_KEY = 'avtotime_refresh';

export const axiosClassic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosWithAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axiosClassic.get(
          `/auth/refresh?refresh_token=${refreshToken}`
        );

        const newToken   = data?.token || data?.access_token || data?.data?.token;
        const newRefresh = data?.refresh_token || data?.data?.refresh_token;

        localStorage.setItem(TOKEN_KEY, newToken);
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);

        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosWithAuth(original);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        window.location.href = '/';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
