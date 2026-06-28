import React, { useEffect, useRef } from 'react';
import styles from './Tagline.module.css';

import logo   from '../../../assets/icons/logo.png';
import block1 from '../../../assets/icons/block1.png';
import block2 from '../../../assets/icons/block2.png';
import block3 from '../../../assets/icons/block3.png';

export default function Tagline() {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.wrapperVisible);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        <div ref={wrapRef} className={styles.wrapper}>

          <div className={styles.block2} />
          <div className={styles.block3} />

          <div className={styles.card}>

            <div className={styles.content}>
              <img src={logo} alt="AVTO-TIME" className={styles.logo} />
              <p className={styles.text}>
                <span className={styles.white}>Avto-time </span>
                <span className={styles.blue}>- сэкономит время </span>
                <span className={styles.white}>на мойку автомобиля с помощью </span>
                <span className={styles.blue}>моментальной записи</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
