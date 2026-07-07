import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BookOrder.module.css';
import { Button, Input, Modal, Select } from '../../components/ui';
import { formatCurrency } from '../../utils/formatCurrency';
import { MONTHS_NOM, DAY_SHORT, formatDateLabel } from '../../utils/formatDate';
import { useAuth } from '../../providers/AuthContext';
import { VehicleService } from '../../services/VehicleService';
import { BookingService } from '../../services/BookingService';
import { AuthService } from '../../services/AuthService';
import { ROUTES } from '../../config/routes.config';
import logoCalendar from '../../assets/icons/logoCalendar.svg';
import greenAccess  from '../../assets/icons/greenAccess.svg';

const bookingSchema = yup.object({
  name:  yup.string().trim().required('Введите имя'),
  phone: yup.string()
    .required('Введите номер телефона')
    .test('phone', 'Введите корректный номер', v => v && v.replace(/\D/g, '').length === 11),
});

const BASE_URL = 'https://api.services.avtotime.kz';

const toApiDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const groupSlots = (slots) => {
  const groups = [
    { label: 'Утро',  from: 6,  to: 11, slots: [] },
    { label: 'День',  from: 12, to: 17, slots: [] },
    { label: 'Вечер', from: 18, to: 23, slots: [] },
  ];
  slots.forEach(s => {
    const hour = parseInt(s.time.slice(0, 2), 10);
    const group = groups.find(g => hour >= g.from && hour <= g.to);
    if (group) group.slots.push({ t: s.time.slice(0, 5), ok: s.is_available });
  });
  return groups.filter(g => g.slots.length > 0);
};

