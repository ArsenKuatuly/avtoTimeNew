import { useState } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { useBonuses } from '../../features/bonuses/useBonuses';
import styles from './Profile.module.css';
import { formatPhone } from '../../utils/formatPhone';
import MyData          from '../../features/profile/MyData/MyData';
import MyBookings      from '../../features/bookings/MyBookings/MyBookings';
import MyGarage        from '../../features/garage/MyGarage/MyGarage';
import MyCards         from '../../features/profile/MyCards/MyCards';
import MyBonuses, { MobileBonuses, DesktopBonuses } from '../../features/bonuses/MyBonuses/MyBonuses';
import MyNotifications from '../../features/profile/MyNotifications/MyNotifications';
import podarok  from '../../assets/icons/podarok.svg';
import toright  from '../../assets/icons/toRight.svg';
import icoData      from '../../assets/icons/moidannye.svg';
import icoWProfile  from '../../assets/icons/wprofile.svg';
import icoBookings  from '../../assets/icons/moizapisi.svg';
import icoGarage    from '../../assets/icons/moigarage.svg';
import icoCards     from '../../assets/icons/moikarty.svg';
import icoBonuses   from '../../assets/icons/moibonusy.svg';
import icoNotif     from '../../assets/icons/uvedomleniya.svg';
import icoWBookings from '../../assets/icons/wmoizpisi.svg';
import icoWGarage   from '../../assets/icons/wmoigarage.svg';
import icoWNotif    from '../../assets/icons/wuvedomleniya.svg';
import icoDataA     from '../../assets/icons/bmoidannye.svg';
import icoBookingsA from '../../assets/icons/bmoizapisi.svg';
import icoGarageA   from '../../assets/icons/bmoigarage.svg';
import icoCardsA    from '../../assets/icons/bmoikarty.svg';
import icoBonusesA  from '../../assets/icons/bmoibonusy.svg';
import icoNotifA    from '../../assets/icons/buvedomleniya.svg';

const MENU = [
  { id: 'data',          label: 'Мои данные',  icon: icoData,     iconActive: icoDataA     },
  { id: 'bookings',      label: 'Мои записи',  icon: icoBookings, iconActive: icoBookingsA },
  { id: 'garage',        label: 'Мой гараж',   icon: icoGarage,   iconActive: icoGarageA   },
  { id: 'cards',         label: 'Мои карты',   icon: icoCards,    iconActive: icoCardsA    },
  { id: 'bonuses',       label: 'Мои бонусы',  icon: icoBonuses,  iconActive: icoBonusesA },
  { id: 'notifications', label: 'Уведомления', icon: icoNotif,    iconActive: icoNotifA    },
];

const MOBILE_MENU = [
  { id: 'data',          label: 'Мои данные',  icon: icoWProfile  },
  { id: 'bookings',      label: 'Мои записи',  icon: icoWBookings },
  { id: 'garage',        label: 'Мой гараж',   icon: icoWGarage   },
  { id: 'notifications', label: 'Уведомления', icon: icoWNotif    },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { bonuses } = useBonuses(user?.id);
  const [activeTab, setActiveTab] = useState('data');
  const [mobileTab, setMobileTab] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.pageTitle}>Профиль</h1>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.userPhone}>{formatPhone(user?.phone)}</p>
            </div>

            <button
              className={`${styles.giftRow} ${activeTab === 'gift' ? styles.giftRowActive : ''}`}
              onClick={() => setActiveTab('gift')}
            >
              <img src={podarok} alt="Подарок" className={styles.giftIcon} />
              <div>
                <p className={styles.giftTitle}>Мойка в подарок</p>
                <p className={styles.giftSub}>Как получить?</p>
              </div>
            </button>

            <nav className={styles.menu}>
              {MENU.map(({ id, label, icon, iconActive }) => (
                <button
                  key={id}
                  className={`${styles.menuItem} ${activeTab === id ? styles.menuItemActive : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <img src={activeTab === id ? iconActive : icon} alt={label} className={styles.menuIcon} />
                  <span className={styles.menuLabel}>{label}</span>
                  {id === 'bonuses' && bonuses != null && (
                    <span className={styles.menuBonus}>{bonuses.bonusCount.toLocaleString('ru')} Б</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {activeTab === 'bonuses' ? (
            <DesktopBonuses />
          ) : (
            <main className={styles.content}>
              {activeTab === 'data'          && <MyData user={user} />}
              {activeTab === 'bookings'      && <MyBookings />}
              {activeTab === 'garage'        && <MyGarage />}
              {activeTab === 'notifications' && <MyNotifications />}
              {activeTab === 'gift'          && <MyBonuses />}
              {activeTab === 'cards'         && <MyCards />}
            </main>
          )}
        </div>

        <div className={styles.mobileProfile}>
          {!mobileTab ? (
            <>
              <p className={styles.mobileUserName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.mobileUserPhone}>{formatPhone(user?.phone)}</p>

              <div className={styles.bonusCard} onClick={() => setMobileTab('bonuses')} style={{ cursor: 'pointer' }}>
                <div className={styles.bonusCardText}>
                  <p className={styles.bonusCardLabel}>Накоплено</p>
                  <p className={styles.bonusCardValue}>
                    {bonuses != null ? `${bonuses.bonusCount.toLocaleString('ru')} бонусов` : '...'}
                  </p>
                  <p className={styles.bonusCardSub}>
                    {bonuses ? `Получите кэшбек ${bonuses.loyaltyValue}% на следующую запись` : ''}
                  </p>
                </div>
                <img src={toright} alt="" className={styles.bonusCardArrow} />
              </div>

              <nav className={styles.mobileMenu}>
                {MOBILE_MENU.map(({ id, label, icon }) => (
                  <button key={id} className={styles.mobileMenuItem} onClick={() => setMobileTab(id)}>
                    <span className={styles.mobileMenuIconWrap}>
                      <img src={icon} alt="" className={styles.mobileMenuIcon} />
                    </span>
                    <span className={styles.mobileMenuLabel}>{label}</span>
                  </button>
                ))}
              </nav>

              <button className={styles.becomePartnerBtn}>Стать автосервисом</button>
              <button className={styles.mobileLogoutBtn} onClick={logout}>Выйти</button>
            </>
          ) : (
            <div className={styles.mobileSection}>
              {mobileTab !== 'bookings' && (
                <button className={styles.mobileBackBtn} onClick={() => setMobileTab(null)}>‹ Назад</button>
              )}
              {mobileTab === 'data'          && <MyData user={user} />}
              {mobileTab === 'bookings'      && <MyBookings onBackToProfile={() => setMobileTab(null)} />}
              {mobileTab === 'garage'        && <MyGarage />}
              {mobileTab === 'bonuses'       && <MobileBonuses />}
              {mobileTab === 'notifications' && <MyNotifications />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
