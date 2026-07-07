import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { BookingService } from '../../services/BookingService';
import { useAsync } from '../../hooks/useAsync';

export function useBookings() {
  const { user } = useAuth();
  const { loading, error, run } = useAsync();

  const [activeFilter,      setActiveFilter]      = useState('Все');
  const [filterPeriod,      setFilterPeriod]      = useState('');
  const [filterStatusDraft, setFilterStatusDraft] = useState('Все');
  const [filterPeriodDraft, setFilterPeriodDraft] = useState('');
  const [page,              setPage]              = useState(1);
  const [selectedBooking,   setSelectedBooking]   = useState(null);
  const [showFilter,        setShowFilter]        = useState(false);
  const [bookings,          setBookings]          = useState([]);
  const [totalPages,        setTotalPages]        = useState(1);

  useEffect(() => {
    if (!user?.id) return;

    const fetchFn = activeFilter === 'Завершён'
      ? () => BookingService.getListFinished({ userId: user.id, page })
      : () => BookingService.getList({ userId: user.id, page });

    run(fetchFn)
      .then(({ items, totalPages: tp }) => {
        setBookings(items);
        setTotalPages(tp);
      })
      .catch(() => {});
  }, [user?.id, activeFilter, page]);

  const activeFilterCount = (activeFilter !== 'Все' ? 1 : 0) + (filterPeriod ? 1 : 0);
  const draftChanged      = filterStatusDraft !== 'Все' || !!filterPeriodDraft;

  const handleFilter = (tab) => {
    setActiveFilter(tab);
    setPage(1);
  };

  const openFilter = () => {
    setFilterStatusDraft(activeFilter);
    setFilterPeriodDraft(filterPeriod);
    setShowFilter(true);
  };

  const applyFilter = () => {
    setActiveFilter(filterStatusDraft);
    setFilterPeriod(filterPeriodDraft);
    setPage(1);
    setShowFilter(false);
  };

  const resetDraft = () => {
    setFilterStatusDraft('Все');
    setFilterPeriodDraft('');
  };

  return {
    loading, error,
    activeFilter,
    filterPeriod,
    filterStatusDraft, setFilterStatusDraft,
    filterPeriodDraft, setFilterPeriodDraft,
    page, setPage,
    paged: bookings, totalPages,
    activeFilterCount,
    draftChanged,
    showFilter, setShowFilter,
    selectedBooking, setSelectedBooking,
    handleFilter,
    openFilter,
    applyFilter,
    resetDraft,
  };
}
