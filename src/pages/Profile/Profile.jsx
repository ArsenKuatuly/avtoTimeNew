import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import carImg      from '../../assets/icons/car.svg';
import zapiseinet  from '../../assets/icons/zapiseinet.png';
import mestoIco    from '../../assets/icons/mesto.png';
import garagenet   from '../../assets/icons/garagenet.png';
import errorGarage from '../../assets/icons/errorGarage.png';
import calendarIco   from '../../assets/icons/iconCalendar.png';
import moicards      from '../../assets/icons/moicards.png';
import visaIco       from '../../assets/icons/visa.svg';
import mastercardIco from '../../assets/icons/mastercard.svg';
import icoRect     from '../../assets/icons/rectangle.png';
import icoBlueRect from '../../assets/icons/blueRectangle.png';
import icoGalRect  from '../../assets/icons/galochkaRectangle.png';
import podarok       from '../../assets/icons/podarok.svg';
import bonusIco      from '../../assets/icons/bonus.svg';
import bonusActive   from '../../assets/icons/bonusactive.svg';
import deletelogo    from '../../assets/icons/deletelogo.png';
import galochka      from '../../assets/icons/galochka.png';
import qrcode2         from '../../assets/icons/qrcode2.png';
import ico2gis         from '../../assets/icons/2gis.svg';
import icoFilter       from '../../assets/icons/filter.svg';
import yellowStar      from '../../assets/icons/yellowStar.svg';
import transparentStar from '../../assets/icons/transparentStar.png';
import strechImg        from '../../assets/icons/strech.png';
import blueCalendar    from '../../assets/icons/blueCalendar.svg';
import blueInformation from '../../assets/icons/blueInformation.svg';
import logoNakopleno   from '../../assets/icons/logoNakopleno.svg';
import logoIspolzovano from '../../assets/icons/logoIspolzovano.svg';
import icoData       from '../../assets/icons/moidannye.svg';
import icoWProfile   from '../../assets/icons/wprofile.svg';
import icoBookings   from '../../assets/icons/moizapisi.svg';
import icoGarage     from '../../assets/icons/moigarage.svg';
import icoCards      from '../../assets/icons/moikarty.svg';
import icoBonuses    from '../../assets/icons/moibonusy.svg';
import icoNotif      from '../../assets/icons/uvedomleniya.svg';
import icoDataA      from '../../assets/icons/bmoidannye.png';
import icoBookingsA  from '../../assets/icons/bmoizapisi.png';
import icoGarageA    from '../../assets/icons/bmoigarage.png';
import icoCardsA     from '../../assets/icons/bmoikarty.png';
import icoBonusesA   from '../../assets/icons/bmoibonusy.png';
import icoNotifA     from '../../assets/icons/buvedomleniya.png';
import toright       from '../../assets/icons/toright.png';

const MOBILE_MENU = [
  { id: 'data',          label: 'Мои данные',  icon: icoWProfile },
  { id: 'bookings',      label: 'Мои записи',  icon: icoBookings },
  { id: 'garage',        label: 'Мой гараж',   icon: icoGarage   },
  { id: 'notifications', label: 'Уведомления', icon: icoNotif    },
];

const DATE_PERIODS = ['Вчера', 'За неделю', 'За месяц', 'За пол года', 'За период'];

const MOCK_BONUS_TX = [
  { date: '20 июня', name: 'Crystal', sub: 'Покупка на сумму: 4 000 ₸', amount:  4000 },
  { date: '20 июня', name: 'Crystal', sub: 'Покупка на сумму: 4 000 ₸', amount: -4000 },
  { date: '18 июня', name: 'Crystal', sub: 'Покупка на сумму: 4 000 ₸', amount:  4000 },
  { date: '18 июня', name: 'Crystal', sub: 'Покупка на сумму: 4 000 ₸', amount: -4000 },
  { date: '15 июня', name: 'Crystal', sub: 'Покупка на сумму: 4 000 ₸', amount:  3600 },
];

const MENU = [
  { id: 'data',          label: 'Мои данные',  icon: icoData,     iconActive: icoDataA     },
  { id: 'bookings',      label: 'Мои записи',  icon: icoBookings, iconActive: icoBookingsA },
  { id: 'garage',        label: 'Мой гараж',   icon: icoGarage,   iconActive: icoGarageA   },
  { id: 'cards',         label: 'Мои карты',   icon: icoCards,    iconActive: icoCardsA    },
  { id: 'bonuses',       label: 'Мои бонусы',  icon: icoBonuses,  iconActive: icoBonusesA, bonus: '1 000 Б' },
  { id: 'notifications', label: 'Уведомления', icon: icoNotif,    iconActive: icoNotifA    },
];

