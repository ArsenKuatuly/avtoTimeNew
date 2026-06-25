import { http } from './http';

const toVehicle = (c) => ({
  id:    c.id,
  model: c.brand?.name   || c.brand_name   || c.model || '',
  make:  c.series?.name  || c.series_name  || c.make  || '',
  plate: c.gov_number    || c.plate_number || c.plate || '',
  body:  c.body?.name    || c.body_name    || c.body  || '',
});

export const VehicleService = {
  getByUser: async (userId, token) => {
    const data = await http.get(`/vehicles/cars/list-by-user/${userId}`, token);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(toVehicle) : [];
  },

  getById: async (carId, token) => {
    const data = await http.get(`/vehicles/cars/${carId}`, token);
    return toVehicle(data?.data || data);
  },
};
