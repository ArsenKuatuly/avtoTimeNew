import { useState } from 'react';
import { MOCK_BOOKINGS } from '../../constants/mockBookings';

const PAGE_SIZE = 5;

export function useBookings() {
  const [activeFilter,      setActiveFilter]      = useState('Все');
  const [filterPeriod,      setFilterPeriod]      = useState('');
  const [filterStatusDraft, setFilterStatusDraft] = useState('Все');
  const [filterPeriodDraft, setFilterPeriodDraft] = useState('');
  const [page,              setPage]              = useState(1);
  const [selectedBooking,   setSelectedBooking]   = useState(null);
  const [showFilter,        setShowFilter]        = useState(false);

  const filtered   = activeFilter === 'Все'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter(b => b.status === activeFilter);

  const totalPages       = Math.ceil(filtered.length / PAGE_SIZE);
  const paged            = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilterCount = (activeFilter !== 'Все' ? 1 : 0) + (filterPeriod ? 1 : 0);
  const draftChanged     = filterStatusDraft !== 'Все' || !!filterPeriodDraft;

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
    activeFilter,
    filterPeriod,
    filterStatusDraft, setFilterStatusDraft,
    filterPeriodDraft, setFilterPeriodDraft,
    page, setPage,
    paged, totalPages,
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