export default function BookOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { company, selectedActions = [], total = 0 } = location.state || {};

  const [step, setStep]               = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [cars,        setCars]        = useState([]);
  const [carsLoading,  setCarsLoading] = useState(false);
  const [carId,        setCarId]       = useState('');
  const [draftId,      setDraftId]     = useState(null);
  const [submitting,   setSubmitting]  = useState(false);
  const [submitError,  setSubmitError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    setCarsLoading(true);
    VehicleService.getByUser(user.id)
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setCarsLoading(false));
  }, [user?.id]);

  const { control, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: { name: '', phone: '' },
    mode: 'onTouched',
  });
  const watchedName  = watch('name');
  const watchedPhone = watch('phone');

  const [pickerDate, setPickerDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [pickerSlot, setPickerSlot] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [promo, setPromo]     = useState('');
  const [timeGroups, setTimeGroups]     = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [smsDigits, setSmsDigits] = useState(['', '', '', '']);
  const [timer, setTimer]         = useState(59);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return;
    setTimer(59);
    const id = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (!company?.id || !pickerDate) return;
    setSlotsLoading(true);
    setPickerSlot(null);
    fetch(`${BASE_URL}/api/v1/partners/get-time-slots/${company.id}?date=${toApiDate(pickerDate)}`)
      .then(r => r.json())
      .then(data => setTimeGroups(groupSlots(data?.data || [])))
      .catch(() => setTimeGroups([]))
      .finally(() => setSlotsLoading(false));
  }, [company?.id, pickerDate]);

  const formatPhone = (e, onChange) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (!digits) { onChange(''); return; }
    let d = digits.startsWith('8') || digits.startsWith('7') ? digits.slice(1) : digits;
    let result = '+7';
    if (d.length > 0) result += ' ' + d.slice(0, 3);
    if (d.length >= 3) result += ' ' + d.slice(3, 6);
    if (d.length >= 6) result += ' ' + d.slice(6, 8);
    if (d.length >= 8) result += ' ' + d.slice(8, 10);
    onChange(result);
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today); monday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);
  const weekDays = Array.from({length:7}, (_,i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
  });
  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

  const pickerTime = pickerSlot ? timeGroups[pickerSlot.g]?.slots[pickerSlot.i]?.t : null;

  const datetimeDisplay = pickerDate && pickerTime
    ? formatDateLabel(pickerDate, pickerTime)
    : '';

  const formFilled = isValid && datetimeDisplay && !!carId;
  const carOptions   = cars.map(c => ({ id: c.id, name: [c.model, c.make].filter(Boolean).join(' ') + (c.plate ? ` · ${c.plate}` : '') }));
  const selectedCar   = cars.find(c => String(c.id) === String(carId));
  const carLabel      = selectedCar ? `${selectedCar.model} ${selectedCar.make}/${selectedCar.plate}` : 'Выберите авто';
  const serviceLabel = selectedActions.map(a => a.name).join(', ') || 'Кузов, салон';
  const dateLabel    = datetimeDisplay || '12 июня, 09:00';

  const toApiTime  = (t) => t.length === 5 ? `${t}:00` : t;
  const toApiPhone = (formatted) => formatted.replace(/\D/g, '').slice(1);

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
      setDraftId(draft?.id || draft?.data?.id);
      await AuthService.sendCode(toApiPhone(watchedPhone));
      setShowConfirm(false);
      setStep(2);
    } catch {
      setSubmitError('Не удалось создать запись. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setTimer(59);
    try { await AuthService.sendCode(toApiPhone(watchedPhone)); } catch {}
  };

  const handleVerifyCode = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      await AuthService.checkCode(toApiPhone(watchedPhone), smsCode);
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

  if (step === 3) return (
    <div className={styles.successPage}>
      <img src={greenAccess} alt="" className={styles.successIco} />
      <h2 className={styles.successTitle}>Вы записались</h2>
      <p className={styles.successSub}>{company ? `Автомойка ${company.name} ожидает вас:` : 'Ожидает вас:'}</p>
      <p className={styles.successDate}>{dateLabel}</p>
      <div className={styles.successBtns}>
        <Button variant="ghost" fullWidth className={styles.successBtnGray} onClick={() => navigate(ROUTES.services)}>В автосервисы</Button>
        <Button fullWidth onClick={() => navigate(ROUTES.profile)}>В мои записи</Button>
      </div>
    </div>
  );

  const smsCode = smsDigits.join('');

  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...smsDigits];
    next[i] = v;
    setSmsDigits(next);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !smsDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  if (step === 2) return (
    <div className={styles.smsPage}>
      <button className={styles.backBtn} onClick={() => setStep(1)}>‹ назад</button>
      <div className={styles.smsBox}>
        <h2 className={styles.smsTitle}>Код из SMS</h2>
        <p className={styles.smsSub}>Введите код из SMS отправленный на номер</p>
        <p className={styles.smsPhone}>{watchedPhone || '+7 777 777 77 77'}</p>
        <div className={styles.otpRow}>
          {smsDigits.map((d, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              className={styles.otpBox}
              value={d}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              type="text"
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>
        <Button fullWidth className={styles.actionBtn} disabled={smsCode.length < 4 || submitting} onClick={handleVerifyCode}>
          {submitting ? 'Проверка...' : 'Продолжить'}
        </Button>
        {submitError && <p className={styles.smsSub}>{submitError}</p>}
        <p className={styles.smsTimer}>
          {timer > 0
            ? `Отправить код еще раз через 00:${String(timer).padStart(2,'0')}`
            : <span className={styles.smsResend} onClick={handleResendCode}>Отправить код ещё раз</span>}
        </p>
      </div>
    </div>
  );

  if (showDatePicker) return (
    <div className={styles.formPage}>
      <button className={styles.backBtn} onClick={() => setShowDatePicker(false)}>‹ назад</button>
      <h1 className={styles.dpTitle}>Выберите дату</h1>

      <div className={styles.dpMonthNav}>
        <button className={styles.dpNavBtn} onClick={() => setWeekOffset(o => o - 1)} disabled={weekOffset === 0}>‹</button>
        <p className={styles.dpMonth}>{MONTHS_NOM[weekDays[3].getMonth()]} {weekDays[3].getFullYear()}</p>
        <button className={styles.dpNavBtn} onClick={() => setWeekOffset(o => o + 1)}>›</button>
      </div>

      <div className={styles.dpWeekWrap}>
        {weekDays.map((day, i) => {
          const isPast     = day < today;
          const isSelected = isSameDay(day, pickerDate);
          return (
            <button key={i}
              className={`${styles.dpDay} ${isSelected ? styles.dpDayActive : ''} ${isPast ? styles.dpDayPast : ''}`}
              onClick={() => { if (!isPast) { setPickerDate(day); setPickerSlot(null); } }}>
              <span className={styles.dpDayName}>{DAY_SHORT[i]}</span>
              <span className={`${styles.dpDayCircle} ${isSelected ? styles.dpDayCircleActive : ''}`}>
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.dpScrollArea}>
        {slotsLoading ? (
          <p className={styles.dpGroupLabel}>Загрузка...</p>
        ) : timeGroups.length === 0 ? (
          <p className={styles.dpGroupLabel}>Нет доступных слотов</p>
        ) : timeGroups.map((group, gIdx) => (
          <div key={group.label}>
            <p className={styles.dpGroupLabel}>{group.label}</p>
            <div className={styles.dpGrid}>
              {group.slots.map((slot, i) => (
                <button key={i}
                  disabled={!slot.ok}
                  className={`${styles.dpSlot}
                    ${!slot.ok ? styles.dpSlotDis : ''}
                    ${pickerSlot?.g === gIdx && pickerSlot?.i === i ? styles.dpSlotActive : ''}`}
                  onClick={() => setPickerSlot({ g: gIdx, i })}>
                  {slot.t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dpFooter}>
        <Button fullWidth className={styles.actionBtn} disabled={!pickerDate || !pickerTime} onClick={() => setShowDatePicker(false)}>
          {pickerDate && pickerTime ? `Выбрать (${datetimeDisplay})` : 'Выбрать'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>
      <button className={styles.backBtn} onClick={() => navigate(ROUTES.services)}>‹ назад</button>

      <div className={styles.formLayout}>
        <div className={styles.formLeft}>
          <h1 className={styles.formTitle}>Оформление записи</h1>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input label="Имя" {...field} error={errors.name?.message} />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <Input
                label="Номер телефона"
                {...field}
                onChange={e => formatPhone(e, onChange)}
                type="tel"
                maxLength={16}
                error={errors.phone?.message}
              />
            )}
          />

          <div className={styles.field}>
            <Select
              label="Автомобиль"
              value={carId}
              onChange={setCarId}
              options={carOptions}
              loading={carsLoading}
              placeholder={cars.length === 0 && !carsLoading ? 'Нет добавленных авто' : '— Выберите авто —'}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.dateWrap} onClick={() => setShowDatePicker(true)}>
              <input className={styles.fieldInput} value={datetimeDisplay} readOnly
                placeholder="Дата и время" />
              <label className={styles.fieldLabel}>Дата и время</label>
              <img src={logoCalendar} alt="" className={styles.calIco} />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.paymentField}>
              <span className={styles.paymentLabel}>Способ оплаты</span>
              <span className={styles.paymentVal}>Картой онлайн</span>
            </div>
            <span className={styles.paymentArrow}>›</span>
          </div>

          <div className={styles.promoRow}>
            <div className={styles.promoField}>
              <input className={styles.fieldInput} value={promo}
                onChange={e => setPromo(e.target.value)} placeholder="Промокод" />
              <label className={styles.fieldLabel}>Промокод</label>
            </div>
            <Button disabled={!promo} className={styles.promoApply}>Применить</Button>
          </div>
        </div>

        <div className={styles.formRight}>
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Итого</h3>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Авто</span>
              <span className={styles.summaryVal}>{carLabel}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Услуга</span>
              <span className={styles.summaryVal}>{serviceLabel}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>К оплате</span>
              <span className={styles.summaryPrice}>{total ? formatCurrency(total) : '5 000 ₸'}</span>
            </div>
          </div>
          <div className={styles.formBtnWrap}>
            <Button fullWidth className={styles.actionBtn} disabled={!formFilled} onClick={() => setShowConfirm(true)}>
              Продолжить
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Подтверждение записи" width="420px">
        <p className={styles.modalSection}>Детали</p>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Имя</span>
          <span className={styles.modalVal}>{watchedName}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Автомойка</span>
          <span className={styles.modalVal}>{company?.name || 'Crystal'}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Дата и время</span>
          <span className={styles.modalVal}>{dateLabel}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Способ оплаты</span>
          <span className={styles.modalVal}>Картой онлайн</span>
        </div>
        <div className={styles.modalSummary}>
          <p className={styles.modalSummaryTitle}>Итого</p>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>Мое авто</span>
            <span className={styles.modalVal}>{carLabel}</span>
          </div>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>Услуга</span>
            <span className={styles.modalVal}>{serviceLabel}</span>
          </div>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>К оплате</span>
            <span className={styles.summaryPrice}>{total ? formatCurrency(total) : '5 000 ₸'}</span>
          </div>
        </div>
        {submitError && <p className={styles.modalRow}>{submitError}</p>}
        <Button fullWidth size="lg" disabled={submitting} onClick={handleConfirmBooking}>
          {submitting ? 'Оформляем...' : 'Перейти к оплате'}
        </Button>
      </Modal>
    </div>
  );
}
