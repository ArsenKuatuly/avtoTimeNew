import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Footer.module.css';
import { COMPANY_PHONE, COMPANY_PHONE_RAW, INSTAGRAM_URL } from '../../../config/company.config';

import bluelogo   from '../../../assets/icons/blueLogo.svg';
import blackinsta from '../../../assets/icons/blackInsta.svg';
import blackphone from '../../../assets/icons/blackPhone.svg';
import playmarket from '../../../assets/icons/blackPM.svg';
import appstore   from '../../../assets/icons/blackAppStore.svg';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname === '/services') return null;
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.col}>
          <img src={bluelogo} alt="AVTO-TIME" className={styles.logo} />
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Информация</p>
          <nav className={styles.links}>
            <a href="#">Партнерам</a>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Пользовательское соглашение</a>
          </nav>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Скачайте наше приложение</p>
          <div className={styles.badges}>
            <a href="#"><img src={playmarket} alt="Google Play" /></a>
            <a href="#"><img src={appstore} alt="App Store" /></a>
          </div>
        </div>

        <div className={styles.contacts}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <img src={blackinsta} alt="Instagram" />
          </a>
          <a href={`tel:${COMPANY_PHONE_RAW}`} className={styles.phone}>
            <img src={blackphone} alt="" />
            <span>{COMPANY_PHONE}</span>
          </a>
        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.copyright}>
        <p>Copyright ©AVTO-TIME, 2024 Все права защищены.</p>
      </div>

    </footer>
  );
}
