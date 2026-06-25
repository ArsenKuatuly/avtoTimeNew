import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';
import { Button, Input } from '../ui';
import { formatPhone } from '../../utils/formatPhone';
import errorAuth from '../../assets/icons/errorAuth.png';
import bottomEsc from '../../assets/icons/bottomEsc.png';

function PhoneStep() {
  const { submitPhone, closeModal, loading, error } = useAuth();
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const allDigits = e.target.value.replace(/\D/g, '');
    const local = allDigits.length > 1 && allDigits.startsWith('7')
      ? allDigits.slice(1)
      : allDigits;
    setValue(local.length > 0 ? formatPhone(local) : '');
  };

  const digits = value.replace(/\D/g, '');
  const isReady = digits.length === 11;

  return (
    <div className={styles.modal}>
      <button className={styles.close} onClick={closeModal}>
        <img src={bottomEsc} alt="Закрыть" className={styles.closeIcon} />
      </button>
      <h2 className={styles.title}>Войти</h2>

      <Input
        label="Номер телефона"
        value={value}
        onChange={handleChange}
        type="tel"
        maxLength={16}
      />

      {error && (
        <div className={styles.errorBox}>
          <img src={errorAuth} alt="Ошибка" className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      <Button fullWidth size="lg" loading={loading} disabled={!isReady} onClick={() => submitPhone(value)}>
        {loading ? 'Отправка...' : 'Продолжить'}
      </Button>
    </div>
  );
}

function SmsStep() {
  const { submitCode, closeModal, phone, backToPhone, loading, error, resendCode } = useAuth();
  const [digits, setDigits]   = useState(['', '', '', '']);
  const [localErr, setLocalErr] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (error) setLocalErr(true);
  }, [error]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const code = digits.join('');

  const handleDigitChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setLocalErr(false);
    if (v && i < 3) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleResend = () => {
    setSeconds(59);
    resendCode();
  };

  return (
    <div className={styles.modal}>
      <button className={styles.close} onClick={closeModal}>
        <img src={bottomEsc} alt="Закрыть" className={styles.closeIcon} />
      </button>
      <h2 className={styles.title}>Код из&nbsp;SMS</h2>

      <p className={styles.desc}>
        Введите код из SMS отправленный на номер <span className={styles.phoneBlack}>{phone}</span>{' '}
        <button className={styles.changeLink} onClick={backToPhone}>Изменить</button>
      </p>

      <div className={styles.otpRow}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            className={`${styles.otpBox} ${localErr ? styles.otpBoxError : ''}`}
            value={d}
            onChange={e => handleDigitChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            type="text"
            inputMode="numeric"
            maxLength={1}
          />
        ))}
      </div>

      {localErr && (
        <div className={styles.errorBox}>
          <img src={errorAuth} alt="Ошибка" className={styles.errorIcon} />
          <span>{error || 'Неверный код'}</span>
        </div>
      )}

      <Button
        fullWidth
        size="lg"
        loading={loading}
        disabled={code.length < 4 || localErr}
        onClick={() => submitCode(code)}
      >
        {loading ? 'Проверка...' : 'Продолжить'}
      </Button>

      <p className={styles.resend}>
        {seconds > 0
          ? `Отправить код еще раз через 00:${String(seconds).padStart(2, '0')}`
          : <button className={styles.changeLink} onClick={handleResend}>Отправить код еще раз</button>
        }
      </p>
    </div>
  );
}

function NameStep() {
  const { submitName, loading, error } = useAuth();
  const [firstName, setFirstName] = useState('');
  const ready = firstName.trim();

  return (
    <div className={styles.modal}>
      <h2 className={`${styles.title} ${styles.titleCenter}`}>Укажите имя и фамилию</h2>

      <Input label="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} />

      <Input label="Фамилия" value="(Только для дизайна)" disabled />

      {error && (
        <div className={styles.errorBox}>
          <img src={errorAuth} alt="Ошибка" className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      <Button fullWidth size="lg" loading={loading} disabled={!ready} onClick={() => submitName(firstName, '')}>
        {loading ? 'Сохранение...' : 'Готово'}
      </Button>
    </div>
  );
}

export default function AuthModal() {
  const { modalStep, closeModal } = useAuth();
  if (!modalStep) return null;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
      {modalStep === 'phone' && <PhoneStep />}
      {modalStep === 'sms'   && <SmsStep />}
      {modalStep === 'name'  && <NameStep />}
    </div>
  );
}
