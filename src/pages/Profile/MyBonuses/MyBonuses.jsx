import { useState } from 'react';
import styles from './MyBonuses.module.css';
import { MOCK_PUNCH_CARDS, BONUS_LEVELS, HISTORY_DATES } from '../../../constants/mockBonuses';
import { useAuth } from '../../../context/AuthContext';
import { useBonuses } from '../../../hooks/useBonuses';
import bonusIco    from '../../../assets/icons/bonus.svg';
import bonusActive from '../../../assets/icons/bonusactive.svg';
import blueCalendar    from '../../../assets/icons/blueCalendar.svg';
import blueInformation from '../../../assets/icons/blueInformation.svg';
import logoNakopleno   from '../../../assets/icons/logoNakopleno.svg';
import logoIspolzovano from '../../../assets/icons/logoIspolzovano.svg';
import icoRect     from '../../../assets/icons/rectangle.png';
import icoBlueRect from '../../../assets/icons/blueRectangle.png';
import icoGalRect  from '../../../assets/icons/galochkaRectangle.png';

const PUNCH_TOTAL = 5;
const DATE_PERIODS = ['Вчера', 'За неделю', 'За месяц', 'За пол года', 'За период'];

const PERIOD_LABEL = {
  'Вчера':       'Вчера',
  'За неделю':   '13 июня - 20 июня',
  'За месяц':    '20 мая - 20 июня',
  'За пол года': 'Янв 2024 - Июн 2024',
  'За период':   '1 июня - 17 июня',
};

export function MobileBonuses() {
  const { token, user }                     = useAuth();
  const { bonuses, history, loading, histLoading, hasMore, loadMore } = useBonuses(token, user?.id);

  const [showDateSheet, setShowDateSheet]   = useState(false);
  const [showLevels, setShowLevels]         = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('За неделю');

  const nakopleno   = history.filter(t => t.bonusCount > 0).reduce((s, t) => s + t.bonusCount, 0);
  const ispolzovano = history.filter(t => t.bonusCount < 0).reduce((s, t) => s + Math.abs(t.bonusCount), 0);

  const grouped = history.reduce((acc, tx) => {
    if (!acc[tx.dayLabel]) acc[tx.dayLabel] = [];
    acc[tx.dayLabel].push(tx);
    return acc;
  }, {});

  const fmt = (n) => Math.abs(n).toLocaleString('ru-RU');

  return (
    <div className={styles.section}>
      <div className={styles.bonusBalanceCard}>
        <p className={styles.bonusBalanceLabel}>Текущий баланс</p>
        <p className={styles.bonusBalanceAmount}>
          {loading ? '...' : `${bonuses?.bonusCount ?? 0} бонусов`}
        </p>
        <p className={styles.bonusBalanceSub}>
          {bonuses ? `Получите кэшбек ${bonuses.loyaltyValue}% на следующую запись` : ''}
        </p>
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

      {histLoading && history.length === 0 ? (
        <p className={styles.bonusTxDate}>Загрузка...</p>
      ) : (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date} className={styles.bonusTxGroup}>
            <p className={styles.bonusTxDate}>{date}</p>
            <div className={styles.bonusTxCard}>
              {txs.map((tx, i) => (
                <div key={tx.id} className={`${styles.bonusTxRow} ${i < txs.length - 1 ? styles.bonusTxRowBorder : ''}`}>
                  <div>
                    <p className={styles.bonusTxName}>{tx.label}</p>
                    <p className={styles.bonusTxSub}>
                      {tx.orderPrice != null
                        ? `Сумма заказа: ${Number(tx.orderPrice).toLocaleString('ru')} ₸`
                        : 'Подарочные бонусы'}
                    </p>
                  </div>
                  <span className={tx.bonusCount > 0 ? styles.bonusTxPos : styles.bonusTxNeg}>
                    {tx.bonusCount > 0 ? '+' : ''}{tx.bonusCount.toLocaleString('ru-RU')} Б
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {hasMore && (
        <button className={styles.bonusLoadMore} onClick={loadMore} disabled={histLoading}>
          {histLoading ? 'Загрузка...' : 'Загрузить ещё'}
        </button>
      )}

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

export default function MyBonuses() {
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
