import { useState, useEffect } from 'react';
import { BookingService } from '../../services/BookingService';
import { VehicleService } from '../../services/VehicleService';
import { useOtpVerification } from '../../hooks/useOtpVerification';
import { toApiDate } from '../../hooks/useDateTimeSlots';

const toApiTime  = (t) => t.length === 5 ? `${t}:00` : t;
const toApiPhone = (formatted) => formatted.replace(/\D/g, '').slice(1);

export function useBookingFlow({ company, user, carId, selectedActions, pickerDate, pickerTime, phone }) {
  const [step, setStep]               = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [draftId, setDraftId]         = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [cars,        setCars]        = useState([]);
  const [carsLoading,  setCarsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setCarsLoading(true);
    VehicleService.getByUser(user.id)
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setCarsLoading(false));
  }, [user?.id]);

  const otp = useOtpVerification();

  const handleConfirmBooking = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const draft = await BookingService.createDraft({
        partnerId:   company?.id,
        userId:      user?.id,
        carId,
        date:        toApiDate(pickerDate),
        time:        toApiTime(pickerTime),
        offeringIds: selectedActions.map(a => a.id),
      });
      setDraftId(draft?.data?.draft_id || draft?.draft_id);
      await otp.sendCode(toApiPhone(phone));
      setShowConfirm(false);
      setStep(2);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Не удалось создать запись. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = () => otp.resendCode(toApiPhone(phone));

  const handleVerifyCode = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      await otp.verifyCode(toApiPhone(phone));
      await BookingService.book(draftId);
      const checkoutData = await BookingService.checkout(draftId);
      const payUrl = checkoutData?.payment_url || checkoutData?.url || checkoutData?.redirect_url
        || checkoutData?.data?.payment_url || checkoutData?.data?.url;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        setStep(3);
      }
    } catch {
      setSubmitError('Неверный код или не удалось завершить оплату.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step, setStep,
    showConfirm, setShowConfirm,
    submitting, submitError,
    cars, carsLoading,
    otp,
    handleConfirmBooking, handleResendCode, handleVerifyCode,
  };
}
