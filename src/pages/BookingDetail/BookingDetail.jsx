import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BookingDetail.module.css';
import carImg   from '../../assets/icons/car.svg';
import toright  from '../../assets/icons/toright.png';
import galochka from '../../assets/icons/galochka.png';
import strechImg        from '../../assets/icons/strech.png';
import yellowStar       from '../../assets/icons/yellowStar.png';
import transparentStar  from '../../assets/icons/transparentStar.png';
import icoRect          from '../../assets/icons/rectangle.png';
import icoBlueRect      from '../../assets/icons/blueRectangle.png';
import icoGalochkaRect  from '../../assets/icons/galochkaRectangle.png';

const MOCK_BOOKINGS = {
  '1': { id: '1', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня, 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Новый',      payment: 'Картой онлайн', name: 'Акжол', queueNum: 4, carsBefore: 2 },
  '2': { id: '2', label: 'Онлайн-запись',    service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня, 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'В процессе', payment: 'Наличными',    name: 'Акжол', queueNum: 2, carsBefore: 0 },
  '3': { id: '3', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня, 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Завершён',   payment: 'Картой онлайн', name: 'Акжол', queueNum: null, carsBefore: null },
  '4': { id: '4', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня, 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Отменён',    payment: 'Картой онлайн', name: 'Акжол', queueNum: null, carsBefore: null },
  '5': { id: '5', label: 'Запись в очередь', service: 'Кузов · Салон · Силикон · Воск', price: '5 000 ₸', date: '12 июня, 09:00', wash: 'Auto-wash', address: 'ул. Ж. Молдагалиева', status: 'Отменён',    payment: 'Наличными',    name: 'Акжол', queueNum: null, carsBefore: null },
};

const QUEUE_STEPS_BY_STATUS = {
  'Новый':      [
    { label: 'Встал в очередь',  sub: null,          time: '10:06', state: 'done'    },
    { label: 'Начало мойки',     sub: '(Бокс №2)',   time: '10:12', state: 'active'  },
    { label: 'Завершено',        sub: null,          time: null,    state: 'pending' },
  ],
  'В процессе': [
    { label: 'Встал в очередь',  sub: null,          time: '10:06', state: 'done'   },
    { label: 'Начало мойки',     sub: '(Бокс №2)',   time: '10:12', state: 'done'   },
    { label: 'Завершено',        sub: null,          time: null,    state: 'active' },
  ],
  'Завершён':   [
    { label: 'Встал в очередь',  sub: null,          time: '10:06', state: 'done' },
    { label: 'Начало мойки',     sub: '(Бокс №2)',   time: '10:12', state: 'done' },
    { label: 'Завершено',        sub: null,          time: '11:05', state: 'done' },
  ],
};

const STATUS_COLOR = {
  'Новый':      { bg: '#EBF0FF', color: '#006FFD' },
  'В процессе': { bg: '#FFF3D6', color: '#D97706' },
  'Завершён':   { bg: '#D1FAE5', color: '#059669' },
  'Отменён':    { bg: '#FEE2E2', color: '#DC2626' },
};

const CANCEL_REASONS = [
  'Изменились планы',
  'Нашел другую автомойку',
  'Ошибся со временем',
  'Проблема с автомобилем',
  'Другая причина',
];

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = MOCK_BOOKINGS[id];

  const [showCancel, setShowCancel] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [reason, setReason]         = useState('');
  const [comment, setComment]       = useState('');
  const [cancelled, setCancelled]     = useState(false);
  const [toast, setToast]             = useState(false);

  const [showReview, setShowReview]   = useState(false);
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewed, setReviewed]       = useState(false);

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <p>Запись не найдена</p>
        <button onClick={() => navigate('/profile')}>← Назад</button>
      </div>
    );
  }

  const { status } = booking;
  const currentStatus = cancelled ? 'Отменён' : status;
  const { bg, color } = STATUS_COLOR[currentStatus] || { bg: '#F3F4F6', color: '#6B7280' };
  const canCancel = (status === 'Новый' || status === 'В процессе') && !cancelled;

  const openCancel = () => { setReason(''); setComment(''); setShowReasons(false); setShowCancel(true); };

  const openReview = () => { setRating(0); setHoverRating(0); setReviewComment(''); setShowReview(true); };

  const handleReviewSubmit = () => {
    setShowReview(false);
    setReviewed(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const RATING_LABELS = ['', 'Ужасно!', 'Плохо', 'Есть замечания', 'Хорошо', 'Превосходно!'];
  const activeRating = hoverRating || rating;
  const canReview = currentStatus === 'Завершён';

  const handleCancelConfirm = () => {
    setShowCancel(false);
    setCancelled(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastIcon} />
          {reviewed && !cancelled ? 'Отзыв оставлен' : 'Запись отменена'}
        </div>
      )}

      <div className={styles.inner}>
        <div className={styles.navbar}>
          <button className={styles.backBtn} onClick={() => navigate('/profile')}>
            <span className={styles.backArrow}>‹</span> Назад
          </button>
        </div>

        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Детали записи</h1>
          <div className={styles.titleBtns}>
            {canReview && (
              <button
                className={`${styles.reviewTopBtn} ${reviewed ? styles.reviewTopBtnDone : ''}`}
                onClick={reviewed ? undefined : openReview}
                disabled={reviewed}
              >
                Оставить отзыв
              </button>
            )}
            {canCancel && (
              <button className={styles.cancelTopBtn} onClick={openCancel}>
                Отменить запись
              </button>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <img src={carImg} alt="car" className={styles.carImg} />

          <div className={styles.details}>
            <h2 className={styles.serviceTitle}>{booking.service}</h2>
            <p className={styles.price}>{booking.price}</p>

            <div className={styles.table}>
              <div className={styles.row}>
                <span className={styles.key}>Статус</span>
                <span className={styles.statusBadge} style={{ background: bg, color }}>
                  {currentStatus}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>Имя</span>
                <span className={styles.val}>{booking.name}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>Автомойка</span>
                <span className={styles.val}>{booking.wash}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>Адрес</span>
                <span className={styles.val}>{booking.address}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>Дата и время</span>
                <span className={styles.val}>{booking.date}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>Способ оплаты</span>
                <span className={styles.val}>{booking.payment}</span>
              </div>
            </div>
          </div>

          {QUEUE_STEPS_BY_STATUS[currentStatus] && (
            <div className={styles.queueBlock}>
              {(currentStatus === 'Новый' || currentStatus === 'В процессе') && booking.queueNum !== null && (
                <div className={styles.queueCountRow}>
                  <div className={styles.queueCountCard}>
                    <span className={styles.queueCountLabel}>Номер в очереди</span>
                    <span className={styles.queueCountVal}>{booking.queueNum}</span>
                  </div>
                  <div className={styles.queueCountCard}>
                    <span className={styles.queueCountLabel}>Перед вами</span>
                    <span className={styles.queueCountVal} style={{ color: '#006FFD' }}>
                      {booking.carsBefore} {booking.carsBefore === 1 ? 'машина' : 'машины'}
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.queueTimeline}>
                <p className={styles.queueTimelineTitle}>Статус вашей очереди</p>
                {QUEUE_STEPS_BY_STATUS[currentStatus].map((step, i, arr) => {
                  const ico = step.state === 'done' ? icoGalochkaRect
                            : step.state === 'active' ? icoBlueRect
                            : icoRect;
                  const isLast = i === arr.length - 1;
                  return (
                    <div key={i} className={styles.queueStep}>
                      <div className={styles.queueStepLeft}>
                        <img src={ico} alt="" className={styles.queueStepIco} />
                        {!isLast && (
                          <div className={`${styles.queueLine} ${step.state === 'done' ? styles.queueLineDone : styles.queueLinePending}`} />
                        )}
                      </div>
                      <div className={styles.queueStepRight}>
                        <p className={`${styles.queueStepLabel} ${step.state === 'pending' ? styles.queueStepLabelPending : ''}`}>
                          {step.label}
                          {step.sub && <span className={styles.queueStepSub}> {step.sub}</span>}
                        </p>
                        {step.time && <p className={styles.queueStepTime}>{step.time}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showReview && (
        <div className={styles.overlay} onClick={() => setShowReview(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Оставить отзыв</h3>
            <p className={styles.modalSub}>Оставьте отзыв об автомойке "{booking.wash}"</p>

            <div className={styles.starsRow}>
              {[1,2,3,4,5].map(i => (
                <img
                  key={i}
                  src={i <= activeRating ? yellowStar : transparentStar}
                  alt={`${i} star`}
                  className={styles.starIcon}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>

            <p className={styles.ratingLabel}>{RATING_LABELS[activeRating] || ''}</p>

            <div className={`${styles.textareaWrap} ${reviewComment.length > 0 ? styles.textareaFilled : ''}`}>
              <label className={styles.textareaLabel}>Комментарий</label>
              <textarea
                className={styles.textarea}
                maxLength={100}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
              />
              <img src={strechImg} alt="" className={styles.strechIcon} />
            </div>
            <span className={styles.charCount}>{reviewComment.length} / 100</span>

            <button
              className={`${styles.reviewSubmitBtn} ${rating > 0 ? styles.reviewSubmitBtnActive : styles.reviewSubmitBtnDisabled}`}
              disabled={rating === 0}
              onClick={handleReviewSubmit}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      )}

      {showCancel && (
        <div className={styles.overlay} onClick={() => setShowCancel(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Отмена записи</h3>
            <p className={styles.modalSub}>Укажите причину отмены записи</p>

            <div className={`${styles.reasonField} ${showReasons ? styles.reasonFieldOpen : ''}`} onClick={() => setShowReasons(s => !s)}>
              <span className={reason ? styles.reasonFieldValue : styles.reasonFieldPlaceholder}>
                {reason || 'Причина'}
              </span>
              <img src={toright} alt="" className={`${styles.reasonFieldArrow} ${showReasons ? styles.reasonFieldArrowOpen : ''}`} />
            </div>

            {showReasons && (
              <div className={styles.reasonDropdown}>
                {CANCEL_REASONS.map(r => (
                  <div
                    key={r}
                    className={`${styles.reasonItem} ${reason === r ? styles.reasonItemActive : ''}`}
                    onClick={() => { setReason(r); setShowReasons(false); }}
                  >
                    <span className={styles.reasonText}>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {reason && !showReasons && (
              <>
                <div className={`${styles.textareaWrap} ${comment.length > 0 ? styles.textareaFilled : ''}`}>
                  <label className={styles.textareaLabel}>Комментарий</label>
                  <textarea
                    className={styles.textarea}
                    maxLength={100}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <img src={strechImg} alt="" className={styles.strechIcon} />
                </div>
                <span className={styles.charCount}>{comment.length} / 100</span>
              </>
            )}

            {!showReasons && (
              <div className={styles.modalBtns}>
                <button className={styles.backModalBtn} onClick={() => setShowCancel(false)}>
                  Назад
                </button>
                <button
                  className={`${styles.confirmCancelBtn} ${reason ? styles.confirmCancelBtnActive : styles.confirmCancelBtnDisabled}`}
                  disabled={!reason}
                  onClick={handleCancelConfirm}
                >
                  Отменить запись
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
