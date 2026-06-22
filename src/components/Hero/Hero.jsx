import styles from './Hero.module.css';

import herophone   from '../../assets/icons/herophone.png';
import mobilephone from '../../assets/icons/mobilePhone.svg';
import qrcode     from '../../assets/icons/qr-avto.svg';
import playmarket from '../../assets/icons/playMarket.svg';
import appstore   from '../../assets/icons/appStore.svg';
import pautinka   from '../../assets/icons/pautinka.png';

export default function Hero() {
  return (
    <section className={styles.hero}>

      <div className={styles.inner}>

        <div className={styles.left}>
          <h1 className={styles.title}>
            Бронируйте&nbsp; запись в<br />автомойку онлайн
          </h1>

          <p className={styles.subtitle}>
            Бронируйте&nbsp; запись в автомойку онлайн
          </p>

          <button className={styles.ctaBtn}>Выбрать автомойку</button>

          <div className={styles.badges}>
            <a href="#" className={styles.badge}>
              <img src={playmarket} alt="Google Play" />
            </a>
            <a href="#" className={styles.badge}>
              <img src={appstore} alt="App Store" />
            </a>
          </div>

          <div className={styles.qrCard}>
            <div className={styles.qrText}>
              <p className={styles.qrTitle}>Загрузить<br />приложение</p>
              <p className={styles.qrDesc}>Наведите на qr<br />и скачайте приложение</p>
            </div>
            <div className={styles.qrImgWrap}>
              <img src={qrcode} alt="QR code" className={styles.qrImg} />
            </div>
          </div>
        </div>

      </div>

      <img src={pautinka}   alt="" className={styles.pautinka}  aria-hidden="true" />
      <img src={herophone}   alt="Avto-time app" className={`${styles.phone} ${styles.phoneDesktop}`} />
      <img src={mobilephone} alt="Avto-time app" className={`${styles.phone} ${styles.phoneMobile}`} />

    </section>
  );
}
