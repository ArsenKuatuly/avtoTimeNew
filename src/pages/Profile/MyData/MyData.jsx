import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './MyData.module.css';
import deletelogo from '../../../assets/icons/deletelogo.png';
import galochka   from '../../../assets/icons/galochka.png';

function formatPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '');
  const digits = d.length === 11 ? d.slice(1) : d;
  if (digits.length !== 10) return raw;
  return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
}

function FloatInput({ label, value, onChange, readOnly }) {
  const hasValue = value && value.length > 0;
  return (
    <div className={`${styles.floatField} ${hasValue ? styles.floatFieldFilled : ''}`}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.floatInput}
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        readOnly={readOnly}
      />
    </div>
  );
}

export default function MyData({ user }) {
  const { logout }    = useAuth();
  const navigate      = useNavigate();
  const [firstName,   setFirstName]   = useState(user?.firstName || '');
  const [saved,       setSaved]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDirty = firstName !== (user?.firstName || '');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    logout();
    navigate('/');
    sessionStorage.setItem('accountDeleted', '1');
  };

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
              <button className={styles.confirmBack} onClick={() => setShowConfirm(false)}>Назад</button>
              <button className={styles.confirmDelete} onClick={handleDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.form}>
        <FloatInput label="Имя"     value={firstName} onChange={setFirstName} />
        <FloatInput label="Фамилия" value="(Только для дизайна)" readOnly />
        <FloatInput label="Номер телефона" value={formatPhone(user?.phone)} readOnly />
      </div>

      <button
        className={`${styles.saveBtn} ${isDirty ? styles.saveBtnActive : styles.saveBtnDisabled}`}
        disabled={!isDirty}
        onClick={handleSave}
      >
        Сохранить
      </button>

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
