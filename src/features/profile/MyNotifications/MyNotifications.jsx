import { useState } from 'react';
import styles from './MyNotifications.module.css';
import { MOCK_NOTIFS } from '../../../constants/mockNotifications';
import icoNotif from '../../../assets/icons/uvedomleniya.svg';

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

export default function MyNotifications() {
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
