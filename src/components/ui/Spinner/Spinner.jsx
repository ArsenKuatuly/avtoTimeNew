import styles from './Spinner.module.css';

export default function Spinner({ size = 'md' }) {
  return (
    <div className={styles.wrap}>
      <span className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}
