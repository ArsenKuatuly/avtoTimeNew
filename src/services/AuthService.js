import { http } from './http';

export const AuthService = {
  sendCode:     (phone)               => http.post(`/auth/send-code?phone=${phone}`),
  checkCode:    (phone, code)         => http.post(`/auth/check-code?phone=${phone}&code=${code}&type=client`),
  verifyToken:  (token)               => http.get(`/auth/check/${token}`),
  refreshToken: (refreshToken)        => http.get(`/auth/refresh?refresh_token=${refreshToken}`),
  getMe:        (token)               => http.get('/users/me', token),
  updateProfile:(token, data)         => http.post('/users/update-profile', data, token),
};
