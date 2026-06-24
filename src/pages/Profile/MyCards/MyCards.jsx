import React, { useState } from 'react';
import styles from './MyCards.module.css';
import moicards      from '../../../assets/icons/moicards.png';
import visaIco       from '../../../assets/icons/visa.svg';
import mastercardIco from '../../../assets/icons/mastercard.svg';
import deletelogo    from '../../../assets/icons/deletelogo.png';
import galochka      from '../../../assets/icons/galochka.png';
import calendarIco   from '../../../assets/icons/iconCalendar.png';

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

function cardTypeIco(number) { return number.startsWith('5') ? mastercardIco : visaIco; }
function maskNumber(number)  { return '**** **** **** ' + number.slice(-4); }

function CardInput({ label, value, onChange }) {
  return (
    <div className={`${styles.garageField} ${value ? styles.garageFieldFilled : ''}`}>
      <label className={styles.garageLabel}>{label}</label>
      <input className={styles.garageInput} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function MyCards() {
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
                        <button className={styles.carMenuItem} onClick={() => openEdit(card)}>Редактировать</button>
                        <button className={styles.carMenuItemDelete} onClick={() => { setDeleteCard(card); setOpenMenu(null); }}>Удалить</button>
                        {!card.primary && (
                          <button className={styles.carMenuItem} onClick={() => makePrimary(card)}>Сделать основной</button>
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
