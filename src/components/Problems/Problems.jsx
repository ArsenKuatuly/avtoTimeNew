import React, { useEffect, useRef } from 'react';
import styles from './Problems.module.css';

const CARDS = [
  { percent: '74 %', desc: 'ожидают в очереди' },
  { percent: '12 %', desc: 'не могут  дозвониться до администратора' },
  { percent: '8 %',  desc: 'не знают, где помыть машину' },
  { percent: '6 %',  desc: 'Не удачный опыт' },
];

export default function Problems() {
  const cardRefs = useRef([]);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.cardVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        <h2 className={styles.title}>
          Частые проблемы, с которыми<br />
          сталкивается водитель при выборе<br />
          автомойки
        </h2>

        <div className={styles.cards}>
          {CARDS.map(({ percent, desc }, i) => (
            <div
              key={percent}
              ref={el => cardRefs.current[i] = el}
              className={styles.card}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <span className={styles.percent}>{percent}</span>
              <p className={styles.desc}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
