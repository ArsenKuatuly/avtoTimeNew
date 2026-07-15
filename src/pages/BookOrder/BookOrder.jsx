import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';
import { ROUTES } from '../../config/routes.config';
import { formatDateLabel } from '../../utils/formatDate';
import { useDateTimeSlots } from '../../hooks/useDateTimeSlots';
import { useBookingFlow } from '../../features/bookings/useBookingFlow';
import SuccessStep from './steps/SuccessStep';
import OtpStep from './steps/OtpStep';
import DatePickerStep from './steps/DatePickerStep';
import BookingFormStep from './steps/BookingFormStep';

const bookingSchema = yup.object({
  name:  yup.string().trim().required('Введите имя'),
  phone: yup.string()
    .required('Введите номер телефона')
    .test('phone', 'Введите корректный номер', v => v && v.replace(/\D/g, '').length === 11),
});

export default function BookOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { company, selectedActions = [], total = 0 } = location.state || {};

  const [carId, setCarId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [promo, setPromo] = useState('');

  const { control, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: { name: '', phone: '' },
    mode: 'onTouched',
  });
  const watchedName  = watch('name');
  const watchedPhone = watch('phone');

  const dt = useDateTimeSlots(company?.id);
  const datetimeDisplay = dt.pickerDate && dt.pickerTime
    ? formatDateLabel(dt.pickerDate, dt.pickerTime)
    : '';

  const flow = useBookingFlow({
    company, user, carId, selectedActions,
    pickerDate: dt.pickerDate, pickerTime: dt.pickerTime,
    phone: watchedPhone,
  });

  const formFilled  = isValid && datetimeDisplay && !!carId;
  const carOptions  = flow.cars.map(c => ({ id: c.id, name: [c.brandName, c.seriesName].filter(Boolean).join(' ') + (c.plate ? ` · ${c.plate}` : '') }));
  const selectedCar = flow.cars.find(c => String(c.id) === String(carId));
  const carLabel     = selectedCar ? `${selectedCar.brandName} ${selectedCar.seriesName}/${selectedCar.plate}` : 'Выберите авто';
  const serviceLabel = selectedActions.map(a => a.name).join(', ') || 'Кузов, салон';
  const dateLabel    = datetimeDisplay || '12 июня, 09:00';

  if (flow.step === 3) return (
    <SuccessStep
      company={company}
      dateLabel={dateLabel}
      onGoServices={() => navigate(ROUTES.services)}
      onGoProfile={() => navigate(ROUTES.profile)}
    />
  );

  if (flow.step === 2) return (
    <OtpStep
      phone={watchedPhone}
      otp={flow.otp}
      submitting={flow.submitting}
      submitError={flow.submitError}
      onBack={() => flow.setStep(1)}
      onVerify={flow.handleVerifyCode}
      onResend={flow.handleResendCode}
    />
  );

  if (showDatePicker) return (
    <DatePickerStep
      dt={dt}
      datetimeDisplay={datetimeDisplay}
      onBack={() => setShowDatePicker(false)}
      onDone={() => setShowDatePicker(false)}
    />
  );

  return (
    <BookingFormStep
      control={control}
      errors={errors}
      carId={carId}
      setCarId={setCarId}
      carOptions={carOptions}
      cars={flow.cars}
      carsLoading={flow.carsLoading}
      datetimeDisplay={datetimeDisplay}
      onOpenDatePicker={() => setShowDatePicker(true)}
      promo={promo}
      setPromo={setPromo}
      carLabel={carLabel}
      serviceLabel={serviceLabel}
      dateLabel={dateLabel}
      total={total}
      watchedName={watchedName}
      company={company}
      formFilled={formFilled}
      showConfirm={flow.showConfirm}
      setShowConfirm={flow.setShowConfirm}
      submitting={flow.submitting}
      submitError={flow.submitError}
      onConfirmBooking={flow.handleConfirmBooking}
      onBack={() => navigate(ROUTES.services)}
    />
  );
}
