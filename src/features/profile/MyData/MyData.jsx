import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './MyData.module.css';
import { Button, Input } from '../../../components/ui';
import { formatPhone } from '../../../utils/formatPhone';
import { useProfile } from '../useProfile';
import deletelogo from '../../../assets/icons/deleteLogo.svg';
import galochka   from '../../../assets/icons/galochka.svg';

const profileSchema = yup.object({
  firstName: yup.string().trim().required('Введите имя'),
});

export default function MyData({ user }) {
  const {
    saving, saveError, saved,
    showConfirm, setShowConfirm,
    handleSave, handleDelete,
  } = useProfile();

  const { control, handleSubmit, formState: { errors, isDirty }, reset, getValues } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { firstName: user?.firstName || '' },
  });

  useEffect(() => {
    if (saved) reset({ firstName: getValues('firstName') });
  }, [saved]);

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
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input label="Имя" {...field} error={errors.firstName?.message} />
          )}
        />
        <Input label="Фамилия" value="(Только для дизайна)" readOnly />
        <Input label="Номер телефона" value={formatPhone(user?.phone)} readOnly />
      </div>

      <Button size="lg" disabled={!isDirty || saving} loading={saving} onClick={handleSubmit(({ firstName }) => handleSave(firstName))} className={styles.saveBtn}>
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
