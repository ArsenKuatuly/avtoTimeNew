import { http } from './http';

const OPERATION_LABEL = {
  'write-on':  'Начисление',
  'write-off': 'Списание',
  'gift':      'Подарок',
};

const toTransaction = (tx) => ({
  id:          tx.id,
  operation:   tx.operation,
  label:       OPERATION_LABEL[tx.operation] || tx.operation,
  bonusCount:  tx.operation === 'write-off' ? -tx.bonus_count : tx.bonus_count,
  date:        formatDate(tx.created_at),
  dayLabel:    formatDay(tx.created_at),
  orderPrice:  tx.order?.price ?? null,
  plate:       tx.order?.plate ?? null,
});

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
};

const formatDay = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

export const BonusService = {
  get: async (token, userId) => {
    const res = await http.get(`/booking/bonuses/get?user_id=${userId}`, token);
    const d = res?.data || res;
    return {
      bonusCount:   d.bonus_count,
      loyaltyType:  d.loyalty_type,
      loyaltyValue: d.loyalty_value,
      maxUses:      d.max_uses,
    };
  },

  getHistory: async (token, userId, page = 1, perPage = 10) => {
    const qs = new URLSearchParams({ user_id: userId, page, per_page: perPage }).toString();
    const res = await http.get(`/booking/bonuses/get-history?${qs}`, token);
    const list = res?.data || [];
    const meta = res?.meta || {};
    return {
      items:       Array.isArray(list) ? list.map(toTransaction) : [],
      currentPage: meta.current_page ?? page,
      lastPage:    meta.last_page ?? 1,
      total:       meta.total ?? 0,
    };
  },

  setLoyalty: (token, userId, payload) =>
    http.post(`/booking/bonuses/set-loyalty?user_id=${userId}`, payload, token),

  getStatus: (token) =>
    http.get('/booking/bonuses/status', token),
};
