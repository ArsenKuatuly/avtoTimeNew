import styles from '../Services.module.css';
import { RATING_OPTIONS, getImage, getRating, getCount, getAddress } from '../../../features/services/useCompanyList';
import { SERVICE_TYPES } from '../../../config/constants';
import yellowStar from '../../../assets/icons/yellowStar.svg';
import mestoIco   from '../../../assets/icons/mesto.png';
import searchIco  from '../../../assets/icons/iconSearch.png';

export default function CompanySidebar({ serviceType, setServiceType, list, selectedId, onSelect }) {
  const {
    filtered, loading, listError,
    search, setSearch,
    filterOpen, setFilterOpen,
    minRating, setMinRating,
    ratingDropOpen, setRatingDropOpen, ratingRef,
  } = list;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchRow}>
        <img src={searchIco} alt="" className={styles.searchIco} />
        <input
          className={styles.searchInput}
          placeholder="Поиск"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.typeRow}>
        {SERVICE_TYPES.map(t => (
          <button
            key={t.code}
            className={`${styles.typeBtn} ${serviceType === t.code ? styles.typeBtnActive : ''}`}
            onClick={() => setServiceType(t.code)}
          >{t.label}</button>
        ))}
      </div>

      <div className={styles.filterRow}>
        <button
          className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
          onClick={() => setFilterOpen(v => !v)}
        >
          Открыто
          {filterOpen && (
            <span className={styles.filterX}
              onClick={e => { e.stopPropagation(); setFilterOpen(false); }}>×</span>
          )}
        </button>

        <div className={styles.ratingWrap} ref={ratingRef}>
          <button
            className={`${styles.filterBtn} ${minRating !== null ? styles.filterBtnActive : ''}`}
            onClick={() => setRatingDropOpen(v => !v)}
          >
            {minRating !== null ? `Рейтинг от ${minRating}` : 'Рейтинг'}
            {minRating !== null
              ? <span className={styles.filterX}
                  onClick={e => { e.stopPropagation(); setMinRating(null); setRatingDropOpen(false); }}>×</span>
              : <span style={{ marginLeft: 2 }}>›</span>
            }
          </button>
          {ratingDropOpen && (
            <div className={styles.ratingDrop}>
              {RATING_OPTIONS.map(r => (
                <button key={r} className={`${styles.ratingOption} ${minRating === r ? styles.ratingOptionActive : ''}`}
                  onClick={() => { setMinRating(r); setRatingDropOpen(false); }}>
                  <span className={styles.ratingStar}>★</span>
                  От {r}
                  {minRating === r && <span className={styles.ratingCheck}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.listEmpty}>Загрузка...</p>
        ) : listError ? (
          <p className={styles.listEmpty}>{listError}</p>
        ) : filtered.length === 0 ? (
          <p className={styles.listEmpty}>Ничего не найдено</p>
        ) : filtered.map(c => (
          <div
            key={c.id}
            className={`${styles.card} ${selectedId === c.id ? styles.cardActive : ''}`}
            onClick={() => onSelect(c)}
          >
            <img
              src={getImage(c)}
              alt={c.name}
              className={styles.cardImg}
            />
            <div className={styles.cardInfo}>
              <p className={styles.cardName}>{c.name}</p>
              <p className={styles.cardType}>Автомойка</p>
              <div className={styles.cardRatingRow}>
                <img src={yellowStar} alt="" className={styles.cardStar} />
                <span className={styles.cardRating}>{getRating(c)}</span>
                {getCount(c) > 0 && <span className={styles.cardCount}>{getCount(c)} оценок</span>}
              </div>
              <div className={styles.cardAddrRow}>
                <img src={mestoIco} alt="" className={styles.cardAddrIco} />
                <span className={styles.cardAddr}>{getAddress(c)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
