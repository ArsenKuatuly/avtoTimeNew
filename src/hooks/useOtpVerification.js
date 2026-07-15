import { useState, useRef, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

const CODE_LENGTH   = 4;
const RESEND_SECONDS = 59;

export function useOtpVerification() {
  const [digits, setDigits]   = useState(Array(CODE_LENGTH).fill(''));
  const [timer, setTimer]     = useState(RESEND_SECONDS);
  const [sendCount, setSendCount] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (sendCount === 0) return;
    setTimer(RESEND_SECONDS);
    const id = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [sendCount]);

  const code = digits.join('');

  const sendCode = async (phone) => {
    await AuthService.sendCode(phone);
    setDigits(Array(CODE_LENGTH).fill(''));
    setSendCount(c => c + 1);
  };

  const resendCode = (phone) => {
    setSendCount(c => c + 1);
    AuthService.sendCode(phone).catch(() => {});
  };

  const verifyCode = (phone) => AuthService.checkCode(phone, code);

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < CODE_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  return {
    digits, code, timer, inputRefs,
    sendCode, resendCode, verifyCode,
    handleChange, handleKeyDown,
  };
}
