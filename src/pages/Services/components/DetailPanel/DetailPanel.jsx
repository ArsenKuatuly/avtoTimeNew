import styles from '../../Services.module.css';
import { ROUTES } from '../../../../config/routes.config';
import { getImage, getType, getDesc, getRating } from '../../../../features/services/useCompanyList';
import ServicesTab from './ServicesTab';
import DetailsTab from './DetailsTab';
import ReviewsTab from './ReviewsTab';
import yellowStar from '../../../../assets/icons/yellowStar.svg';

export default function DetailPanel({ detail, carSelector, user, navigate, mobileView, setMobileView }) {
  const { selected, setSelected, tab, setTab, imgIndex, setImgIndex, reviews, reviewsTotal, actions, checkedActions, getPrice } = detail;

  const imgs = selected.images?.length
    ? selected.images.map(i => i.url || i.path || i)
    : [getImage(selected) || null];
  const total = imgs.length;
  const src = imgs[imgIndex] || null;

  const handleBook = () => {
    const selectedActs = actions.filter(a => checkedActions.includes(a.id));
    const bookingTotal = selectedActs.reduce((sum, a) => sum + getPrice(a), 0);
    navigate(ROUTES.book, { state: { company: selected, selectedActions: selectedActs, total: bookingTotal } });
  };

  return (
    <div className={`${styles.detail} ${mobileView === 'detail' ? styles.detailMobileOpen : ''}`}>
      <button className={styles.detailClose} onClick={() => { setSelected(null); setMobileView('map'); }}>✕</button>

      <div className={styles.detailImgWrap}>
        {src
          ? <img src={src} alt={selected.name} className={styles.detailImg} />
          : <div className={styles.detailImgPlaceholder}>{selected.name}</div>}
        {total > 1 && (
          <>
            <button className={styles.sliderPrev} onClick={() => setImgIndex(i => (i - 1 + total) % total)}>‹</button>
            <button className={styles.sliderNext} onClick={() => setImgIndex(i => (i + 1) % total)}>›</button>
          </>
        )}
      </div>

      <div className={styles.detailBody}>
        <h2 className={styles.detailName}>{selected.name}</h2>
        <p className={styles.detailType}>{getType(selected)}</p>

        <div className={styles.detailMeta}>
          <div className={styles.detailRatingRow}>
            <img src={yellowStar} alt="" className={styles.detailStar} />
            <span className={styles.detailRating}>{getRating(selected)}</span>
            {(reviewsTotal > 0 || reviews.length > 0) && (
              <span className={styles.detailCount}>{reviewsTotal || reviews.length} оценок</span>
            )}
          </div>
          {selected.distance && (
            <span className={styles.detailDist}>🚗 {selected.distance}</span>
          )}
        </div>

        <p className={styles.detailDescLabel}>Краткое описание</p>
        {getDesc(selected) && <p className={styles.detailDesc}>{getDesc(selected)}</p>}

        <div className={styles.tabs}>
          {['services', 'details', 'reviews'].map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {{ services: 'Услуги', details: 'Детали', reviews: 'Отзывы' }[t]}
            </button>
          ))}
        </div>

        {tab === 'services' && <ServicesTab detail={detail} carSelector={carSelector} user={user} />}
        {tab === 'details'  && <DetailsTab selected={selected} />}
        {tab === 'reviews'  && <ReviewsTab selected={selected} reviews={reviews} reviewsTotal={reviewsTotal} />}
      </div>

      <div className={styles.detailFooter}>
        <button className={styles.queueBtn} onClick={() => navigate(ROUTES.queue, { state: { company: selected } })}>Встать в очередь</button>
        <button
          className={styles.bookBtn}
          disabled={checkedActions.length === 0}
          onClick={handleBook}
        >
          Записаться онлайн
        </button>
      </div>
    </div>
  );
}
