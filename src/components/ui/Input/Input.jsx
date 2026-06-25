import React from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  error = '',
  disabled = false,
  className = '',
  ...rest
}) {
  const filled = String(value ?? '').length > 0;

  const wrapCls = [
    styles.floatField,
    filled && styles.floatFieldFilled,
    error && styles.floatFieldError,
    disabled && styles.floatFieldDisabled,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        {label && <label className={styles.floatLabel}>{label}</label>}
        <input
          className={styles.floatInput}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
