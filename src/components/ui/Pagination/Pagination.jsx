import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button className={styles.pageBtn} disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>
      <span className={styles.pageInfo}>{page} из {totalPages}</span>
      <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>›</button>
    </div>
  );
}
