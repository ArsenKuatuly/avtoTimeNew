import galochka from '../../../assets/icons/galochka.svg';
import styles from './Toast.module.css';

export default function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className={styles.toast}>
      <img src={galochka} alt="✓" className={styles.check} />
      {message}
    </div>
  );
}
