import React, { useEffect, useRef } from 'react';
import styles from './Features.module.css';

import calendar from '../../assets/icons/calendar.svg';
import percent  from '../../assets/icons/percent.svg';
import adress   from '../../assets/icons/adress.svg';
import star     from '../../assets/icons/star.svg';

const SMALL_CARDS = [
  { title: 'Кэшбек 2 %',           desc: 'Получайте кэшбек 2 %  с каждой записи',                                          icon: percent },
  { title: 'Список автомоек',       desc: 'Большое количество автомоек с онлайн-записью',                                   icon: adress  },
  { title: 'Только честные отзывы', desc: 'Отзывы только от автовладельцев, которые уже получили услугу',                   icon: star    },
];

export default function Features() {
  const topRef   = useRef(null);
  const smallRefs = useRef([]);

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

    if (topRef.current) observer.observe(topRef.current);
    smallRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        <h2 className={styles.title}>Возможности приложения</h2>

        <div ref={topRef} className={styles.topCard}>
          <img src={calendar} alt="Онлайн-запись" className={styles.calendarImg} />
          <div className={styles.topCardText}>
            <h3 className={styles.cardTitle}>Онлайн-запись</h3>
            <p className={styles.cardDesc}>
              Записывайтесь на любую автомойку - онлайн.<br />
              И приезжайте в указанное время без очереди и ожиданий
            </p>
          </div>
        </div>

        <div className={styles.bottomRow}>
          {SMALL_CARDS.map(({ title, desc, icon }, i) => (
            <div
              key={title}
              ref={el => smallRefs.current[i] = el}
              className={styles.smallCard}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className={styles.smallCardText}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
              <img src={icon} alt="" className={styles.bgIcon} aria-hidden="true" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
