import Button from '../Button/Button';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  open,
  icon,
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.top}>
          {icon && <img src={icon} alt="" className={styles.icon} />}
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.message}>{message}</p>
          </div>
        </div>
        <div className={styles.btns}>
          <Button variant="secondary" className={styles.btn} onClick={onCancel}>{cancelLabel}</Button>
          <Button className={styles.btn} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
