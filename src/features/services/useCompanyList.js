import { useState, useEffect, useRef } from 'react';
import { BASE_URL, IMAGE_BASE } from '../../config/api.config';

export const RATING_OPTIONS = [3, 3.5, 4, 4.9];

const toAbsUrl = s => !s ? null : s.startsWith('http') ? s : `${IMAGE_BASE}${s}`;

export const getImages  = c => {
  const fromArr = (c.images || []).map(i => toAbsUrl(i?.url || i?.path)).filter(Boolean);
  if (fromArr.length) return fromArr;
  const fb = toAbsUrl(c.image_url || c.photo || c.cover_image);
  return fb ? [fb] : [];
};
export const getImage   = c => getImages(c)[0] || null;
export const getRating  = c => c.rating || 0;
export const getCount   = c => c.reviews_count || 0;
export const getAddress = c => c.address || '';
export const getType    = c => c.type?.name || 'Автомойка';
export const getDesc    = c => c.profile?.description || c.description || '';

export function useCompanyList(serviceType) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [listError, setListError] = useState(null);
  const [search, setSearch]       = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [minRating, setMinRating]   = useState(null);
  const [ratingDropOpen, setRatingDropOpen] = useState(false);
  const [slidesMap, setSlidesMap]   = useState({});
  const ratingRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ratingRef.current && !ratingRef.current.contains(e.target)) {
        setRatingDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    setListError(null);
    fetch(`${BASE_URL}/partners/list?with_profile=true&per_page=100&city_id=1&id_sort=true`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        const filtered = serviceType === 'carwash'
          ? list.filter(c => c.type?.code === 'carwash')
          : list.filter(c => c.type?.code !== 'carwash');
        setCompanies(filtered);
      })
      .catch(() => setListError('Не удалось загрузить список. Попробуйте позже.'))
      .finally(() => setLoading(false));
  }, [serviceType]);

  const filtered = companies.filter(c => {
    if (!(c.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (filterOpen && !getRating(c)) return false;
    if (minRating !== null && getRating(c) < minRating) return false;
    return true;
  });

  const getSlide = id => slidesMap[id] || 0;
  const setSlide = (id, idx, e) => { e.stopPropagation(); setSlidesMap(m => ({ ...m, [id]: idx })); };

  return {
    companies, filtered, loading, listError,
    search, setSearch,
    filterOpen, setFilterOpen,
    minRating, setMinRating,
    ratingDropOpen, setRatingDropOpen, ratingRef,
    getSlide, setSlide,
  };
}
