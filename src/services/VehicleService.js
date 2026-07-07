import { axiosWithAuth } from '../interceptors';

const toVehicle = (c) => ({
  id:    c.id,
  model: c.brand?.name   || c.brand_name   || c.model || '',
  make:  c.series?.name  || c.series_name  || c.make  || '',
  plate: c.gov_number    || c.plate_number || c.plate || '',
  body:  c.body?.name    || c.body_name    || c.body  || '',
});

const toPayload = (data) => ({
  brand_id:    Number(data.brandId),
  series_id:   Number(data.seriesId),
  brand_name:  data.model,
  series_name: data.make,
  plate:       data.plate,
  body_name:   data.body,
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

  create: async (formData, userId) => {
    const payload = { ...toPayload(formData), user_id: userId };
    console.log('[VehicleService.create] payload:', payload);
    try {
      const { data } = await axiosWithAuth.post('/vehicles/cars/create', payload);
      return toVehicle(data?.data || data);
    } catch (err) {
      console.error('[VehicleService.create] error response:', err.response?.data);
      throw err;
    }
  },

  update: async (id, formData) => {
    const payload = { ...toPayload(formData), car_id: id };
    console.log('[VehicleService.update] payload:', payload);
    try {
      const { data } = await axiosWithAuth.post('/vehicles/cars/update', payload);
      return toVehicle(data?.data || data);
    } catch (err) {
      console.error('[VehicleService.update] error response:', err.response?.data);
      throw err;
    }
  },

  delete: async (id) => {
    await axiosWithAuth.post(`/vehicles/cars/delete/${id}`);
  },

  getBrands: async () => {
    const { data } = await axiosWithAuth.get('/vehicles/brands/list?per_page=999');
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(b => ({ id: b.id, name: b.name || b.title || '' })) : [];
  },

  seriesByBrand: async (brandId) => {
    const { data } = await axiosWithAuth.get(`/vehicles/series/list-by-brand/${brandId}?per_page=999`);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(s => ({ id: s.id, name: s.name || s.title || '' })) : [];
  },

  generationsBySeries: async (seriesId) => {
    const { data } = await axiosWithAuth.get(`/vehicles/generations/list-by-series/${seriesId}`);
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(g => ({ id: g.id, name: g.name || g.title || '' })) : [];
  },
};
