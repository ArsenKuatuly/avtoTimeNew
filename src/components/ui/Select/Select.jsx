import toRight from '../../../assets/icons/toRight.svg';
import styles from './Select.module.css';

export default function Select({
  label,
  value = '',
  onChange,
  options = [],
  disabled = false,
  loading = false,
  error = '',
  placeholder = '— Выберите —',
}) {
  const filled = value !== '' && value !== null && value !== undefined;
  const cls = [
    styles.field,
    filled  && styles.filled,
    error   && styles.error,
    (disabled || loading) && styles.disabled,
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={cls}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          className={styles.select}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled || loading}
        >
          <option value="">{loading ? 'Загрузка...' : ''}</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        <img src={toRight} alt="" className={styles.arrow} />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
