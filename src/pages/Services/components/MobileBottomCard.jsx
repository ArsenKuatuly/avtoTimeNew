import styles from '../Services.module.css';
import { getImage, getRating, getAddress } from '../../../features/services/useCompanyList';
import yellowStar from '../../../assets/icons/yellowStar.svg';
import mestoIco   from '../../../assets/icons/mesto.png';

export default function MobileBottomCard({ selected, onOpenDetail, onClose }) {
  return (
    <div className={styles.mobileBottomCard} onClick={onOpenDetail}>
      <img src={getImage(selected)} alt={selected.name} className={styles.mobileBottomImg} />
      <div className={styles.mobileBottomInfo}>
        <p className={styles.cardName}>{selected.name}</p>
        <p className={styles.cardType}>Автомойка</p>
        <div className={styles.cardAddrRow}>
          <img src={mestoIco} alt="" className={styles.cardAddrIco} />
          <span className={styles.cardAddr}>{getAddress(selected)}</span>
        </div>
      </div>
      <div className={styles.mobileBottomRight}>
        <img src={yellowStar} alt="" className={styles.cardStar} />
        <span className={styles.cardRating}>{getRating(selected)}</span>
        <button className={styles.mobileBottomClose} onClick={e => { e.stopPropagation(); onClose(); }}>✕</button>
      </div>
    </div>
  );
}
