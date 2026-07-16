import styles from '../../Services.module.css';
import { getRating } from '../../../../features/services/useCompanyList';
import yellowStar from '../../../../assets/icons/yellowStar.svg';

export default function ReviewsTab({ selected, reviews, reviewsTotal }) {
  const avg   = getRating(selected);
  const total = reviewsTotal || reviews.length;
  const dist  = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating || r.rate || 0) === star).length,
  }));
  const maxCount = Math.max(...dist.map(d => d.count), 1);

  return (
    <div className={styles.reviewsTab}>
      <div className={styles.ratingBlock}>
        <div className={styles.ratingLeft}>
          <p className={styles.ratingBig}>{avg ? Number(avg).toFixed(1) : '—'}</p>
          <div className={styles.ratingStarsRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <img key={s} src={yellowStar} alt="" className={styles.ratingStarIco}
                style={{ opacity: s <= Math.round(avg) ? 1 : 0.25 }} />
            ))}
          </div>
          <p className={styles.ratingTotal}>{total} оценок</p>
        </div>
        <div className={styles.ratingBars}>
          {dist.map(d => (
            <div key={d.star} className={styles.ratingBarRow}>
              <img src={yellowStar} alt="" className={styles.ratingBarStar} />
              <span className={styles.ratingBarNum}>{d.star}</span>
              <div className={styles.ratingBarTrack}>
                <div className={styles.ratingBarFill}
                  style={{ width: `${(d.count / maxCount) * 100}%` }} />
              </div>
              <span className={styles.ratingBarCount}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className={styles.listEmpty}>Отзывов пока нет</p>
      ) : reviews.map((r, i) => (
        <div key={i} className={styles.reviewItem}>
          <div className={styles.reviewTop}>
            <span className={styles.reviewAuthor}>{r.author?.name || 'Аноним'}</span>
            <div className={styles.reviewStarsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <img key={s} src={yellowStar} alt="" className={styles.reviewStarIco}
                  style={{ opacity: s <= Math.round(r.rating || r.rate || 0) ? 1 : 0.25 }} />
              ))}
            </div>
          </div>
          <p className={styles.reviewText}>{r.comment || ''}</p>
          <p className={styles.reviewDate}>{r.created_at?.slice(0, 10) || ''}</p>
        </div>
      ))}
    </div>
  );
}
