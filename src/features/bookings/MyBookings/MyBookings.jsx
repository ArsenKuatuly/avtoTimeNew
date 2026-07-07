import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyBookings.module.css';
import MobileBookingDetail from './MobileBookingDetail';
import { STATUS_COLOR } from '../../../utils/statusColors';
import { useBookings } from '../useBookings';
import { Pagination, EmptyState } from '../../../components/ui';
import { bookingDetailPath } from '../../../config/routes.config';
import carImg      from '../../../assets/icons/car.svg';
import zapiseinet  from '../../../assets/icons/zapiseinet.svg';
import mestoIco    from '../../../assets/icons/mesto.png';
import calendarIco from '../../../assets/icons/iconCalendar.svg';
import icoFilter   from '../../../assets/icons/filter.svg';

const STATUS_TABS = ['Все', 'Новый', 'В процессе', 'Завершён', 'Отменён'];

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

export default function MyBookings({ onBackToProfile }) {
  const navigate = useNavigate();
  const {
    loading, error,
    activeFilter,
    filterStatusDraft, setFilterStatusDraft,
    filterPeriodDraft, setFilterPeriodDraft,
    page, setPage,
    paged, totalPages,
    activeFilterCount,
    draftChanged,
    showFilter, setShowFilter,
    selectedBooking, setSelectedBooking,
    handleFilter, openFilter, applyFilter, resetDraft,
  } = useBookings();

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
          >{tab}</button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loadingText}>Загрузка...</p>
      ) : error ? (
        <p className={styles.errorText}>{error}</p>
      ) : paged.length === 0 ? (
        <EmptyState icon={zapiseinet} text="Записей еще нет" />
      ) : (
        <>
          <div className={styles.bookingList}>
            {paged.map(booking => (
              <Fragment key={booking.id}>
                <div className={styles.desktopBookingWrap}>
                  <BookingCard booking={booking} onClick={() => navigate(bookingDetailPath(booking.id))} />
                </div>
                <div className={styles.mobileBookingWrap} onClick={() => setSelectedBooking(booking)}>
                  <MobileBookingCard booking={booking} />
                </div>
              </Fragment>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
