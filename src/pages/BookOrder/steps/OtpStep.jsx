import styles from '../BookOrder.module.css';
import { Button } from '../../../components/ui';
import { COMPANY_PHONE } from '../../../config/constants';

export default function OtpStep({ phone, otp, submitting, submitError, onBack, onVerify, onResend }) {
  return (
    <div className={styles.smsPage}>
      <button className={styles.backBtn} onClick={onBack}>‹ назад</button>
      <div className={styles.smsBox}>
        <h2 className={styles.smsTitle}>Код из SMS</h2>
        <p className={styles.smsSub}>Введите код из SMS отправленный на номер</p>
        <p className={styles.smsPhone}>{phone || COMPANY_PHONE}</p>
        <div className={styles.otpRow}>
          {otp.digits.map((d, i) => (
            <input
              key={i}
              ref={el => otp.inputRefs.current[i] = el}
              className={styles.otpBox}
              value={d}
              onChange={e => otp.handleChange(i, e.target.value)}
              onKeyDown={e => otp.handleKeyDown(i, e)}
              type="text"
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>
        <Button fullWidth className={styles.actionBtn} disabled={otp.code.length < 4 || submitting} onClick={onVerify}>
          {submitting ? 'Проверка...' : 'Продолжить'}
        </Button>
        {submitError && <p className={styles.smsSub}>{submitError}</p>}
        <p className={styles.smsTimer}>
          {otp.timer > 0
            ? `Отправить код еще раз через 00:${String(otp.timer).padStart(2, '0')}`
            : <span className={styles.smsResend} onClick={onResend}>Отправить код ещё раз</span>}
        </p>
      </div>
    </div>
  );
}
