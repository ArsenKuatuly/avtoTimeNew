import styles from '../Services.module.css';
import { RATING_OPTIONS } from '../../../features/services/useCompanyList';
import { SERVICE_TYPES } from '../../../config/constants';
import mapIcon      from '../../../assets/icons/mapIcon.svg';
import blueMapIcon  from '../../../assets/icons/blueMapIcon.svg';

export default function MobileTopBar({ serviceType, setServiceType, mobileView, setMobileView, list }) {
  const { filterOpen, setFilterOpen, minRating, setMinRating, ratingDropOpen, setRatingDropOpen, ratingRef } = list;

  return (
    <div className={styles.mobileTop}>
      <div className={styles.mobileTypeRow}>
        {SERVICE_TYPES.map(t => (
          <button key={t.code}
            className={`${styles.mobileTypeBtn} ${serviceType === t.code ? styles.mobileTypeBtnActive : ''}`}
            onClick={() => setServiceType(t.code)}
          >{t.label}</button>
        ))}
        <button className={styles.mobileViewToggle} onClick={() => setMobileView(v => v === 'map' ? 'list' : 'map')}>
          <img src={mobileView === 'map' ? blueMapIcon : mapIcon} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        </button>
      </div>
      <div className={styles.mobileFilterRow}>
        <button className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
          onClick={() => setFilterOpen(v => !v)}>
          Открыто
          {filterOpen && <span className={styles.filterX} onClick={e => { e.stopPropagation(); setFilterOpen(false); }}>×</span>}
        </button>
        <div className={styles.ratingWrap} ref={ratingRef}>
          <button className={`${styles.filterBtn} ${minRating !== null ? styles.filterBtnActive : ''}`}
            onClick={() => setRatingDropOpen(v => !v)}>
            {minRating !== null ? `Рейтинг от ${minRating}` : 'Рейтинг'}
            {minRating !== null
              ? <span className={styles.filterX} onClick={e => { e.stopPropagation(); setMinRating(null); setRatingDropOpen(false); }}>×</span>
              : <span style={{ marginLeft: 2 }}>›</span>}
          </button>
          {ratingDropOpen && (
            <div className={styles.ratingDrop}>
              {RATING_OPTIONS.map(r => (
                <button key={r} className={`${styles.ratingOption} ${minRating === r ? styles.ratingOptionActive : ''}`}
                  onClick={() => { setMinRating(r); setRatingDropOpen(false); }}>
                  <span className={styles.ratingStar}>★</span> От {r}
                  {minRating === r && <span className={styles.ratingCheck}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
