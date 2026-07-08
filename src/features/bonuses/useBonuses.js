import { useState, useEffect, useCallback } from 'react';
import { BonusService } from '../../services/BonusService';

export function useBonuses(userId) {
  const [bonuses,      setBonuses]      = useState(null);
  const [history,      setHistory]      = useState([]);
  const [page,         setPage]         = useState(1);
  const [lastPage,     setLastPage]     = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [histLoading,  setHistLoading]  = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    BonusService.get(userId)
      .then(setBonuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  const loadHistory = useCallback(async (p = 1, append = false) => {
    if (!userId) return;
    setHistLoading(true);
    try {
      const res = await BonusService.getHistory(userId, p);
      setHistory(prev => append ? [...prev, ...res.items] : res.items);
      setPage(res.currentPage);
      setLastPage(res.lastPage);
      setTotal(res.total);
    } catch (e) {
      setError(e);
    } finally {
      setHistLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  const loadMore = () => {
    if (page < lastPage && !histLoading) loadHistory(page + 1, true);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= lastPage && !histLoading) loadHistory(p, false);
  };

  return {
    bonuses,
    history,
    loading,
    histLoading,
    error,
    page,
    lastPage,
    total,
    hasMore: page < lastPage,
    loadMore,
    goToPage,
    refresh: () => {
      BonusService.get(userId).then(setBonuses).catch(setError);
      loadHistory(1);
    },
  };
}
