import { useState, useEffect } from 'react';
import { BookingService } from '../../services/BookingService';
import { useAsync } from '../../hooks/useAsync';

export function useBookingDetail(id) {
  const { loading, error, run } = useAsync();
  const { error: actionError, run: runAction } = useAsync();
  const [booking,   setBooking]  = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const [reviewed,  setReviewed]  = useState(false);
  const [toast,     setToast]     = useState(false);
  const [toastError, setToastError] = useState(false);

  useEffect(() => {
    if (!id) return;
    run(() => BookingService.getById(id))
      .then(setBooking)
      .catch(() => {});
  }, [id]);

  const showToast = (isError = false) => {
    setToastError(isError);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleCancel = (reason) =>
    runAction(() => BookingService.cancel(id, reason))
      .then(() => { setCancelled(true); showToast(); })
      .catch(() => showToast(true));

  const handleReview = (rating, comment) =>
    runAction(() => BookingService.addReview(id, { rating, comment }))
      .then(() => { setReviewed(true); showToast(); })
      .catch(() => showToast(true));

  return {
    loading, error,
    actionError,
    booking,
    cancelled, reviewed, toast, toastError,
    handleCancel, handleReview,
  };
}
