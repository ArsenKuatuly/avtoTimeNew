import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BookOrder.module.css';
import { formatCurrency } from '../../utils/formatCurrency';
import { MONTHS_NOM, DAY_SHORT, formatDateLabel } from '../../utils/formatDate';
import logoCalendar from '../../assets/icons/logoCalendar.svg';
import greenAccess  from '../../assets/icons/greenAccess.svg';

const TIME_GROUPS = [
  { label: 'Утро', slots: [
    {t:'09:00',ok:true}, {t:'09:30',ok:true}, {t:'10:00',ok:false},{t:'10:30',ok:true},
    {t:'11:00',ok:true}, {t:'11:30',ok:false},{t:'12:00',ok:false},{t:'12:30',ok:true},
    {t:'13:00',ok:true}, {t:'13:30',ok:true}, {t:'14:00',ok:false},{t:'14:30',ok:true},
  ]},
  { label: 'День', slots: [
    {t:'12:00',ok:true},{t:'12:30',ok:false},{t:'13:00',ok:true},{t:'13:30',ok:true},
    {t:'14:00',ok:false},{t:'14:30',ok:true},{t:'15:00',ok:true},{t:'15:30',ok:false},
    {t:'16:00',ok:true},{t:'16:30',ok:true},{t:'17:00',ok:false},{t:'17:30',ok:true},
  ]},
  { label: 'Вечер', slots: [
    {t:'18:00',ok:true},{t:'18:30',ok:false},{t:'19:00',ok:true},{t:'19:30',ok:true},
    {t:'20:00',ok:false},{t:'20:30',ok:true},{t:'21:00',ok:true},{t:'21:30',ok:false},
    {t:'22:00',ok:true},{t:'22:30',ok:true},{t:'23:00',ok:false},{t:'23:30',ok:true},
  ]},
];

export default function BookOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { company, selectedActions = [], total = 0 } = location.state || {};

  const [step, setStep]               = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [pickerDate, setPickerDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [pickerSlot, setPickerSlot] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [promo, setPromo]     = useState('');

  const [smsDigits, setSmsDigits] = useState(['', '', '', '']);
  const [timer, setTimer]         = useState(59);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return;
    setTimer(59);
    const id = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [step]);

  const handlePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (!digits) { setPhone(''); return; }
    let d = digits.startsWith('8') || digits.startsWith('7') ? digits.slice(1) : digits;
    let result = '+7';
    if (d.length > 0) result += ' ' + d.slice(0, 3);
    if (d.length >= 3) result += ' ' + d.slice(3, 6);
    if (d.length >= 6) result += ' ' + d.slice(6, 8);
    if (d.length >= 8) result += ' ' + d.slice(8, 10);
    setPhone(result);
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today); monday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);
  const weekDays = Array.from({length:7}, (_,i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
  });
  const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

  const pickerTime = pickerSlot ? TIME_GROUPS[pickerSlot.g].slots[pickerSlot.i].t : null;

  const datetimeDisplay = pickerDate && pickerTime
    ? formatDateLabel(pickerDate, pickerTime)
    : '';

  const formFilled   = name.trim() && phone.trim() && datetimeDisplay;
  const carLabel     = company?.car_label || 'KIA Optima/123 sss 01';
  const serviceLabel = selectedActions.map(a => a.name).join(', ') || 'Кузов, салон';
  const dateLabel    = datetimeDisplay || '12 июня, 09:00';

  if (step === 3) return (
    <div className={styles.successPage}>
      <img src={greenAccess} alt="" className={styles.successIco} />
      <h2 className={styles.successTitle}>Вы записались</h2>
      <p className={styles.successSub}>{company ? `Автомойка ${company.name} ожидает вас:` : 'Ожидает вас:'}</p>
      <p className={styles.successDate}>{dateLabel}</p>
      <div className={styles.successBtns}>
        <button className={styles.successBtnGray} onClick={() => navigate('/services')}>В автосервисы</button>
        <button className={styles.successBtnBlue} onClick={() => navigate('/profile')}>В мои записи</button>
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
        <p className={styles.smsPhone}>{phone || '+7 777 777 77 77'}</p>
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
        <button className={smsCode.length === 4 ? styles.btnBlue : styles.btnDisabled}
          disabled={smsCode.length < 4} onClick={() => setStep(3)}>Продолжить</button>
        <p className={styles.smsTimer}>
          {timer > 0
            ? `Отправить код еще раз через 00:${String(timer).padStart(2,'0')}`
            : <span className={styles.smsResend} onClick={() => setTimer(59)}>Отправить код ещё раз</span>}
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
        {TIME_GROUPS.map((group, gIdx) => (
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
        <button
          className={pickerDate && pickerTime ? styles.btnBlue : styles.btnDisabled}
          disabled={!pickerDate || !pickerTime}
          onClick={() => setShowDatePicker(false)}>
          {pickerDate && pickerTime ? `Выбрать (${datetimeDisplay})` : 'Выбрать'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>
      <button className={styles.backBtn} onClick={() => navigate('/services')}>‹ назад</button>

      <div className={styles.formLayout}>
        <div className={styles.formLeft}>
          <h1 className={styles.formTitle}>Оформление записи</h1>

          <div className={styles.field}>
            <input className={styles.fieldInput} value={name}
              onChange={e => setName(e.target.value)} placeholder="Имя" />
            <label className={styles.fieldLabel}>Имя</label>
          </div>

          <div className={styles.field}>
            <input className={styles.fieldInput} value={phone}
              onChange={handlePhone} placeholder="Номер телефона" />
            <label className={styles.fieldLabel}>Номер телефона</label>
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
            <button className={promo ? styles.promoApply : styles.promoApplyDis}
              disabled={!promo}>Применить</button>
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
            <button
              className={formFilled ? styles.btnBlue : styles.btnDisabled}
              disabled={!formFilled}
              onClick={() => setShowConfirm(true)}>
              Продолжить
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3 className={styles.modalTitle}>Подтверждение записи</h3>
              <button className={styles.modalClose} onClick={() => setShowConfirm(false)}>✕</button>
            </div>
            <p className={styles.modalSection}>Детали</p>
            <div className={styles.modalRow}>
              <span className={styles.modalKey}>Имя</span>
              <span className={styles.modalVal}>{name}</span>
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
            <button className={styles.btnBlueLg} onClick={() => { setShowConfirm(false); setStep(2); }}>
              Перейти к оплате
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
