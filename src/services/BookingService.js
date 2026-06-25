import { http } from './http';

const STATUS_MAP = {
  new:         'Новый',
  in_progress: 'В процессе',
  completed:   'Завершён',
  cancelled:   'Отменён',
};

const toBooking = (b) => ({
  id:      b.id,
  label:   b.type === 'queue' ? 'Запись в очередь' : 'Онлайн-запись',
  service: Array.isArray(b.services) ? b.services.map(s => s.name).join(' · ') : (b.service || ''),
  price:   b.total_price != null ? `${Number(b.total_price).toLocaleString('ru')} ₸` : (b.price || ''),
  date:    b.scheduled_at ? formatDate(b.scheduled_at) : (b.date || ''),
  wash:    b.car_wash?.name || b.wash || '',
  address: b.car_wash?.address || b.address || '',
  status:  STATUS_MAP[b.status] || b.status || '',
  payment: b.payment_method === 'card' ? 'Картой онлайн' : 'Наличными',
  name:    b.user?.first_name || b.name || '',
});

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
};

export const BookingService = {
  getList: async (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const data = await http.get(`/bookings${qs ? `?${qs}` : ''}`, token);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(toBooking) : [];
  },

  getById: async (id, token) => {
    const data = await http.get(`/bookings/${id}`, token);
    return toBooking(data?.data || data);
  },

  create: (token, payload) =>
    http.post('/bookings', payload, token),

  cancel: (id, token, reason) =>
    http.patch(`/bookings/${id}/cancel`, { reason }, token),

  addReview: (id, token, { rating, comment }) =>
    http.post(`/bookings/${id}/reviews`, { rating, comment }, token),
};
