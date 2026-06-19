import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import Problems from '../../components/Problems/Problems';
import Tagline from '../../components/Tagline/Tagline';
import Features from '../../components/Features/Features';
import galochka from '../../assets/icons/galochka.png';
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
