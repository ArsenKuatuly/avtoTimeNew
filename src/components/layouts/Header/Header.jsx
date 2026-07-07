import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../../providers/AuthContext';
import { ROUTES } from '../../../config/routes.config';

import logo           from '../../../assets/icons/logo.svg';
import insta          from '../../../assets/icons/instaLogo.svg';
import phone          from '../../../assets/icons/phoneLogo.svg';
import geo            from '../../../assets/icons/adressLogo.svg';
import profilelogo    from '../../../assets/icons/profileLogo.svg';
import mobileprofile  from '../../../assets/icons/mobileprofile.png';
import exitlogo       from '../../../assets/icons/exitLogo.svg';
import burgerbutton   from '../../../assets/icons/burgerButton.svg';
import playmarket     from '../../../assets/icons/playMarket.svg';
import appstore       from '../../../assets/icons/appStore.svg';

const NAV = [
  { to: ROUTES.home,     label: 'Главная'     },
  { to: ROUTES.services, label: 'Автосервисы' },
  { to: ROUTES.partners, label: 'Партнерам'   },
];

export default function Header() {
  const { user, openLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMenu  = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.inner}>

          <button className={styles.burgerBtn} onClick={openMenu} aria-label="Menu">
            <img src={burgerbutton} alt="Menu" className={styles.burgerIcon} />
          </button>

          <NavLink to={ROUTES.home} className={styles.logo}>
            <img src={logo} alt="AVTO-TIME" />
          </NavLink>

          <nav className={styles.nav}>
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.right}>
            {!user && (
              <>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`${styles.iconBtn} ${styles.socialIcon}`} aria-label="Instagram">
                  <img src={insta} alt="Instagram" className={styles.icon} />
                </a>

                <a href="tel:+77777777777" className={`${styles.contactLink} ${styles.socialIcon}`}>
                  <img src={phone} alt="Phone" className={styles.icon} />
                  <span>+7 777 777 77 77</span>
                </a>
              </>
            )}

            <div className={styles.contactItem}>
              <img src={geo} alt="Astana" className={styles.icon} />
              <span>Астана</span>
            </div>

            {user ? (
              <div className={styles.authIcons}>
                <button className={styles.iconBtn} aria-label="Profile" onClick={() => navigate(ROUTES.profile)}>
                  <img src={profilelogo} alt="Profile" className={styles.profileIcon} />
                </button>
                <button className={styles.iconBtn} onClick={logout} aria-label="Logout">
                  <img src={exitlogo} alt="Logout" className={styles.icon} />
                </button>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={openLogin}>Войти</button>
            )}
          </div>

        </div>
      </header>

      {menuOpen && (
        <div className={styles.drawerOverlay} onClick={closeMenu}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>

            <div className={styles.drawerHead}>
              <NavLink to={ROUTES.home} className={styles.drawerLogo} onClick={closeMenu}>
                <img src={logo} alt="AVTO-TIME" className={styles.drawerLogoImg} />
              </NavLink>
              <button className={styles.drawerClose} onClick={closeMenu} aria-label="Close">
                ✕
              </button>
            </div>

            <nav className={styles.drawerNav}>
              {NAV.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={() => styles.drawerLink}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {user ? (
              <button
                className={styles.drawerProfileBtn}
                onClick={() => { navigate(ROUTES.profile); closeMenu(); }}
              >
                <img src={mobileprofile} alt="" className={styles.drawerProfileIco} />
                Профиль
              </button>
            ) : (
              <button
                className={styles.drawerLoginBtn}
                onClick={() => { openLogin(); closeMenu(); }}
              >
                Войти
              </button>
            )}

            <div className={styles.drawerDivider} />

            <p className={styles.drawerStoreLabel}>Скачайте наше приложение</p>
            <div className={styles.drawerBadges}>
              <a href="#"><img src={playmarket} alt="Google Play" className={styles.drawerBadgeImg} /></a>
              <a href="#"><img src={appstore} alt="App Store" className={styles.drawerBadgeImg} /></a>
            </div>

            <a href="tel:+77777777777" className={styles.drawerContact}>
              <img src={phone} alt="" className={styles.icon} />
              <span>+7 777 777 77 77</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.drawerContact}>
              <img src={insta} alt="Instagram" className={styles.icon} />
            </a>

          </div>
        </div>
      )}
    </>
  );
}
