const BASE = 'https://api.services.avtotime.kz/api/v1';

const post = (url) => fetch(url, { method: 'POST' });

const get = (url, token) =>
  fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);

const postJson = (url, body, token) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

export const sendCode = (phone) =>
  post(`${BASE}/auth/send-code?phone=${phone}`);

export const checkCode = (phone, code) =>
  post(`${BASE}/auth/check-code?phone=${phone}&code=${code}&type=client`);

export const getMe = (token) =>
  get(`${BASE}/users/me`, token);

export const updateProfile = (token, data) =>
  postJson(`${BASE}/users/update-profile`, data, token);

export const verifyToken = (token) =>
  get(`${BASE}/auth/check/${token}`);

export const doRefreshToken = (refreshTk) =>
  get(`${BASE}/auth/refresh?refresh_token=${refreshTk}`);
