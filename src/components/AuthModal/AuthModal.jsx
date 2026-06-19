import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.css';
import errorAuth from '../../assets/icons/errorAuth.png';
import bottomEsc from '../../assets/icons/bottomEsc.png';

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  const d = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;

  let result = '+7';
  if (d.length > 0) result += ' ' + d.slice(0, 3);
  if (d.length > 3) result += ' ' + d.slice(3, 6);
  if (d.length > 6) result += ' ' + d.slice(6, 8);
  if (d.length > 8) result += ' ' + d.slice(8, 10);
  return result;
}

function PhoneStep() {
  const { submitPhone, closeModal } = useAuth();
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setValue(formatted);
  };


  const digits = value.replace(/\D/g, '');
  const isReady = digits.length === 11;

  return (
    <div className={styles.modal}>
      <button className={styles.close} onClick={closeModal}>
        <img src={bottomEsc} alt="Закрыть" className={styles.closeIcon} />
      </button>
      <h2 className={styles.title}>Войти</h2>

      <div className={`${styles.floatField} ${value.length > 0 ? styles.floatFieldFilled : ''}`}>
        <label className={styles.floatLabel}>Номер телефона</label>
        <input
          className={styles.floatInput}
          value={value}
          onChange={handleChange}
          type="tel"
          maxLength={16}
        />
      </div>

      <button
        className={`${styles.btn} ${isReady ? styles.btnActive : styles.btnDisabled}`}
        disabled={!isReady}
        onClick={() => submitPhone(value)}
      >
        Продолжить
      </button>
    </div>
  );
}

function SmsStep() {
  const { submitCode, closeModal, phone, backToPhone } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError]   = useState(false);
  const [seconds, setSeconds] = useState(59);
  const inputRefs = useRef([]);

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
    setError(false);
    if (v && i < 3) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (code !== '1111') {
      setError(true);
      return;
    }
    setError(false);
    submitCode();
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
            className={`${styles.otpBox} ${error ? styles.otpBoxError : ''}`}
            value={d}
            onChange={e => handleDigitChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            type="text"
            inputMode="numeric"
            maxLength={1}
          />
        ))}
      </div>

      {error && (
        <div className={styles.errorBox}>
          <img src={errorAuth} alt="Ошибка" className={styles.errorIcon} />
          <span>Не верный код</span>
        </div>
      )}

      <button
        className={`${styles.btn} ${code.length === 4 && !error ? styles.btnActive : styles.btnDisabled}`}
        disabled={code.length < 4 || error}
        onClick={handleSubmit}
      >
        Продолжить
      </button>

      <p className={styles.resend}>
        {seconds > 0
          ? `Отправить код еще раз через 00:${String(seconds).padStart(2, '0')}`
          : <button className={styles.changeLink} onClick={() => setSeconds(59)}>Отправить код еще раз</button>
        }
      </p>
    </div>
  );
}

function NameStep() {
  const { submitName } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const ready = firstName.trim() && lastName.trim();

  return (
    <div className={styles.modal}>
      <h2 className={`${styles.title} ${styles.titleCenter}`}>Укажите имя и фамилию</h2>

      <div className={`${styles.floatField} ${firstName.length > 0 ? styles.floatFieldFilled : ''}`}>
        <label className={styles.floatLabel}>Имя</label>
        <input className={styles.floatInput} value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>

      <div className={`${styles.floatField} ${lastName.length > 0 ? styles.floatFieldFilled : ''}`}>
        <label className={styles.floatLabel}>Фамилия</label>
        <input className={styles.floatInput} value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>

      <button
        className={`${styles.btn} ${ready ? styles.btnActive : styles.btnDisabled}`}
        disabled={!ready}
        onClick={() => submitName(firstName, lastName)}
      >
        Готово
      </button>
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
