import { axiosClassic } from '../interceptors';

const toCity = (c) => ({ id: c.id, name: c.name || c.title || '' });

export const GeoService = {
  getCities: async (countryId = 1) => {
    const { data } = await axiosClassic.get('/geo/cities/list', { params: { country_id: countryId } });
    const list = data?.data || data || [];
    return Array.isArray(list) ? list.map(toCity) : [];
  },
};
