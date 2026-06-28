import { axiosWithAuth } from '../interceptors';

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
  getList: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const { data } = await axiosWithAuth.get(`/bookings${qs ? `?${qs}` : ''}`);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(toBooking) : [];
  },

  getById: async (id) => {
    const { data } = await axiosWithAuth.get(`/bookings/${id}`);
    return toBooking(data?.data || data);
  },

  create: (payload) =>
    axiosWithAuth.post('/bookings', payload).then(r => r.data),

  cancel: (id, reason) =>
    axiosWithAuth.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data),

  addReview: (id, { rating, comment }) =>
    axiosWithAuth.post(`/bookings/${id}/reviews`, { rating, comment }).then(r => r.data),
};
