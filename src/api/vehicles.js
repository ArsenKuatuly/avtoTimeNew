const BASE = 'https://api.services.avtotime.kz/api/v1';

const get = (url, token) =>
  fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);

export const getCarsByUser = (userId, token) =>
  get(`${BASE}/vehicles/cars/list-by-user/${userId}`, token);

export const getCar = (carId, token) =>
  get(`${BASE}/vehicles/cars/${carId}`, token);

export const toCar = (c) => ({
  id:    c.id,
  model: c.brand?.name  || c.brand_name  || c.model || '',
  make:  c.series?.name || c.series_name || c.make  || '',
  plate: c.gov_number   || c.plate_number || c.plate || '',
  body:  c.body?.name   || c.body_name   || c.body  || '',
});
