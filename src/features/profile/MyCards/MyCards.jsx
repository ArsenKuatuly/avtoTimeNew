import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './MyCards.module.css';
import { Input } from '../../../components/ui';
import { MOCK_CARDS_INIT } from '../../../constants/mockCards';
import moicards      from '../../../assets/icons/moicards.png';
import visaIco       from '../../../assets/icons/visa.svg';
import mastercardIco from '../../../assets/icons/mastercard.svg';
import deletelogo    from '../../../assets/icons/deletelogo.png';
import galochka      from '../../../assets/icons/galochka.png';
import calendarIco   from '../../../assets/icons/iconCalendar.png';

const CARDS_PAGE_SIZE = 6;

const cardSchema = yup.object({
  name:   yup.string().trim().required('Введите наименование'),
  number: yup.string().trim().required('Введите номер карты'),
  expiry: yup.string().trim().required('Введите срок действия'),
  cvv:    yup.string().trim().required('Введите CVV'),
  holder: yup.string().trim().required('Введите владельца карты'),
});

function useCardForm(defaultValues = {}) {
  return useForm({
    resolver: yupResolver(cardSchema),
    defaultValues: { name: '', number: '', expiry: '', cvv: '', holder: '', ...defaultValues },
    mode: 'onTouched',
  });
}

function cardTypeIco(number) { return number.startsWith('5') ? mastercardIco : visaIco; }
function maskNumber(number)  { return '**** **** **** ' + number.slice(-4); }

export default function MyCards() {
  const [cards, setCards]           = useState(MOCK_CARDS_INIT);
  const [page, setPage]             = useState(1);
  const [showAdd, setShowAdd]       = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const [toast, setToast]           = useState(false);
  const [openMenu, setOpenMenu]     = useState(null);
  const [deleteCard, setDeleteCard] = useState(null);
  const [editCard, setEditCard]     = useState(null);

  const [addPrimary,  setAddPrimary]  = useState(false);
  const [editPrimary, setEditPrimary] = useState(false);

  const addForm  = useCardForm();
  const editForm = useCardForm();

  const totalPages = Math.max(1, Math.ceil(cards.length / CARDS_PAGE_SIZE));
  const paged = cards.slice((page - 1) * CARDS_PAGE_SIZE, page * CARDS_PAGE_SIZE);

  const showToast = (msg) => { setToastMsg(msg); setToast(true); setTimeout(() => setToast(false), 3000); };

  const openAdd = () => {
    addForm.reset({ name: '', number: '', expiry: '', cvv: '', holder: '' });
    setAddPrimary(false);
    setShowAdd(true);
  };

  const onSubmitAdd = (data) => {
    const newCard = { id: Date.now(), ...data, primary: addPrimary };
    setCards(prev => {
      const updated = addPrimary ? prev.map(c => ({ ...c, primary: false })) : prev;
      return [newCard, ...updated];
    });
    setShowAdd(false);
    setPage(1);
    showToast('Карта добавлена');
  };

  const openEdit = (card) => {
    setEditCard(card);
    editForm.reset({ name: card.name, number: card.number, expiry: card.expiry, cvv: card.cvv, holder: card.holder });
    setEditPrimary(card.primary);
    setOpenMenu(null);
  };

  const onSubmitEdit = (data) => {
    setCards(prev => prev.map(c => {
      if (c.id === editCard.id) return { ...c, ...data, primary: editPrimary };
      if (editPrimary) return { ...c, primary: false };
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
            <Controller
              name="name"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Наименование карты" {...field} error={addForm.formState.errors.name?.message} />
              )}
            />
            <Controller
              name="number"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Номер карты" {...field} error={addForm.formState.errors.number?.message} />
              )}
            />
            <div className={styles.cardRow}>
              <Controller
                name="expiry"
                control={addForm.control}
                render={({ field }) => (
                  <div className={styles.cardExpiryWrap}>
                    <div className={`${styles.garageField} ${field.value ? styles.garageFieldFilled : ''}`}>
                      <label className={styles.garageLabel}>Срок действия</label>
                      <input className={styles.garageInput} {...field} placeholder="" />
                      <img src={calendarIco} alt="" className={styles.cardExpiryIco} />
                    </div>
                    {addForm.formState.errors.expiry && (
                      <p className={styles.fieldError}>{addForm.formState.errors.expiry.message}</p>
                    )}
                  </div>
                )}
              />
              <div className={styles.cardCvvWrap}>
                <Controller
                  name="cvv"
                  control={addForm.control}
                  render={({ field }) => (
                    <Input label="CVV" {...field} error={addForm.formState.errors.cvv?.message} />
                  )}
                />
              </div>
            </div>
            <Controller
              name="holder"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Фамилия и имя" {...field} error={addForm.formState.errors.holder?.message} />
              )}
            />
            <div className={styles.cardToggleRow}>
              <span className={styles.cardToggleLabel}>Сделать основной</span>
              <div className={`${styles.toggle} ${addPrimary ? styles.toggleOn : ''}`} onClick={() => setAddPrimary(p => !p)}>
                <div className={styles.toggleThumb} />
              </div>
            </div>
            <button
              className={`${styles.addCarSubmit} ${styles.addCarSubmitActive}`}
              onClick={addForm.handleSubmit(onSubmitAdd)}
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
            <Controller
              name="name"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Наименование карты" {...field} error={editForm.formState.errors.name?.message} />
              )}
            />
            <Controller
              name="number"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Номер карты" {...field} error={editForm.formState.errors.number?.message} />
              )}
            />
            <div className={styles.cardRow}>
              <Controller
                name="expiry"
                control={editForm.control}
                render={({ field }) => (
                  <div className={styles.cardExpiryWrap}>
                    <div className={`${styles.garageField} ${field.value ? styles.garageFieldFilled : ''}`}>
                      <label className={styles.garageLabel}>Срок действия</label>
                      <input className={styles.garageInput} {...field} placeholder="" />
                      <img src={calendarIco} alt="" className={styles.cardExpiryIco} />
                    </div>
                    {editForm.formState.errors.expiry && (
                      <p className={styles.fieldError}>{editForm.formState.errors.expiry.message}</p>
                    )}
                  </div>
                )}
              />
              <div className={styles.cardCvvWrap}>
                <Controller
                  name="cvv"
                  control={editForm.control}
                  render={({ field }) => (
                    <Input label="CVV" {...field} error={editForm.formState.errors.cvv?.message} />
                  )}
                />
              </div>
            </div>
            <Controller
              name="holder"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Фамилия и имя" {...field} error={editForm.formState.errors.holder?.message} />
              )}
            />
            <div className={styles.cardToggleRow}>
              <span className={styles.cardToggleLabel}>Сделать основной</span>
              <div className={`${styles.toggle} ${editPrimary ? styles.toggleOn : ''}`} onClick={() => setEditPrimary(p => !p)}>
                <div className={styles.toggleThumb} />
              </div>
            </div>
            <button
              className={`${styles.addCarSubmit} ${styles.addCarSubmitActive}`}
              onClick={editForm.handleSubmit(onSubmitEdit)}
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
