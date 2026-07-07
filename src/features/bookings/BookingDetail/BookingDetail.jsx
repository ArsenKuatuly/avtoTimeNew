import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BookingDetail.module.css';
import { Button } from '../../../components/ui';
import { STATUS_COLOR } from '../../../utils/statusColors';
import { useBookingDetail } from '../useBookingDetail';
import { ROUTES } from '../../../config/routes.config';
import carImg   from '../../../assets/icons/car.svg';
import toright  from '../../../assets/icons/toRight.svg';
import galochka from '../../../assets/icons/galochka.svg';
import strechImg        from '../../../assets/icons/strech.svg';
import yellowStar       from '../../../assets/icons/yellowStar.svg';
import transparentStar  from '../../../assets/icons/transparentStar.svg';
import icoRect          from '../../../assets/icons/rectangle.svg';
import icoBlueRect      from '../../../assets/icons/blueRectangle.svg';
import icoGalochkaRect  from '../../../assets/icons/galochkaRectangle.svg';

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

  const {
    loading, error,
    booking,
    cancelled, reviewed, toast,
    handleCancel, handleReview,
  } = useBookingDetail(id);

  const [showCancel,  setShowCancel]  = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [reason,      setReason]      = useState('');
  const [comment,     setComment]     = useState('');

  const [showReview,     setShowReview]     = useState(false);
  const [rating,         setRating]         = useState(0);
  const [hoverRating,    setHoverRating]    = useState(0);
  const [reviewComment,  setReviewComment]  = useState('');

  if (loading) {
    return <div className={styles.notFound}><p>Загрузка...</p></div>;
  }

  if (error || !booking) {
    return (
      <div className={styles.notFound}>
        <p>{error || 'Запись не найдена'}</p>
        <button onClick={() => navigate(ROUTES.profile)}>← Назад</button>
      </div>
    );
  }

  const currentStatus = cancelled ? 'Отменён' : booking.status;
  const { bg, color } = STATUS_COLOR[currentStatus] || { bg: '#F3F4F6', color: '#6B7280' };
  const canCancel  = (booking.status === 'Новый' || booking.status === 'В процессе') && !cancelled;
  const canReview  = currentStatus === 'Завершён';
  const timeline   = !cancelled ? booking.timeline : null;

  const openCancel  = () => { setReason(''); setComment(''); setShowReasons(false); setShowCancel(true); };
  const openReview  = () => { setRating(0); setHoverRating(0); setReviewComment(''); setShowReview(true); };

  const handleCancelConfirm = () => {
    setShowCancel(false);
    handleCancel(reason);
  };

  const handleReviewSubmit = () => {
    setShowReview(false);
    handleReview(rating, reviewComment);
  };

  const RATING_LABELS = ['', 'Ужасно!', 'Плохо', 'Есть замечания', 'Хорошо', 'Превосходно!'];
  const activeRating = hoverRating || rating;

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
          <button className={styles.backBtn} onClick={() => navigate(ROUTES.profile)}>
            <span className={styles.backArrow}>‹</span> Назад
          </button>
        </div>

        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Детали записи</h1>
          <div className={styles.titleBtns}>
            {canReview && (
              <Button
                disabled={reviewed}
                className={`${styles.reviewTopBtn} ${reviewed ? styles.reviewTopBtnDone : ''}`}
                onClick={openReview}
              >
                Оставить отзыв
              </Button>
            )}
            {canCancel && (
              <Button className={styles.cancelTopBtn} onClick={openCancel}>
                Отменить запись
              </Button>
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

          {timeline && (
            <div className={styles.queueBlock}>
              {(currentStatus === 'Новый' || currentStatus === 'В процессе') && booking.queueNum !== null && (
                <div className={styles.queueCountRow}>
                  <div className={styles.queueCountCard}>
                    <span className={styles.queueCountLabel}>Номер в очереди</span>
                    <span className={styles.queueCountVal}>{booking.queueNum}</span>
                  </div>
                  {booking.carsBefore !== null && (
                    <div className={styles.queueCountCard}>
                      <span className={styles.queueCountLabel}>Перед вами</span>
                      <span className={styles.queueCountVal} style={{ color: '#006FFD' }}>
                        {booking.carsBefore} {booking.carsBefore === 1 ? 'машина' : 'машины'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.queueTimeline}>
                <p className={styles.queueTimelineTitle}>Статус вашей очереди</p>
                {timeline.map((step, i, arr) => {
                  const ico = step.state === 'done'   ? icoGalochkaRect
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

            <Button fullWidth disabled={rating === 0} onClick={handleReviewSubmit}>
              Оставить отзыв
            </Button>
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
                <Button variant="ghost" className={styles.backModalBtn} onClick={() => setShowCancel(false)}>
                  Назад
                </Button>
                <Button className={styles.confirmCancelBtn} disabled={!reason} onClick={handleCancelConfirm}>
                  Отменить запись
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
