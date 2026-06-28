import { axiosWithAuth } from '../interceptors';

const toVehicle = (c) => ({
  id:    c.id,
  model: c.brand?.name   || c.brand_name   || c.model || '',
  make:  c.series?.name  || c.series_name  || c.make  || '',
  plate: c.gov_number    || c.plate_number || c.plate || '',
  body:  c.body?.name    || c.body_name    || c.body  || '',
});

export const VehicleService = {
  getByUser: async (userId) => {
    const { data } = await axiosWithAuth.get(`/vehicles/cars/list-by-user/${userId}`);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(toVehicle) : [];
  },

  getById: async (carId) => {
    const { data } = await axiosWithAuth.get(`/vehicles/cars/${carId}`);
    return toVehicle(data?.data || data);
  },
};
