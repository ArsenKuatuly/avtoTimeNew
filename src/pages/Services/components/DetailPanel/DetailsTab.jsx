import styles from '../../Services.module.css';

export default function DetailsTab({ selected }) {
  return (
    <div className={styles.detailsTab}>

      <div className={styles.detailSection}>
        <p className={styles.detailSectionTitle}>График работы</p>
        {selected.open_time && selected.close_time ? (
          <>
            <div className={styles.scheduleRow}>
              <span className={styles.scheduleDay}>Пн-Пт</span>
              <span className={styles.scheduleTime}>
                {selected.open_time.slice(0, 5)} - {selected.close_time.slice(0, 5)}
              </span>
            </div>
            <div className={styles.scheduleRow}>
              <span className={styles.scheduleDay}>Сб, Вс</span>
              <span className={styles.scheduleTime}>
                {selected.open_time.slice(0, 5)} - {selected.close_time.slice(0, 5)}
              </span>
            </div>
          </>
        ) : (
          <p className={styles.scheduleEmpty}>Не указано</p>
        )}
      </div>

      {selected.conveniences?.length > 0 && (
        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Удобства</p>
          <div className={styles.conveniencesList}>
            {selected.conveniences.map(c => (
              <span key={c.id} className={styles.convenienceChip}>{c.name}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
