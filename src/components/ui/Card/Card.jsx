import React from 'react';
import styles from './Card.module.css';

export default function Card({
  children,
  variant = 'default',
  onClick,
  className = '',
}) {
  const cls = [
    styles.card,
    styles[variant],
    onClick && styles.clickable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
