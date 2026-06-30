import styles from './EmptyState.module.css';

export default function EmptyState({ icon, text, className = '' }) {
  return (
    <div className={`${styles.empty} ${className}`}>
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <p className={styles.text}>{text}</p>
    </div>
  );
}
