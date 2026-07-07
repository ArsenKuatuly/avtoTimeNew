import React, { useState, useEffect } from 'react';
import Hero from '../../features/landing/Hero/Hero';
import Problems from '../../features/landing/Problems/Problems';
import Tagline from '../../features/landing/Tagline/Tagline';
import Features from '../../features/landing/Features/Features';
import galochka from '../../assets/icons/galochka.svg';
import styles from './Home.module.css';

export default function Home() {
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('accountDeleted')) {
      sessionStorage.removeItem('accountDeleted');
      setDeleted(true);
      setTimeout(() => setDeleted(false), 3000);
    }
  }, []);

  return (
    <main>
      {deleted && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastIcon} />
          Аккаунт удалён
        </div>
      )}
      <Hero />
      <Problems />
      <Tagline />
      <Features />
    </main>
  );
}
