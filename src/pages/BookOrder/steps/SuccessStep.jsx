import styles from '../BookOrder.module.css';
import { Button } from '../../../components/ui';
import greenAccess from '../../../assets/icons/greenAccess.svg';

export default function SuccessStep({ company, dateLabel, onGoServices, onGoProfile }) {
  return (
    <div className={styles.successPage}>
      <img src={greenAccess} alt="" className={styles.successIco} />
      <h2 className={styles.successTitle}>Вы записались</h2>
      <p className={styles.successSub}>{company ? `Автомойка ${company.name} ожидает вас:` : 'Ожидает вас:'}</p>
      <p className={styles.successDate}>{dateLabel}</p>
      <div className={styles.successBtns}>
        <Button variant="ghost" fullWidth className={styles.successBtnGray} onClick={onGoServices}>В автосервисы</Button>
        <Button fullWidth onClick={onGoProfile}>В мои записи</Button>
      </div>
    </div>
  );
}