export default function Profile() {
  const { user, logout } = useAuth();
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
              <p className={styles.userPhone}>{user?.phone}</p>
            </div>

            <div className={styles.giftRow}>
              <img src={podarok} alt="Подарок" className={styles.giftIcon} />
              <div>
                <p className={styles.giftTitle}>Мойка в подарок</p>
                <p className={styles.giftSub}>Как получить?</p>
              </div>
            </div>

            <nav className={styles.menu}>
              {MENU.map(({ id, label, icon, iconActive, bonus }) => (
                <button
                  key={id}
                  className={`${styles.menuItem} ${activeTab === id ? styles.menuItemActive : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <img src={activeTab === id ? iconActive : icon} alt={label} className={styles.menuIcon} />
                  <span className={styles.menuLabel}>{label}</span>
                  {bonus && <span className={styles.menuBonus}>{bonus}</span>}
                </button>
              ))}
            </nav>
          </aside>

          <main className={styles.content}>
            {activeTab === 'data'          && <MyData user={user} />}
            {activeTab === 'bookings'      && <MyBookings />}
            {activeTab === 'garage'        && <MyGarage />}
            {activeTab === 'notifications' && <MyNotifications />}
            {activeTab === 'bonuses'       && <MyBonuses />}
            {activeTab === 'cards'         && <MyCards />}
            {activeTab !== 'data' && activeTab !== 'bookings' && activeTab !== 'garage' && activeTab !== 'notifications' && activeTab !== 'bonuses' && activeTab !== 'cards' && (
              <div className={styles.empty}>Раздел в разработке</div>
            )}
          </main>
        </div>

        <div className={styles.mobileProfile}>
          {!mobileTab ? (
            <>
              <p className={styles.mobileUserName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.mobileUserPhone}>{user?.phone}</p>

              <div className={styles.bonusCard} onClick={() => setMobileTab('bonuses')} style={{ cursor: 'pointer' }}>
                <div className={styles.bonusCardText}>
                  <p className={styles.bonusCardLabel}>Накоплено</p>
                  <p className={styles.bonusCardValue}>0 бонусов</p>
                  <p className={styles.bonusCardSub}>Получите кэшбек 10% на первую запись</p>
                </div>
                <img src={toright} alt="" className={styles.bonusCardArrow} />
              </div>

              <nav className={styles.mobileMenu}>
                {MOBILE_MENU.map(({ id, label, icon }) => (
                  <button key={id} className={styles.mobileMenuItem} onClick={() => setMobileTab(id)}>
                    <span className={styles.mobileMenuIconWrap}>
                      {id === 'data' && <img src={icon} alt="" className={styles.mobileMenuIcon} />}
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

function MyData({ user }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [firstName,   setFirstName]   = useState(user?.firstName || '');
  const [lastName,    setLastName]    = useState(user?.lastName  || '');
  const [saved,       setSaved]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDirty = firstName !== (user?.firstName || '') || lastName !== (user?.lastName || '');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    logout();
    navigate('/');
    sessionStorage.setItem('accountDeleted', '1');
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои данные</h2>
        <button className={styles.deleteLink} onClick={() => setShowConfirm(true)}>Удалить аккаунт</button>
      </div>

      {showConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmTop}>
              <img src={deletelogo} alt="Удалить" className={styles.confirmIcon} />
              <div className={styles.confirmBody}>
                <h3 className={styles.confirmTitle}>Удаление аккаунта</h3>
                <p className={styles.confirmText}>
                  Вы действительно хотите удалить аккаунт?<br />
                  Все данные будут удалены безвозвратно
                </p>
              </div>
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmBack} onClick={() => setShowConfirm(false)}>Назад</button>
              <button className={styles.confirmDelete} onClick={handleDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.form}>
        <FloatInput label="Имя"     value={firstName} onChange={setFirstName} />
        <FloatInput label="Фамилия" value={lastName}  onChange={setLastName}  />
        <FloatInput label="Номер телефона" value={user?.phone || ''} readOnly />
      </div>

      <button
        className={`${styles.saveBtn} ${isDirty ? styles.saveBtnActive : styles.saveBtnDisabled}`}
        disabled={!isDirty}
        onClick={handleSave}
      >
        Сохранить
      </button>

      <button className={styles.deleteLinkMobile} onClick={() => setShowConfirm(true)}>Удалить аккаунт</button>

      {saved && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          Данные сохранены
        </div>
      )}
    </div>
  );
}

function FloatInput({ label, value, onChange, readOnly }) {
  const hasValue = value && value.length > 0;
  return (
    <div className={`${styles.floatField} ${hasValue ? styles.floatFieldFilled : ''}`}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.floatInput}
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        readOnly={readOnly}
      />
    </div>
  );
}


const MOCK_BOOKINGS = [
  { id: '1', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Новый',      payment: 'Картой онлайн', name: 'Акжол' },
  { id: '2', label: 'Онлайн-запись',    service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'В процессе', payment: 'Наличными',    name: 'Акжол' },
  { id: '3', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Завершён',   payment: 'Картой онлайн', name: 'Акжол' },
  { id: '4', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Отменён',    payment: 'Картой онлайн', name: 'Акжол' },
  { id: '5', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Отменён',    payment: 'Наличными',    name: 'Акжол' },
];

const STATUS_TABS = ['Все', 'Новый', 'В процессе', 'Завершён', 'Отменён'];

const STATUS_COLOR = {
  'Новый':      { bg: '#EBF0FF', color: '#006FFD' },
  'В процессе': { bg: '#FFF3D6', color: '#D97706' },
  'Завершён':   { bg: '#D1FAE5', color: '#059669' },
  'Отменён':    { bg: '#FEE2E2', color: '#DC2626' },
};

const PAGE_SIZE = 5;

function MyBookings({ onBackToProfile }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter]         = useState('Все');
  const [filterPeriod, setFilterPeriod]         = useState('');
  const [filterStatusDraft, setFilterStatusDraft] = useState('Все');
  const [filterPeriodDraft, setFilterPeriodDraft] = useState('');
  const [page, setPage]                         = useState(1);
  const [selectedBooking, setSelectedBooking]   = useState(null);
  const [showFilter, setShowFilter]             = useState(false);

  const filtered = activeFilter === 'Все'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter(b => b.status === activeFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = (activeFilter !== 'Все' ? 1 : 0) + (filterPeriod ? 1 : 0);
  const draftChanged = filterStatusDraft !== 'Все' || !!filterPeriodDraft;

  const handleFilter = (tab) => { setActiveFilter(tab); setPage(1); };

  const openFilter = () => {
    setFilterStatusDraft(activeFilter);
    setFilterPeriodDraft(filterPeriod);
    setShowFilter(true);
  };

  const applyFilter = () => {
    setActiveFilter(filterStatusDraft);
    setFilterPeriod(filterPeriodDraft);
    setPage(1);
    setShowFilter(false);
  };

  const resetDraft = () => { setFilterStatusDraft('Все'); setFilterPeriodDraft(''); };

  if (selectedBooking) {
    return <MobileBookingDetail booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  return (
    <div className={styles.section}>
      {onBackToProfile && (
        <button className={styles.mobileBackBtn} onClick={onBackToProfile}>‹ Назад</button>
      )}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои записи</h2>
        <button className={styles.bookingFilterBtn} onClick={openFilter}>
          <img src={icoFilter} alt="Фильтр" className={styles.bookingFilterIco} />
          {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
        </button>
      </div>

      <div className={styles.filterRow}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.filterTab} ${activeFilter === tab ? styles.filterTabActive : ''}`}
            onClick={() => handleFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {paged.length === 0 ? (
        <div className={styles.emptyBookings}>
          <div className={styles.emptyBookingsCircle}>
            <img src={zapiseinet} alt="" className={styles.emptyBookingsImgSm} />
          </div>
          <img src={zapiseinet} alt="Нет записей" className={styles.emptyBookingsImg} />
          <p className={styles.emptyBookingsText}>Записей еще нет</p>
        </div>
      ) : (
        <>
          <div className={styles.bookingList}>
            {paged.map(booking => (
              <React.Fragment key={booking.id}>
                <div className={styles.desktopBookingWrap}>
                  <BookingCard booking={booking} onClick={() => navigate(`/booking/${booking.id}`)} />
                </div>
                <div className={styles.mobileBookingWrap} onClick={() => setSelectedBooking(booking)}>
                  <MobileBookingCard booking={booking} />
                </div>
              </React.Fragment>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              <span className={styles.pageInfo}>{page} из {totalPages}</span>
              <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </>
      )}

      {showFilter && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowFilter(false)}>
          <div className={styles.mobileFilterSheet} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileFilterHeader}>
              <h3 className={styles.mobileFilterTitle}>Фильтр</h3>
              <button
                className={`${styles.mobileFilterReset} ${draftChanged ? styles.mobileFilterResetActive : ''}`}
                onClick={resetDraft}
              >Сбросить</button>
            </div>

            <p className={styles.mobileFilterLabel}>Статус</p>
            <div className={styles.mobileFilterChips}>
              {STATUS_TABS.map(tab => (
                <button
                  key={tab}
                  className={`${styles.mobileFilterChip} ${filterStatusDraft === tab ? styles.mobileFilterChipActive : ''}`}
                  onClick={() => setFilterStatusDraft(tab)}
                >{tab}</button>
              ))}
            </div>

            <p className={styles.mobileFilterLabel}>Период записи</p>
            <div className={styles.mobileFilterPeriodRow}>
              <input
                type="text"
                className={styles.mobileFilterPeriodInput}
                placeholder="Период"
                value={filterPeriodDraft}
                onChange={e => setFilterPeriodDraft(e.target.value)}
              />
              <img src={calendarIco} alt="" className={styles.mobileFilterCalIco} />
            </div>

            <button
              className={`${styles.mobileFilterApply} ${draftChanged ? styles.mobileFilterApplyActive : styles.mobileFilterApplyDisabled}`}
              onClick={applyFilter}
            >Применить</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileBookingCard({ booking }) {
  const { label, service, price, date, wash, address, status } = booking;
  const { color } = STATUS_COLOR[status] || { color: '#6B7280' };
  return (
    <div className={styles.mobileBookingCard}>
      <div className={styles.mobileBookingCardTop}>
        <span className={styles.mobileBookingLabel}>{label}</span>
        <span className={styles.mobileBookingBadge} style={{ borderColor: color, color }}>{status}</span>
      </div>
      <p className={styles.mobileBookingService}>{service}</p>
      <div className={styles.mobileBookingRow}>
        <span className={styles.mobileBookingPrice}>{price}</span>
        <span className={styles.mobileBookingDate}>{date}</span>
      </div>
      <div className={`${styles.mobileBookingRow} ${styles.mobileBookingRowAddr}`}>
        <span className={styles.mobileBookingWash}>{wash}</span>
        <span className={styles.mobileBookingAddr}>
          <img src={mestoIco} alt="" className={styles.mestoIcon} />
          {address}
        </span>
      </div>
    </div>
  );
}

const CANCEL_REASONS_MOBILE = [
  'Слишком долго ехать',
  'Изменились планы',
  'Смена предпочтений',
  'Технические проблемы',
  'Погодные условия',
  'Отсутсвие необходимости',
  'Другое',
];

function MobileBookingDetail({ booking, onBack }) {
  const [cancelled, setCancelled]         = useState(false);
  const [cancelledReason, setCancelledReason] = useState('');
  const [showCancel, setShowCancel]       = useState(false);
  const [cancelStep, setCancelStep]       = useState(1);
  const [reason, setReason]               = useState('');
  const [cancelComment, setCancelComment] = useState('');
  const [reviewed, setReviewed]           = useState(false);
  const [showReview, setShowReview]       = useState(false);
  const [rating, setRating]               = useState(0);
  const [hoverRating, setHoverRating]     = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [toastMsg, setToastMsg]           = useState('');
  const [toast, setToast]                 = useState(false);

  const currentStatus = cancelled ? 'Отменён' : booking.status;
  const { color } = STATUS_COLOR[currentStatus] || { color: '#6B7280' };
  const canCancel = (booking.status === 'Новый' || booking.status === 'В процессе') && !cancelled;
  const canReview = currentStatus === 'Завершён' && !reviewed;
  const activeRating = hoverRating || rating;

  const showToast = (msg) => { setToastMsg(msg); setToast(true); setTimeout(() => setToast(false), 3000); };

  const openCancel = () => { setReason(''); setCancelComment(''); setCancelStep(1); setShowCancel(true); };

  const handleCancel = () => {
    const finalReason = reason === 'Другое' ? (cancelComment.trim() || 'Другое') : reason;
    setCancelled(true);
    setCancelledReason(finalReason);
    setShowCancel(false);
    setCancelStep(1);
    showToast('Запись отменена');
  };

  const handleReview = () => {
    if (!rating) return;
    setReviewed(true);
    setShowReview(false);
    showToast('Отзыв оставлен');
  };

  return (
    <div className={styles.mobileDetailPage}>
      {toast && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          {toastMsg}
        </div>
      )}

      <button className={styles.mobileBackBtn} onClick={onBack}>‹ Назад</button>

      <div className={styles.mobileDetailImgWrap}>
        <img src={carImg} alt="car" className={styles.mobileDetailImg} />
        <div className={styles.mobileDetailDots}>
          <span className={`${styles.mobileDetailDot} ${styles.mobileDetailDotActive}`} />
          <span className={styles.mobileDetailDot} />
          <span className={styles.mobileDetailDot} />
        </div>
      </div>

      <div className={styles.mobileDetailBody}>
        <p className={styles.mobileDetailService}>{booking.service}</p>
        <div className={styles.mobileDetailPriceRow}>
          <span className={styles.mobileDetailPrice}>{booking.price}</span>
          <span className={styles.mobileBookingBadge} style={{ borderColor: color, color }}>{currentStatus}</span>
        </div>
        <p className={styles.mobileDetailWashName}>{booking.wash}</p>

        {cancelled && (
          <div className={styles.cancelInfoBlock}>
            <span className={styles.cancelInfoIcon}>⚠</span>
            <div>
              <p className={styles.cancelInfoTitle}>Запись отменена</p>
              <p className={styles.cancelInfoSub}>Причина отмены: {cancelledReason}</p>
            </div>
          </div>
        )}

        <button className={styles.twoGisBtn}>
          <img src={ico2gis} alt="2GIS" className={styles.twoGisIco} />
          Построить маршрут в 2 GIS
        </button>

        <div className={styles.mobileQrSection}>
          <p className={styles.mobileQrTitle}>Покажите QR-код</p>
          <img src={qrcode2} alt="QR" className={styles.mobileQrImg} />
        </div>

        <div className={styles.mobileDetailsSection}>
          <p className={styles.mobileDetailsSectionTitle}>Детали</p>
          {[
            { key: 'Имя',           val: booking.name     },
            { key: 'Автомойка',     val: booking.wash     },
            { key: 'Дата и время',  val: booking.date     },
            { key: 'Способ оплаты', val: booking.payment  },
          ].map(({ key, val }) => (
            <div key={key} className={styles.mobileDetailsRow}>
              <span className={styles.mobileDetailsKey}>{key}</span>
              <span className={styles.mobileDetailsVal}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mobileDetailFooter}>
        {canReview && (
          <button className={styles.reviewBookingBtn} onClick={() => { setRating(0); setShowReview(true); }}>
            Оставить отзыв
          </button>
        )}
        {(canCancel || cancelled) && (
          <button
            className={styles.cancelBookingBtn}
            disabled={cancelled}
            onClick={canCancel ? openCancel : undefined}
            style={cancelled ? { opacity: 0.5, cursor: 'default' } : {}}
          >
            Отменить запись
          </button>
        )}
      </div>

      {showCancel && cancelStep === 1 && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowCancel(false)}>
          <div className={styles.cancelSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Отмена записи</h3>
            <p className={styles.reviewSheetSub}>Укажите причину отмены записи</p>

            <div className={styles.cancelReasonList}>
              {CANCEL_REASONS_MOBILE.map(r => (
                <div key={r} className={styles.cancelReasonItem} onClick={() => setReason(r)}>
                  <span className={styles.cancelReasonText}>{r}</span>
                  {reason === r && <span className={styles.cancelReasonCheck}>✓</span>}
                </div>
              ))}
            </div>

            <div className={styles.cancelSheetBtns}>
              <button className={styles.cancelSheetBack} onClick={() => setShowCancel(false)}>Назад</button>
              <button
                className={`${styles.cancelSheetConfirm} ${reason ? styles.cancelSheetConfirmActive : styles.cancelSheetConfirmDisabled}`}
                disabled={!reason}
                onClick={() => reason === 'Другое' ? setCancelStep(2) : handleCancel()}
              >Отменить запись</button>
            </div>
          </div>
        </div>
      )}

      {showCancel && cancelStep === 2 && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowCancel(false)}>
          <div className={styles.cancelSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Отмена записи</h3>
            <p className={styles.reviewSheetSub}>Укажите комментарий для причины "Другое"</p>

            <div className={styles.reviewTextareaWrap}>
              <textarea
                className={styles.reviewTextarea}
                placeholder="Напишите комментарий"
                maxLength={100}
                value={cancelComment}
                onChange={e => setCancelComment(e.target.value)}
              />
              <img src={strechImg} alt="" className={styles.reviewResizeIco} />
            </div>
            <span className={styles.reviewCharCount}>{cancelComment.length}/100</span>

            <button
              className={`${styles.reviewSheetBtn} ${cancelComment.trim() ? styles.reviewSheetBtnActive : styles.reviewSheetBtnDisabled}`}
              disabled={!cancelComment.trim()}
              onClick={handleCancel}
            >Отменить запись</button>
          </div>
        </div>
      )}

      {showReview && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowReview(false)}>
          <div className={styles.reviewSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Оставить отзыв</h3>
            <p className={styles.reviewSheetSub}>Оставьте отзыв об автомойке "{booking.wash}"</p>

            <div className={styles.mobileStarsRow}>
              {[1,2,3,4,5].map(i => (
                <img
                  key={i}
                  src={i <= activeRating ? yellowStar : transparentStar}
                  alt={`${i}`}
                  className={styles.mobileStar}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>

            {activeRating > 0 && (
              <p className={styles.reviewRatingLabel}>
                {['','Ужасно!','Плохо','Есть замечания','Хорошо','Превосходно!'][activeRating]}
              </p>
            )}

            <div className={styles.reviewTextareaWrap}>
              <textarea
                className={styles.reviewTextarea}
                placeholder="Напишите комментарий"
                maxLength={100}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
              />
              <img src={strechImg} alt="" className={styles.reviewResizeIco} />
            </div>
            <span className={styles.reviewCharCount}>{reviewComment.length}/100</span>

            <button
              className={`${styles.reviewSheetBtn} ${rating > 0 ? styles.reviewSheetBtnActive : styles.reviewSheetBtnDisabled}`}
              disabled={rating === 0}
              onClick={handleReview}
            >Оставить отзыв</button>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_CARS_INIT = [
  { id: 1,  model: 'KIA',   make: '',       plate: '444 sss 01', body: 'Седан'     },
  { id: 2,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Седан'     },
  { id: 3,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Седан'     },
  { id: 4,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Седан'     },
  { id: 5,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Седан'     },
  { id: 6,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Седан'     },
  { id: 7,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Хэтчбек'  },
  { id: 8,  model: 'KIA',   make: 'Optima', plate: '444 sss 01', body: 'Кроссовер' },
];

const BODY_TYPES = ['Хэтчбек', 'Седан', 'Кроссовер'];
const GARAGE_PAGE_SIZE = 6;

function MyGarage() {
  const [cars, setCars]         = useState(MOCK_CARS_INIT);
  const [page, setPage]         = useState(1);
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [body,  setBody]  = useState('');
  const [model, setModel] = useState('');
  const [make,  setMake]  = useState('');
  const [plate, setPlate] = useState('');

  const [deleteCar, setDeleteCar] = useState(null);
  const [mobileActionCar, setMobileActionCar] = useState(null);

  const [editCar,   setEditCar]   = useState(null);
  const [eBody,  setEBody]  = useState('');
  const [eModel, setEModel] = useState('');
  const [eMake,  setEMake]  = useState('');
  const [ePlate, setEPlate] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const totalPages = Math.max(1, Math.ceil(cars.length / GARAGE_PAGE_SIZE));
  const paged = cars.slice((page - 1) * GARAGE_PAGE_SIZE, page * GARAGE_PAGE_SIZE);

  const showToast = (msg) => { setToastMsg(msg); setToast(true); setTimeout(() => setToast(false), 3000); };

  const openAdd = () => { setBody('Седан'); setModel(''); setMake(''); setPlate(''); setShowAdd(true); };

  const handleAdd = () => {
    const newCar = { id: Date.now(), model, make, plate, body };
    setCars(prev => [newCar, ...prev]);
    setShowAdd(false);
    setPage(1);
    showToast('Авто добавлено');
  };

  const openEdit = (car) => {
    setEditCar(car);
    setEBody(car.body); setEModel(car.model); setEMake(car.make); setEPlate(car.plate);
    setOpenMenu(null);
  };

  const handleEdit = () => {
    setCars(prev => prev.map(c => c.id === editCar.id
      ? { ...c, body: eBody, model: eModel, make: eMake, plate: ePlate }
      : c
    ));
    setEditCar(null);
    showToast('Авто отредактировано');
  };

  const handleDelete = (car) => { setDeleteCar(car); setOpenMenu(null); };

  const confirmDelete = () => {
    setCars(prev => prev.filter(c => c.id !== deleteCar.id));
    setDeleteCar(null);
    showToast('Машина удалена');
  };

  const canAdd = model.trim() && make.trim() && plate.trim();
  const editIsDirty = editCar && (eBody !== editCar.body || eModel !== editCar.model || eMake !== editCar.make || ePlate !== editCar.plate);
  const canEdit = editIsDirty && eModel.trim() && eMake.trim() && ePlate.trim();

  return (
    <div className={styles.section}>
      {toast && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          {toastMsg}
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мой гараж</h2>
        <button className={styles.addCarBtn} onClick={openAdd}>
          <span className={styles.addCarBtnTextFull}>Добавить авто</span>
          <span className={styles.addCarBtnTextShort}>Добавить</span>
        </button>
      </div>

      {cars.length === 0 ? (
        <div className={styles.emptyGarage}>
          <span className={styles.emptyGarageIconWrap}>
            <img src={garagenet} alt="Гараж пуст" className={styles.emptyGarageImg} />
          </span>
          <p className={styles.emptyGarageText}>Добавленных авто еще нет</p>
        </div>
      ) : (
        <>
          <div className={styles.carGrid}>
            {paged.map(car => {
              const hasError = !car.make;
              const title = [car.model, car.make].filter(Boolean).join(' ');
              const sub = `${car.plate}/${car.body.toLowerCase()}`;
              return (
                <div
                  key={car.id}
                  className={`${styles.carCard} ${hasError ? styles.carCardError : ''}`}
                  onClick={() => { if (openMenu === car.id) { setOpenMenu(null); return; } setMobileActionCar(car); }}
                >
                  <div className={styles.carCardTop}>
                    <div>
                      <p className={styles.carName}>{title}</p>
                      <p className={styles.carSub}>{sub}</p>
                    </div>
                    <div className={styles.carMenuWrap}>
                      <button
                        className={styles.carMenuBtn}
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === car.id ? null : car.id); }}
                      >⋮</button>
                      {openMenu === car.id && (
                        <div className={styles.carMenuDropdown}>
                          <button className={styles.carMenuItem} onClick={() => openEdit(car)}>
                            Редактировать
                          </button>
                          <button className={styles.carMenuItemDelete} onClick={() => handleDelete(car)}>
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasError && (
                    <div className={styles.carError}>
                      <img src={errorGarage} alt="!" className={styles.carErrorIco} />
                      <span>Модель машины не выбран</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              <span className={styles.pageInfo}>{page} из {totalPages}</span>
              <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className={styles.confirmOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <button className={styles.addCarModalClose} onClick={() => setShowAdd(false)}>✕</button>
              <h3 className={styles.addCarModalTitle}>Добавление авто</h3>
            </div>

            <p className={styles.addCarLabel}>Тип кузова</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.bodyChip} ${body === t ? styles.bodyChipActive : ''}`}
                  onClick={() => setBody(t)}
                >{t}</button>
              ))}
            </div>

            <GarageInput label="Марка"  value={make}  onChange={setMake}  />
            <GarageInput label="Модель" value={model} onChange={setModel} />
            <GarageInput label="Гос номер" value={plate} onChange={setPlate} />

            <button
              className={`${styles.addCarSubmit} ${canAdd ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canAdd}
              onClick={handleAdd}
            >Добавить</button>
          </div>
        </div>
      )}

      {deleteCar && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteCar(null)}>
          <div className={styles.deleteCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteCarTop}>
              <img src={deletelogo} alt="" className={styles.deleteCarIco} />
              <div>
                <h3 className={styles.deleteCarTitle}>Удаление авто</h3>
                <p className={styles.deleteCarText}>
                  Вы действительно хотите удалить авто {[deleteCar.model, deleteCar.make].filter(Boolean).join(' ')}/{deleteCar.plate}?
                </p>
              </div>
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmBack} onClick={() => setDeleteCar(null)}>Отмена</button>
              <button className={styles.confirmDelete} onClick={confirmDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {mobileActionCar && (
        <div className={styles.mobileSheetOverlay} onClick={() => setMobileActionCar(null)}>
          <div className={styles.mobileActionSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Действие</h3>
            <button className={styles.mobileActionBtn} onClick={() => { openEdit(mobileActionCar); setMobileActionCar(null); }}>
              Редактировать
            </button>
            <button className={styles.mobileActionBtn} onClick={() => { handleDelete(mobileActionCar); setMobileActionCar(null); }}>
              Удалить
            </button>
          </div>
        </div>
      )}

      {editCar && (
        <div className={styles.confirmOverlay} onClick={() => setEditCar(null)}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <h3 className={styles.addCarModalTitle}>Редактирование авто</h3>
              <button className={styles.addCarModalClose} onClick={() => setEditCar(null)}>✕</button>
            </div>

            <p className={styles.addCarLabel}>Кузов</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.bodyChip} ${eBody === t ? styles.bodyChipActive : ''}`}
                  onClick={() => setEBody(t)}
                >{t}</button>
              ))}
            </div>

            <GarageInput label="Модель"    value={eModel} onChange={setEModel} />
            <GarageInput label="Марка"     value={eMake}  onChange={setEMake}  />
            <GarageInput label="Гос номер" value={ePlate} onChange={setEPlate} />

            <button
              className={`${styles.addCarSubmit} ${canEdit ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canEdit}
              onClick={handleEdit}
            >Редактировать</button>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_NOTIFS = [
  { id: 1,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '18 июня', group: 'Сегодня' },
  { id: 2,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '18 июня', group: 'Сегодня' },
  { id: 3,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '8 июня',  group: '8 июня'  },
  { id: 4,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '8 июня',  group: '8 июня'  },
  { id: 5,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: 'Вчера',   group: 'Вчера'   },
  { id: 6,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: 'Вчера',   group: 'Вчера'   },
  { id: 7,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: 'Вчера',   group: 'Вчера'   },
  { id: 8,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '1 июня',  group: '1 июня'  },
  { id: 9,  title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '1 июня',  group: '1 июня'  },
  { id: 10, title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '25 мая', group: '25 мая'  },
  { id: 11, title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '25 мая', group: '25 мая'  },
  { id: 12, title: 'Заголовок', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', date: '25 мая', group: '25 мая'  },
];

const NOTIF_PAGE_SIZE = 5;

function buildNotifItems(list) {
  const items = [];
  let lastGroup = null;
  list.forEach(n => {
    if (n.group !== lastGroup) {
      items.push({ type: 'sep', id: `sep-${n.id}`, label: n.group });
      lastGroup = n.group;
    }
    items.push({ type: 'notif', ...n });
  });
  return items;
}

function MyNotifications() {
  const [page, setPage] = useState(1);
  const isEmpty = MOCK_NOTIFS.length === 0;
  const totalPages = Math.max(1, Math.ceil(MOCK_NOTIFS.length / NOTIF_PAGE_SIZE));
  const paged = MOCK_NOTIFS.slice((page - 1) * NOTIF_PAGE_SIZE, page * NOTIF_PAGE_SIZE);
  const items = buildNotifItems(paged);

  if (isEmpty) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Уведомления</h2>
        <div className={styles.notifEmpty}>
          <div className={styles.notifEmptyCircle}>
            <img src={icoNotif} alt="" className={styles.notifEmptyIco} />
          </div>
          <p className={styles.notifEmptyText}>Уведомлений еще нет</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ marginBottom: 20 }}>Уведомления</h2>

      <div className={styles.notifList}>
        {items.map(item =>
          item.type === 'sep'
            ? <div key={item.id} className={styles.notifGroupSep}>{item.label}</div>
            : (
              <div key={item.id} className={styles.notifCard}>
                <p className={styles.notifTitle}>{item.title}</p>
                <p className={styles.notifText}>{item.text}</p>
                <p className={styles.notifDate}>{item.date}</p>
              </div>
            )
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          <span className={styles.pageInfo}>{page} из {totalPages}</span>
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </div>
  );
}

const BONUS_LEVELS = [
  { cashback: '10 %', label: 'За первую запись',      state: 'done'    },
  { cashback: '50 %', label: 'За вторую запись',      state: 'current' },
  { cashback: '2 %',  label: 'За последующие записи', state: 'future'  },
];

function MobileBonuses() {
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showLevels, setShowLevels]       = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('За неделю');

  const PERIOD_LABEL = {
    'Вчера':       'Вчера',
    'За неделю':   '13 июня - 20 июня',
    'За месяц':    '20 мая - 20 июня',
    'За пол года': 'Янв 2024 - Июн 2024',
    'За период':   '1 июня - 17 июня',
  };

  const nakopleno  = MOCK_BONUS_TX.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const ispolzovano = MOCK_BONUS_TX.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  const grouped = MOCK_BONUS_TX.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  const fmt = (n) => Math.abs(n).toLocaleString('ru-RU');

  return (
    <div className={styles.section}>
      <div className={styles.bonusBalanceCard}>
        <p className={styles.bonusBalanceLabel}>Текущий баланс</p>
        <p className={styles.bonusBalanceAmount}>500 бонусов</p>
        <p className={styles.bonusBalanceSub}>Получите кэшбек 50% на вторую запись</p>
      </div>

      <button className={styles.bonusLevelsLink} onClick={() => setShowLevels(true)}>
        Уровни бонусов
        <img src={blueInformation} alt="" className={styles.bonusInfoIco} />
      </button>

      <p className={styles.bonusSectionLabel}>Выписка</p>

      <button className={styles.bonusDateRow} onClick={() => setShowDateSheet(true)}>
        <img src={blueCalendar} alt="" className={styles.bonusCalIco} />
        <span className={styles.bonusDateText}>{PERIOD_LABEL[selectedPeriod]}</span>
      </button>

      <div className={styles.bonusStatsRow}>
        <div className={styles.bonusStatCard}>
          <img src={logoNakopleno} alt="" className={styles.bonusStatIco} />
          <div>
            <p className={styles.bonusStatLabel}>Накоплено</p>
            <p className={`${styles.bonusStatVal} ${styles.bonusStatPos}`}>{fmt(nakopleno)} Б</p>
          </div>
        </div>
        <div className={styles.bonusStatCard}>
          <img src={logoIspolzovano} alt="" className={styles.bonusStatIco} />
          <div>
            <p className={styles.bonusStatLabel}>Использовано</p>
            <p className={`${styles.bonusStatVal} ${styles.bonusStatNeg}`}>-{fmt(ispolzovano)} Б</p>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date} className={styles.bonusTxGroup}>
          <p className={styles.bonusTxDate}>{date}</p>
          <div className={styles.bonusTxCard}>
            {txs.map((tx, i) => (
              <div key={i} className={`${styles.bonusTxRow} ${i < txs.length - 1 ? styles.bonusTxRowBorder : ''}`}>
                <div>
                  <p className={styles.bonusTxName}>{tx.name}</p>
                  <p className={styles.bonusTxSub}>{tx.sub}</p>
                </div>
                <span className={tx.amount > 0 ? styles.bonusTxPos : styles.bonusTxNeg}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} Б
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showLevels && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowLevels(false)}>
          <div className={styles.levelsSheet} onClick={e => e.stopPropagation()}>
            <div className={styles.levelsSheetHeader}>
              <h3 className={styles.mobileActionTitle}>Уровни бонусов</h3>
              <button className={styles.levelsSheetClose} onClick={() => setShowLevels(false)}>✕</button>
            </div>

            <div className={styles.levelsTimeline}>
              {BONUS_LEVELS.map((lvl, idx) => {
                const ico = lvl.state === 'done' ? icoGalRect : lvl.state === 'current' ? icoBlueRect : icoRect;
                return (
                  <div key={idx} className={styles.levelsTimelineItem}>
                    <div className={styles.levelsTimelineLeft}>
                      <img src={ico} alt="" className={styles.levelStepIco} />
                      {idx < BONUS_LEVELS.length - 1 && <div className={styles.levelStepLine} />}
                    </div>
                    <div className={styles.levelsTimelineRight}>
                      <p className={styles.levelStepCashback}>{lvl.cashback}</p>
                      <p className={styles.levelStepLabel}>{lvl.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showDateSheet && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowDateSheet(false)}>
          <div className={styles.cancelSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Дата</h3>
            <div className={styles.cancelReasonList}>
              {DATE_PERIODS.map(p => (
                <div key={p} className={styles.cancelReasonItem}
                  onClick={() => { setSelectedPeriod(p); setShowDateSheet(false); }}>
                  <div>
                    <span className={styles.cancelReasonText}>{p}</span>
                    {p === 'За период' && selectedPeriod === 'За период' && (
                      <p className={styles.bonusPeriodSub}>{PERIOD_LABEL['За период']}</p>
                    )}
                  </div>
                  {selectedPeriod === p && <span className={styles.cancelReasonCheck}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PUNCH_TOTAL = 5;

const MOCK_PUNCH_CARDS = [
  { id: 1, wash: 'Auto-wash', car: 'Kia/optima', done: 5 },
  { id: 2, wash: 'Auto-wash', car: 'Kia/optima', done: 5 },
  { id: 3, wash: 'Auto-wash', car: 'Kia/optima', done: 5 },
  { id: 4, wash: 'Auto-wash', car: 'Kia/optima', done: 3 },
  { id: 5, wash: 'Auto-wash', car: 'Kia/optima', done: 4 },
  { id: 6, wash: 'Auto-wash', car: 'Kia/optima', done: 2 },
];

const HISTORY_DATES = ['24.09.2025', '20.09.2025', '15.09.2025', '10.09.2025', '05.09.2025'];

function MyBonuses() {
  const [detail, setDetail] = useState(null);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle} style={{ marginBottom: 6 }}>Мойка в подарок</h2>
      <p className={styles.bonusSubtitle}>Каждая 6-я мойка в подарок</p>
      <p className={styles.bonusDesc}>Сделай 5 записей на мойку машины и получи 6 мойку бесплатно</p>

      <div className={styles.punchGrid}>
        {MOCK_PUNCH_CARDS.map(card => (
          <div key={card.id} className={styles.punchCard}>
            <div className={styles.stampGrid}>
              {Array.from({ length: PUNCH_TOTAL }).map((_, i) => (
                <img key={i} src={i < card.done ? bonusActive : bonusIco} alt="" className={styles.stamp} />
              ))}
              <img src={bonusIco} alt="" className={styles.stamp} />
            </div>
            <button className={styles.punchMore} onClick={() => setDetail(card)}>
              Подробнее
            </button>
          </div>
        ))}
      </div>

      {detail && (
        <div className={styles.confirmOverlay} onClick={() => setDetail(null)}>
          <div className={styles.historyModal} onClick={e => e.stopPropagation()}>
            <div className={styles.historyHead}>
              <h3 className={styles.historyTitle}>История записей</h3>
              <button className={styles.addCarModalClose} onClick={() => setDetail(null)}>✕</button>
            </div>
            {Array.from({ length: detail.done }).map((_, i) => (
              <div key={i} className={`${styles.historyItem} ${i < detail.done - 1 ? styles.historyItemBorder : ''}`}>
                <img src={bonusActive} alt="" className={styles.historyIco} />
                <div style={{ flex: 1 }}>
                  <p className={styles.historyName}>{detail.wash}</p>
                  <p className={styles.historySub}>{detail.car}</p>
                </div>
                <span className={styles.historyDate}>{HISTORY_DATES[i] || '01.09.2025'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_CARDS_INIT = [
  { id: 1, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: true  },
  { id: 2, name: 'Карта kaspi', number: '5444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 3, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 4, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 5, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 6, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 7, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
  { id: 8, name: 'Карта kaspi', number: '4444444444444930', expiry: '04.08.2025', cvv: '343', holder: 'Rasul Abdirov', primary: false },
];

const CARDS_PAGE_SIZE = 6;

function cardTypeIco(number) {
  return number.startsWith('5') ? mastercardIco : visaIco;
}
function maskNumber(number) {
  return '**** **** **** ' + number.slice(-4);
}

function MyCards() {
  const [cards, setCards]         = useState(MOCK_CARDS_INIT);
  const [page, setPage]           = useState(1);
  const [showAdd, setShowAdd]     = useState(false);
  const [toastMsg, setToastMsg]   = useState('');
  const [toast, setToast]         = useState(false);
  const [openMenu, setOpenMenu]   = useState(null);
  const [deleteCard, setDeleteCard] = useState(null);
  const [editCard, setEditCard]   = useState(null);

  const [cName,    setCName]    = useState('');
  const [cNumber,  setCNumber]  = useState('');
  const [cExpiry,  setCExpiry]  = useState('');
  const [cCvv,     setCCvv]     = useState('');
  const [cHolder,  setCHolder]  = useState('');
  const [cPrimary, setCPrimary] = useState(false);

  const [eName,    setEName]    = useState('');
  const [eNumber,  setENumber]  = useState('');
  const [eExpiry,  setEExpiry]  = useState('');
  const [eCvv,     setECvv]     = useState('');
  const [eHolder,  setEHolder]  = useState('');
  const [ePrimary, setEPrimary] = useState(false);

  const totalPages = Math.max(1, Math.ceil(cards.length / CARDS_PAGE_SIZE));
  const paged = cards.slice((page - 1) * CARDS_PAGE_SIZE, page * CARDS_PAGE_SIZE);

  const showToast = (msg) => { setToastMsg(msg); setToast(true); setTimeout(() => setToast(false), 3000); };

  const openAdd = () => {
    setCName(''); setCNumber(''); setCExpiry(''); setCCvv(''); setCHolder(''); setCPrimary(false);
    setShowAdd(true);
  };

  const handleAdd = () => {
    const newCard = { id: Date.now(), name: cName, number: cNumber, expiry: cExpiry, cvv: cCvv, holder: cHolder, primary: cPrimary };
    setCards(prev => {
      const updated = cPrimary ? prev.map(c => ({ ...c, primary: false })) : prev;
      return [newCard, ...updated];
    });
    setShowAdd(false);
    setPage(1);
    showToast('Карта добавлена');
  };

  const openEdit = (card) => {
    setEditCard(card);
    setEName(card.name); setENumber(card.number); setEExpiry(card.expiry);
    setECvv(card.cvv); setEHolder(card.holder); setEPrimary(card.primary);
    setOpenMenu(null);
  };

  const handleEdit = () => {
    setCards(prev => prev.map(c => {
      if (c.id === editCard.id) return { ...c, name: eName, number: eNumber, expiry: eExpiry, cvv: eCvv, holder: eHolder, primary: ePrimary };
      if (ePrimary) return { ...c, primary: false };
      return c;
    }));
    setEditCard(null);
    showToast('Карта отредактирована');
  };

  const handleDelete = () => {
    setCards(prev => prev.filter(c => c.id !== deleteCard.id));
    setDeleteCard(null);
    showToast('Карта удалена');
  };

  const makePrimary = (card) => {
    setCards(prev => prev.map(c => ({ ...c, primary: c.id === card.id })));
    setOpenMenu(null);
    showToast('Основная карта изменена');
  };

  const canAdd = cName.trim() && cNumber.trim() && cExpiry.trim() && cCvv.trim() && cHolder.trim();

  const editIsDirty = editCard && (
    eName !== editCard.name || eNumber !== editCard.number ||
    eExpiry !== editCard.expiry || eCvv !== editCard.cvv ||
    eHolder !== editCard.holder || ePrimary !== editCard.primary
  );
  const canEdit = editIsDirty && eName.trim() && eNumber.trim() && eExpiry.trim() && eCvv.trim() && eHolder.trim();

  return (
    <div className={styles.section}>
      {toast && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          {toastMsg}
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои карты</h2>
        <button className={styles.addCarBtn} onClick={openAdd}>Добавить карту</button>
      </div>

      {cards.length === 0 ? (
        <div className={styles.emptyGarage}>
          <img src={moicards} alt="" className={styles.emptyGarageImg} />
          <p className={styles.emptyGarageText}>Добавленных карт еще нет</p>
        </div>
      ) : (
        <>
          <div className={styles.carGrid}>
            {paged.map(card => (
              <div key={card.id} className={styles.carCard}>
                <div className={styles.carCardTop}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.cardNameRow}>
                      <p className={styles.carName}>{card.name}</p>
                      {card.primary && <span className={styles.primaryBadge}>Основная</span>}
                    </div>
                    <p className={styles.carSub}>{maskNumber(card.number)}</p>
                  </div>
                  <div className={styles.carMenuWrap}>
                    <button className={styles.carMenuBtn}
                      onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === card.id ? null : card.id); }}>⋮</button>
                    {openMenu === card.id && (
                      <div className={styles.carMenuDropdown}>
                        <button className={styles.carMenuItem} onClick={() => openEdit(card)}>
                          Редактировать
                        </button>
                        <button className={styles.carMenuItemDelete} onClick={() => { setDeleteCard(card); setOpenMenu(null); }}>
                          Удалить
                        </button>
                        {!card.primary && (
                          <button className={styles.carMenuItem} onClick={() => makePrimary(card)}>
                            Сделать основной
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <img src={cardTypeIco(card.number)} alt="" className={styles.cardTypeIco} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              <span className={styles.pageInfo}>{page} из {totalPages}</span>
              <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <div className={styles.confirmOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <h3 className={styles.addCarModalTitle}>Добавление карты</h3>
              <button className={styles.addCarModalClose} onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <CardInput label="Наименование карты" value={cName}   onChange={setCName}   />
            <CardInput label="Номер карты"         value={cNumber} onChange={setCNumber} />
            <div className={styles.cardRow}>
              <div className={`${styles.cardExpiryWrap} ${cExpiry ? styles.garageFieldFilled : ''}`}>
                <label className={styles.garageLabel}>Срок действия</label>
                <input className={styles.garageInput} value={cExpiry} onChange={e => setCExpiry(e.target.value)} placeholder="" />
                <img src={calendarIco} alt="" className={styles.cardExpiryIco} />
              </div>
              <div className={styles.cardCvvWrap}>
                <CardInput label="CVV" value={cCvv} onChange={setCCvv} />
              </div>
            </div>
            <CardInput label="Фамилия и имя" value={cHolder} onChange={setCHolder} />
            <div className={styles.cardToggleRow}>
              <span className={styles.cardToggleLabel}>Сделать основной</span>
              <div className={`${styles.toggle} ${cPrimary ? styles.toggleOn : ''}`} onClick={() => setCPrimary(p => !p)}>
                <div className={styles.toggleThumb} />
              </div>
            </div>
            <button
              className={`${styles.addCarSubmit} ${canAdd ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canAdd}
              onClick={handleAdd}
            >Добавить</button>
          </div>
        </div>
      )}

      {editCard && (
        <div className={styles.confirmOverlay} onClick={() => setEditCard(null)}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <h3 className={styles.addCarModalTitle}>Редактирование карты</h3>
              <button className={styles.addCarModalClose} onClick={() => setEditCard(null)}>✕</button>
            </div>
            <CardInput label="Наименование карты" value={eName}   onChange={setEName}   />
            <CardInput label="Номер карты"         value={eNumber} onChange={setENumber} />
            <div className={styles.cardRow}>
              <div className={`${styles.cardExpiryWrap} ${eExpiry ? styles.garageFieldFilled : ''}`}>
                <label className={styles.garageLabel}>Срок действия</label>
                <input className={styles.garageInput} value={eExpiry} onChange={e => setEExpiry(e.target.value)} placeholder="" />
                <img src={calendarIco} alt="" className={styles.cardExpiryIco} />
              </div>
              <div className={styles.cardCvvWrap}>
                <CardInput label="CVV" value={eCvv} onChange={setECvv} />
              </div>
            </div>
            <CardInput label="Фамилия и имя" value={eHolder} onChange={setEHolder} />
            <div className={styles.cardToggleRow}>
              <span className={styles.cardToggleLabel}>Сделать основной</span>
              <div className={`${styles.toggle} ${ePrimary ? styles.toggleOn : ''}`} onClick={() => setEPrimary(p => !p)}>
                <div className={styles.toggleThumb} />
              </div>
            </div>
            <button
              className={`${styles.addCarSubmit} ${canEdit ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canEdit}
              onClick={handleEdit}
            >Редактировать</button>
          </div>
        </div>
      )}

      {deleteCard && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteCard(null)}>
          <div className={styles.deleteCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteCarTop}>
              <img src={deletelogo} alt="" className={styles.deleteCarIco} />
              <div>
                <h3 className={styles.deleteCarTitle}>Удаление карты</h3>
                <p className={styles.deleteCarText}>
                  Вы действительно хотите удалить карту {deleteCard.name} {maskNumber(deleteCard.number)}?
                </p>
              </div>
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmBack} onClick={() => setDeleteCard(null)}>Назад</button>
              <button className={styles.confirmDelete} onClick={handleDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardInput({ label, value, onChange }) {
  return (
    <div className={`${styles.garageField} ${value ? styles.garageFieldFilled : ''}`}>
      <label className={styles.garageLabel}>{label}</label>
      <input className={styles.garageInput} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function GarageInput({ label, value, onChange }) {
  const filled = value.length > 0;
  return (
    <div className={`${styles.garageField} ${filled ? styles.garageFieldFilled : ''}`}>
      <label className={styles.garageLabel}>{label}</label>
      <input
        className={styles.garageInput}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function BookingCard({ booking, onClick }) {
  const { status, label, service, price, date, wash, address } = booking;
  const { bg, color } = STATUS_COLOR[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <div className={styles.bookingCard} onClick={onClick}>
      <img src={carImg} alt="car" className={styles.bookingCarImg} />
      <div className={styles.bookingInfo}>
        <p className={styles.bookingLabel}>{label}</p>
        <p className={styles.bookingService}>{service}</p>
        <p className={styles.bookingPrice}>{price}</p>
        <p className={styles.bookingDate}>{date}</p>
        <p className={styles.bookingWash}>{wash}</p>
        <p className={styles.bookingAddress}>
          <img src={mestoIco} alt="" className={styles.mestoIcon} />
          {address}
        </p>
      </div>
      <div className={styles.bookingRight}>
        <span className={styles.statusBadge} style={{ background: bg, color }}>{status}</span>
      </div>
    </div>
  );
}
