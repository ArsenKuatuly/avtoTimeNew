import { axiosWithAuth } from '../interceptors';

const STATUS_MAP = {
  new:         'Новый',
  created:     'Новый',
  in_progress: 'В процессе',
  processing:  'В процессе',
  completed:   'Завершён',
  cancelled:   'Отменён',
};

const rawStatus = (b) =>
  typeof b.status === 'object' ? (b.status?.code || b.status?.name || '') : (b.status || '');

const rawType = (b) =>
  typeof b.type === 'object' ? (b.type?.code || b.type?.name || '') : (b.type || '');

const toBooking = (b) => ({
  id:      b.id,
  label:   rawType(b) === 'queue' ? 'Запись в очередь' : 'Онлайн-запись',
  service: Array.isArray(b.services)
    ? b.services.map(s => s.name).join(' · ')
    : Array.isArray(b.offerings)
      ? b.offerings.map(o => o.name).join(' · ')
      : (b.service || ''),
  price:   b.total_price != null
    ? `${Number(b.total_price).toLocaleString('ru')} ₸`
    : b.summary?.total != null
      ? `${Number(b.summary.total).toLocaleString('ru')} ₸`
      : (b.price || ''),
  date:    b.scheduled_at
    ? formatDate(b.scheduled_at)
    : b.date && b.time
      ? formatDate(`${b.date}T${b.time}`)
      : (b.date || ''),
  wash:    b.partner?.name  || b.car_wash?.name    || b.wash    || '',
  address: b.partner?.address || b.car_wash?.address || b.address || '',
  status:  STATUS_MAP[rawStatus(b)] || rawStatus(b),
  payment: b.payment?.card_amount > 0 ? 'Картой онлайн' : 'Наличными',
  name:    b.user?.name || b.user?.first_name || b.name || '',
});

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
};

const buildTimeline = (statusChanges, currentCode) => {
  const steps = [
    { code: 'created',    label: 'Встал в очередь', sub: null },
    { code: 'processing', label: 'Начало мойки',    sub: null },
    { code: 'completed',  label: 'Завершено',        sub: null },
  ];

  const changeMap = {};
  (statusChanges || []).forEach(sc => {
    if (sc.status?.code) changeMap[sc.status.code] = sc.slot;
  });

  return steps.map(step => {
    const slot      = changeMap[step.code];
    const isCurrent = step.code === currentCode;
    const isHistory = !!slot;

    let state;
    if (isCurrent && currentCode === 'completed') state = 'done';
    else if (isCurrent)  state = 'active';
    else if (isHistory)  state = 'done';
    else                 state = 'pending';

    return { ...step, state, time: slot ? slot.slice(11, 16) : null };
  });
};

const toBookingDetail = (b) => {
  const code = rawStatus(b);
  return {
    ...toBooking(b),
    statusCode: code,
    queueNum:   b.queue_number ?? null,
    carsBefore: null,
    timeline:   code !== 'cancelled' ? buildTimeline(b.status_changes, code) : null,
    car: b.car ? {
      brand: b.car.brand?.name  || '',
      model: b.car.series?.name || '',
      plate: b.car.plate        || '',
      body:  b.car.body?.name   || '',
    } : null,
  };
};

export const BookingService = {
  getList: async ({ userId, page = 1 } = {}) => {
    const { data } = await axiosWithAuth.get('/booking/list', { params: { user_id: userId, page } });
    const list = data?.data || [];
    return {
      items:       Array.isArray(list) ? list.map(toBooking) : [],
      totalPages:  data?.meta?.last_page    ?? 1,
      currentPage: data?.meta?.current_page ?? 1,
    };
  },

  getListFinished: async ({ userId, page = 1 } = {}) => {
    const { data } = await axiosWithAuth.get('/booking/list-finished', { params: { user_id: userId, page } });
    const list = data?.data || [];
    return {
      items:       Array.isArray(list) ? list.map(toBooking) : [],
      totalPages:  data?.meta?.last_page    ?? 1,
      currentPage: data?.meta?.current_page ?? 1,
    };
  },

  getById: async (id) => {
    const { data } = await axiosWithAuth.get(`/booking/get/${id}`);
    return toBookingDetail(data?.data || data);
  },

  create: (payload) =>
    axiosWithAuth.post('/bookings', payload).then(r => r.data),

  createDraft: ({ partnerId, userId, carId, date, time, offeringIds }) =>
    axiosWithAuth.post('/booking/create-draft', null, {
      params: { partner_id: partnerId, user_id: userId, car_id: carId, date, time, offerings: offeringIds },
    }).then(r => r.data),

  createDraftLQ: ({ partnerId, userId, carId, date, offeringIds, isInner = 1 }) =>
    axiosWithAuth.post('/booking/create-draft-lq', null, {
      params: { partner_id: partnerId, user_id: userId, car_id: carId, date, offerings: offeringIds, is_inner: isInner },
    }).then(r => r.data),

  book: (draftId) =>
    axiosWithAuth.post('/booking/book', null, { params: { draft_id: draftId } }).then(r => r.data),

  addToQueue: (draftId) =>
    axiosWithAuth.post('/booking/add-to-queue', null, { params: { draft_id: draftId } }).then(r => r.data),

  checkout: (draftId) =>
    axiosWithAuth.get('/booking/checkout', { params: { draft_id: draftId } }).then(r => r.data),

  cancel: (id, reason) =>
    axiosWithAuth.post(`/booking/delete/${id}`, { reason }).then(r => r.data),

  addReview: (id, { rating, comment }) =>
    axiosWithAuth.post(`/bookings/${id}/reviews`, { rating, comment }).then(r => r.data),
};
