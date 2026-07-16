import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config/api.config';

export function useCompanyDetail(user) {
  const [selected, setSelected]           = useState(null);
  const [tab, setTab]                     = useState('services');
  const [actions, setActions]             = useState([]);
  const [reviews, setReviews]             = useState([]);
  const [checkedActions, setCheckedActions] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError,   setDetailError]   = useState(null);
  const [imgIndex, setImgIndex]           = useState(0);
  const [reviewsTotal, setReviewsTotal]   = useState(0);

  useEffect(() => {
    if (!selected) return;
    setDetailLoading(true);
    setDetailError(null);
    setActions([]);
    setReviews([]);
    setReviewsTotal(0);
    setCheckedActions([]);
    setTab('services');
    setImgIndex(0);

    Promise.all([
      fetch(`${BASE_URL}/partner-offerings/list?partner_id=${selected.id}`)
        .then(r => r.json()),
      fetch(`${BASE_URL}/partners/${selected.id}/reviews?page=1&per_page=15`)
        .then(r => r.json()).catch(() => ({ data: { reviews: [] } })),
    ]).then(([actData, revData]) => {
      setReviewsTotal(revData.data?.total || 0);
      setActions(actData.data || []);
      setReviews(revData.data?.reviews || []);
      setDetailLoading(false);
    }).catch(() => {
      setDetailError('Не удалось загрузить информацию. Попробуйте позже.');
      setDetailLoading(false);
    });
  }, [selected]);

  const toggleAction = (id) => {
    setCheckedActions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getPrice = (a) => {
    const userBodyId = user?.body_id;
    const body = userBodyId ? a.car_bodies?.find(b => b.body_id === userBodyId) : a.car_bodies?.[0];
    if (body) return body.action_price ?? body.price ?? 0;
    return a.payable_value ?? 0;
  };

  const getOldPrice = (a) => {
    const userBodyId = user?.body_id;
    const body = userBodyId ? a.car_bodies?.find(b => b.body_id === userBodyId) : a.car_bodies?.[0];
    if (body?.action_price != null) return body.price;
    return null;
  };

  return {
    selected, setSelected,
    tab, setTab,
    actions, reviews, reviewsTotal,
    checkedActions, toggleAction,
    detailLoading, detailError,
    imgIndex, setImgIndex,
    getPrice, getOldPrice,
  };
}
