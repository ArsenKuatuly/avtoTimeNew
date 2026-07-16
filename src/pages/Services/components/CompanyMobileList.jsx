import styles from '../Services.module.css';
import { getImages, getRating, getAddress } from '../../../features/services/useCompanyList';
import yellowStar from '../../../assets/icons/yellowStar.svg';
import mestoIco   from '../../../assets/icons/mesto.png';

export default function CompanyMobileList({ list, onSelect }) {
  const { filtered, getSlide, setSlide } = list;

  return (
    <div className={styles.mobileList}>
      {filtered.map(c => {
        const imgs  = getImages(c);
        const slide = getSlide(c.id);
        return (
          <div key={c.id} className={styles.mobileListCard} onClick={() => onSelect(c)}>
            <div className={styles.mlImgWrap}>
              {imgs.length > 0 ? (
                <>
                  <img src={imgs[slide]} alt={c.name} className={styles.mlImg} />
                  {imgs.length > 1 && (
                    <div className={styles.mlDots}>
                      {imgs.map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.mlDot} ${i === slide ? styles.mlDotActive : ''}`}
                          onClick={e => setSlide(c.id, i, e)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.mlImgPlaceholder}>{c.name}</div>
              )}
            </div>
            <div className={styles.mlInfo}>
              <p className={styles.mlName}>{c.name}</p>
              <p className={styles.mlType}>Автомойка</p>
              <div className={styles.mlBottom}>
                <div className={styles.mlAddr}>
                  <img src={mestoIco} alt="" className={styles.mlAddrIco} />
                  <span className={styles.mlAddrText}>{getAddress(c)}</span>
                </div>
                <div className={styles.mlRating}>
                  <img src={yellowStar} alt="" className={styles.mlStar} />
                  <span className={styles.mlRatingText}>{getRating(c)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
