import { useState, useEffect } from 'react';
import { BookingService } from '../../services/BookingService';
import { useAsync } from '../../hooks/useAsync';

export function useBookingDetail(id) {
  const { loading, error, run } = useAsync();
  const [booking,   setBooking]  = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const [reviewed,  setReviewed]  = useState(false);
  const [toast,     setToast]     = useState(false);

  useEffect(() => {
    if (!id) return;
    run(() => BookingService.getById(id))
      .then(setBooking)
      .catch(() => {});
  }, [id]);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleCancel = (reason) =>
    run(() => BookingService.cancel(id, reason))
      .then(() => { setCancelled(true); showToast(); })
      .catch(() => {});

  const handleReview = (rating, comment) =>
    run(() => BookingService.addReview(id, { rating, comment }))
      .then(() => { setReviewed(true); showToast(); })
      .catch(() => {});

  return {
    loading, error,
    booking,
    cancelled, reviewed, toast,
    handleCancel, handleReview,
  };
}
