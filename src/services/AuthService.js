import { axiosClassic, axiosWithAuth } from '../interceptors';

export const AuthService = {
  sendCode:     (phone)        => axiosClassic.post(`/auth/send-code?phone=${phone}`).then(r => r.data),
  checkCode:    (phone, code)  => axiosClassic.post(`/auth/check-code?phone=${phone}&code=${code}&type=client`).then(r => r.data),
  verifyToken:  (token)        => axiosClassic.get(`/auth/check/${token}`).then(r => r.data),
  refreshToken: (refreshToken) => axiosClassic.get(`/auth/refresh?refresh_token=${refreshToken}`).then(r => r.data),
  getMe:        ()             => axiosWithAuth.get('/users/me').then(r => r.data),
  updateProfile:(data)         => axiosWithAuth.post('/users/update-profile', data).then(r => r.data),
};
