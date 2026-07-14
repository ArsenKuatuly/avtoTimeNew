import galochka from '../../../assets/icons/galochka.svg';
import styles from './Toast.module.css';

export default function Toast({ message, visible, type = 'success' }) {
  if (!visible) return null;
  const isError = type === 'error';
  return (
    <div className={`${styles.toast} ${isError ? styles.toastError : ''}`}>
      {isError
        ? <span className={styles.cross}>✕</span>
        : <img src={galochka} alt="✓" className={styles.check} />}
      {message}
    </div>
  );
}
