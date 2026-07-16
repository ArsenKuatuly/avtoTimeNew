import styles from '../../Services.module.css';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { CarSelectorField } from '../../../../features/services/CarSelector/CarSelector';
import whiteGalochka from '../../../../assets/icons/whiteGalochka.svg';

export default function ServicesTab({ detail, carSelector, user }) {
  const { actions, checkedActions, toggleAction, detailLoading, detailError, getPrice, getOldPrice } = detail;

  return (
    <div className={styles.servicesSection}>
      <CarSelectorField selector={carSelector} user={user} />

      <p className={styles.actionsTitle}>Услуги</p>

      {detailLoading ? (
        <p className={styles.listEmpty}>Загрузка...</p>
      ) : detailError ? (
        <p className={styles.listEmpty}>{detailError}</p>
      ) : actions.length === 0 ? (
        <p className={styles.listEmpty}>Нет доступных услуг</p>
      ) : (
        <div className={styles.actionsList}>
          {actions.map(a => (
            <div key={a.id} className={styles.actionCard}>
              <div className={styles.actionInfo}>
                <p className={styles.actionName}>{a.name || ''}</p>
                <div className={styles.actionPriceRow}>
                  <span className={styles.actionPrice}>{formatCurrency(getPrice(a))}</span>
                  {getOldPrice(a) && (
                    <span className={styles.actionOldPrice}>{getOldPrice(a).toLocaleString('ru-RU')} тг</span>
                  )}
                </div>
              </div>
              <div
                className={`${styles.actionCheck} ${checkedActions.includes(a.id) ? styles.actionCheckOn : ''}`}
                onClick={() => toggleAction(a.id)}
              >
                {checkedActions.includes(a.id) && <img src={whiteGalochka} alt="" className={styles.actionCheckMark} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
