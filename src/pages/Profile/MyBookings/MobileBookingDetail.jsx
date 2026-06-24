import React, { useState } from 'react';
import styles from './MyBookings.module.css';
import carImg    from '../../../assets/icons/car.svg';
import galochka  from '../../../assets/icons/galochka.png';
import strechImg from '../../../assets/icons/strech.png';
import ico2gis   from '../../../assets/icons/2gis.svg';
import qrcode2   from '../../../assets/icons/qrcode2.png';
import errorAuth from '../../../assets/icons/errorAuth.svg';
import yellowStar      from '../../../assets/icons/yellowStar.svg';
import transparentStar from '../../../assets/icons/transparentStar.png';
import { STATUS_COLOR } from './MyBookings';

const CANCEL_REASONS = [
  'Слишком долго ехать',
  'Изменились планы',
  'Смена предпочтений',
  'Технические проблемы',
  'Погодные условия',
  'Отсутсвие необходимости',
  'Другое',
];

export default function MobileBookingDetail({ booking, onBack }) {
  const [cancelled, setCancelled]             = useState(false);
  const [cancelledReason, setCancelledReason] = useState('');
  const [showCancel, setShowCancel]           = useState(false);
  const [cancelStep, setCancelStep]           = useState(1);
  const [reason, setReason]                   = useState('');
  const [cancelComment, setCancelComment]     = useState('');
  const [reviewed, setReviewed]               = useState(false);
  const [showReview, setShowReview]           = useState(false);
  const [rating, setRating]                   = useState(0);
  const [hoverRating, setHoverRating]         = useState(0);
  const [reviewComment, setReviewComment]     = useState('');
  const [toastMsg, setToastMsg]               = useState('');
  const [toast, setToast]                     = useState(false);

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
            <img src={errorAuth} alt="" className={styles.cancelInfoIcon} />
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
            { key: 'Имя',           val: booking.name    },
            { key: 'Автомойка',     val: booking.wash    },
            { key: 'Дата и время',  val: booking.date    },
            { key: 'Способ оплаты', val: booking.payment },
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
              {CANCEL_REASONS.map(r => (
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
