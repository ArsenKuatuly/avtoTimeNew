import { Controller } from 'react-hook-form';
import styles from '../BookOrder.module.css';
import { Button, Input, Modal, Select } from '../../../components/ui';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatPhoneValue } from '../../../hooks/usePhoneFormat';
import logoCalendar from '../../../assets/icons/logoCalendar.svg';

export default function BookingFormStep({
  control, errors, carId, setCarId, carOptions, cars, carsLoading,
  datetimeDisplay, onOpenDatePicker, promo, setPromo,
  carLabel, serviceLabel, dateLabel, total, watchedName, company,
  formFilled, showConfirm, setShowConfirm, submitting, submitError,
  onConfirmBooking, onBack,
}) {
  return (
    <div className={styles.formPage}>
      <button className={styles.backBtn} onClick={onBack}>‹ назад</button>

      <div className={styles.formLayout}>
        <div className={styles.formLeft}>
          <h1 className={styles.formTitle}>Оформление записи</h1>

          <div className={styles.field}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input label="Имя" {...field} error={errors.name?.message} />
              )}
            />
          </div>

          <div className={styles.field}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  label="Номер телефона"
                  {...field}
                  onChange={e => onChange(formatPhoneValue(e.target.value))}
                  type="tel"
                  maxLength={16}
                  error={errors.phone?.message}
                />
              )}
            />
          </div>

          <div className={styles.field}>
            <Select
              label="Автомобиль"
              value={carId}
              onChange={setCarId}
              options={carOptions}
              loading={carsLoading}
              placeholder={cars.length === 0 && !carsLoading ? 'Нет добавленных авто' : '— Выберите авто —'}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.dateWrap} onClick={onOpenDatePicker}>
              <input className={styles.fieldInput} value={datetimeDisplay} readOnly
                placeholder="Дата и время" />
              <label className={styles.fieldLabel}>Дата и время</label>
              <img src={logoCalendar} alt="" className={styles.calIco} />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.paymentField}>
              <span className={styles.paymentLabel}>Способ оплаты</span>
              <span className={styles.paymentVal}>Картой онлайн</span>
            </div>
            <span className={styles.paymentArrow}>›</span>
          </div>

          <div className={styles.promoRow}>
            <div className={styles.promoField}>
              <input className={styles.fieldInput} value={promo}
                onChange={e => setPromo(e.target.value)} placeholder="Промокод" />
              <label className={styles.fieldLabel}>Промокод</label>
            </div>
            <Button disabled={!promo} className={styles.promoApply}>Применить</Button>
          </div>
        </div>

        <div className={styles.formRight}>
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Итого</h3>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Авто</span>
              <span className={styles.summaryVal}>{carLabel}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>Услуга</span>
              <span className={styles.summaryVal}>{serviceLabel}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>К оплате</span>
              <span className={styles.summaryPrice}>{formatCurrency(total)}</span>
            </div>
          </div>
          <div className={styles.formBtnWrap}>
            <Button fullWidth className={styles.actionBtn} disabled={!formFilled} onClick={() => setShowConfirm(true)}>
              Продолжить
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Подтверждение записи" width="420px">
        <p className={styles.modalSection}>Детали</p>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Имя</span>
          <span className={styles.modalVal}>{watchedName}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Автомойка</span>
          <span className={styles.modalVal}>{company?.name || 'Crystal'}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Дата и время</span>
          <span className={styles.modalVal}>{dateLabel}</span>
        </div>
        <div className={styles.modalRow}>
          <span className={styles.modalKey}>Способ оплаты</span>
          <span className={styles.modalVal}>Картой онлайн</span>
        </div>
        <div className={styles.modalSummary}>
          <p className={styles.modalSummaryTitle}>Итого</p>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>Мое авто</span>
            <span className={styles.modalVal}>{carLabel}</span>
          </div>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>Услуга</span>
            <span className={styles.modalVal}>{serviceLabel}</span>
          </div>
          <div className={styles.modalRow}>
            <span className={styles.modalKey}>К оплате</span>
            <span className={styles.summaryPrice}>{formatCurrency(total)}</span>
          </div>
        </div>
        {submitError && <p className={styles.modalRow}>{submitError}</p>}
        <Button fullWidth size="lg" disabled={submitting} onClick={onConfirmBooking}>
          {submitting ? 'Оформляем...' : 'Перейти к оплате'}
        </Button>
      </Modal>
    </div>
  );
}
