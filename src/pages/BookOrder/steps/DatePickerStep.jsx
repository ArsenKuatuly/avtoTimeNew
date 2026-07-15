import styles from '../BookOrder.module.css';
import { Button } from '../../../components/ui';
import { MONTHS_NOM, DAY_SHORT } from '../../../utils/formatDate';

export default function DatePickerStep({ dt, datetimeDisplay, onBack, onDone }) {
  return (
    <div className={styles.formPage}>
      <button className={styles.backBtn} onClick={onBack}>‹ назад</button>
      <h1 className={styles.dpTitle}>Выберите дату</h1>

      <div className={styles.dpMonthNav}>
        <button className={styles.dpNavBtn} onClick={() => dt.setWeekOffset(o => o - 1)} disabled={dt.weekOffset === 0}>‹</button>
        <p className={styles.dpMonth}>{MONTHS_NOM[dt.weekDays[3].getMonth()]} {dt.weekDays[3].getFullYear()}</p>
        <button className={styles.dpNavBtn} onClick={() => dt.setWeekOffset(o => o + 1)}>›</button>
      </div>

      <div className={styles.dpWeekWrap}>
        {dt.weekDays.map((day, i) => {
          const isPast     = day < dt.today;
          const isSelected = dt.isSameDay(day, dt.pickerDate);
          return (
            <button key={i}
              className={`${styles.dpDay} ${isSelected ? styles.dpDayActive : ''} ${isPast ? styles.dpDayPast : ''}`}
              onClick={() => { if (!isPast) { dt.setPickerDate(day); dt.setPickerSlot(null); } }}>
              <span className={styles.dpDayName}>{DAY_SHORT[i]}</span>
              <span className={`${styles.dpDayCircle} ${isSelected ? styles.dpDayCircleActive : ''}`}>
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.dpScrollArea}>
        {dt.slotsLoading ? (
          <p className={styles.dpGroupLabel}>Загрузка...</p>
        ) : dt.timeGroups.length === 0 ? (
          <p className={styles.dpGroupLabel}>Нет доступных слотов</p>
        ) : dt.timeGroups.map((group, gIdx) => (
          <div key={group.label}>
            <p className={styles.dpGroupLabel}>{group.label}</p>
            <div className={styles.dpGrid}>
              {group.slots.map((slot, i) => (
                <button key={i}
                  disabled={!slot.ok}
                  className={`${styles.dpSlot}
                    ${!slot.ok ? styles.dpSlotDis : ''}
                    ${dt.pickerSlot?.g === gIdx && dt.pickerSlot?.i === i ? styles.dpSlotActive : ''}`}
                  onClick={() => dt.setPickerSlot({ g: gIdx, i })}>
                  {slot.t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dpFooter}>
        <Button fullWidth className={styles.actionBtn} disabled={!dt.pickerDate || !dt.pickerTime} onClick={onDone}>
          {dt.pickerDate && dt.pickerTime ? `Выбрать (${datetimeDisplay})` : 'Выбрать'}
        </Button>
      </div>
    </div>
  );
}
