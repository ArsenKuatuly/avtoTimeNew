import styles from './MyData.module.css';
import { Button, Input } from '../../../components/ui';
import { formatPhone } from '../../../utils/formatPhone';
import { useProfile } from '../../../hooks/useProfile';
import deletelogo from '../../../assets/icons/deletelogo.png';
import galochka   from '../../../assets/icons/galochka.png';

export default function MyData({ user }) {
  const {
    firstName, setFirstName,
    isDirty, saving, saveError, saved,
    showConfirm, setShowConfirm,
    handleSave, handleDelete,
  } = useProfile(user);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои данные</h2>
        <button className={styles.deleteLink} onClick={() => setShowConfirm(true)}>Удалить аккаунт</button>
      </div>

      {showConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmTop}>
              <img src={deletelogo} alt="Удалить" className={styles.confirmIcon} />
              <div className={styles.confirmBody}>
                <h3 className={styles.confirmTitle}>Удаление аккаунта</h3>
                <p className={styles.confirmText}>
                  Вы действительно хотите удалить аккаунт?<br />
                  Все данные будут удалены безвозвратно
                </p>
              </div>
            </div>
            <div className={styles.confirmBtns}>
              <Button variant="secondary" className={styles.confirmBtn} onClick={() => setShowConfirm(false)}>Назад</Button>
              <Button variant="primary" className={styles.confirmBtn} onClick={handleDelete}>Удалить</Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.form}>
        <Input label="Имя"     value={firstName} onChange={e => setFirstName(e.target.value)} />
        <Input label="Фамилия" value="(Только для дизайна)" readOnly />
        <Input label="Номер телефона" value={formatPhone(user?.phone)} readOnly />
      </div>

      <Button size="lg" disabled={!isDirty || saving} loading={saving} onClick={handleSave} className={styles.saveBtn}>
        Сохранить
      </Button>

      {saveError && <p className={styles.saveError}>{saveError}</p>}

      <button className={styles.deleteLinkMobile} onClick={() => setShowConfirm(true)}>Удалить аккаунт</button>

      {saved && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          Данные сохранены
        </div>
      )}
    </div>
  );
}
