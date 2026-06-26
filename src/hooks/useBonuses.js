import { useState, useEffect, useCallback } from 'react';
import { BonusService } from '../services/BonusService';

export function useBonuses(token, userId) {
  const [bonuses,      setBonuses]      = useState(null);
  const [history,      setHistory]      = useState([]);
  const [page,         setPage]         = useState(1);
  const [lastPage,     setLastPage]     = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [histLoading,  setHistLoading]  = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!token || !userId) return;
    setLoading(true);
    BonusService.get(token, userId)
      .then(setBonuses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token, userId]);

  const loadHistory = useCallback(async (p = 1) => {
    if (!token || !userId) return;
    setHistLoading(true);
    try {
      const res = await BonusService.getHistory(token, userId, p);
      setHistory(prev => p === 1 ? res.items : [...prev, ...res.items]);
      setPage(res.currentPage);
      setLastPage(res.lastPage);
      setTotal(res.total);
    } catch (e) {
      setError(e);
    } finally {
      setHistLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  const loadMore = () => {
    if (page < lastPage && !histLoading) loadHistory(page + 1);
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
    refresh: () => {
      BonusService.get(token, userId).then(setBonuses).catch(setError);
      loadHistory(1);
    },
  };
}
