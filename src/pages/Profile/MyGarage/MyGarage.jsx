import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getCarsByUser, toCar } from '../../../api/vehicles';
import styles from './MyGarage.module.css';
import garagenet   from '../../../assets/icons/garagenet.png';
import errorGarage from '../../../assets/icons/errorGarage.png';
import deletelogo  from '../../../assets/icons/deletelogo.png';
import galochka    from '../../../assets/icons/galochka.png';

const BODY_TYPES = ['Хэтчбек', 'Седан', 'Кроссовер'];
const GARAGE_PAGE_SIZE = 6;

function GarageInput({ label, value, onChange }) {
  const filled = value.length > 0;
  return (
    <div className={`${styles.garageField} ${filled ? styles.garageFieldFilled : ''}`}>
      <label className={styles.garageLabel}>{label}</label>
      <input
        className={styles.garageInput}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default function MyGarage() {
  const { user, token }               = useAuth();
  const [cars, setCars]               = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [page, setPage]               = useState(1);
  const [showAdd, setShowAdd]         = useState(false);
  const [toast, setToast]             = useState(false);
  const [openMenu, setOpenMenu]       = useState(null);
  const [body,  setBody]              = useState('');
  const [model, setModel]             = useState('');
  const [make,  setMake]              = useState('');
  const [plate, setPlate]             = useState('');
  const [deleteCar, setDeleteCar]     = useState(null);
  const [mobileActionCar, setMobileActionCar] = useState(null);
  const [editCar, setEditCar]         = useState(null);
  const [eBody,  setEBody]            = useState('');
  const [eModel, setEModel]           = useState('');
  const [eMake,  setEMake]            = useState('');
  const [ePlate, setEPlate]           = useState('');
  const [toastMsg, setToastMsg]       = useState('');

  useEffect(() => {
    if (!user?.id || !token) return;
    getCarsByUser(user.id, token)
      .then(res => res.json())
      .then(data => {
        const list = data?.data || data || [];
        setCars(Array.isArray(list) ? list.map(toCar) : []);
      })
      .catch(() => setCars([]))
      .finally(() => setLoadingCars(false));
  }, [user?.id, token]);

  const totalPages = Math.max(1, Math.ceil(cars.length / GARAGE_PAGE_SIZE));
  const paged = cars.slice((page - 1) * GARAGE_PAGE_SIZE, page * GARAGE_PAGE_SIZE);

  const showToast = (msg) => { setToastMsg(msg); setToast(true); setTimeout(() => setToast(false), 3000); };

  const openAdd = () => { setBody('Седан'); setModel(''); setMake(''); setPlate(''); setShowAdd(true); };

  const handleAdd = () => {
    setCars(prev => [{ id: Date.now(), model, make, plate, body }, ...prev]);
    setShowAdd(false);
    setPage(1);
    showToast('Авто добавлено');
  };

  const openEdit = (car) => {
    setEditCar(car);
    setEBody(car.body); setEModel(car.model); setEMake(car.make); setEPlate(car.plate);
    setOpenMenu(null);
  };

  const handleEdit = () => {
    setCars(prev => prev.map(c => c.id === editCar.id
      ? { ...c, body: eBody, model: eModel, make: eMake, plate: ePlate }
      : c
    ));
    setEditCar(null);
    showToast('Авто отредактировано');
  };

  const handleDelete = (car) => { setDeleteCar(car); setOpenMenu(null); };

  const confirmDelete = () => {
    setCars(prev => prev.filter(c => c.id !== deleteCar.id));
    setDeleteCar(null);
    showToast('Машина удалена');
  };

  const canAdd = model.trim() && make.trim() && plate.trim();
  const editIsDirty = editCar && (eBody !== editCar.body || eModel !== editCar.model || eMake !== editCar.make || ePlate !== editCar.plate);
  const canEdit = editIsDirty && eModel.trim() && eMake.trim() && ePlate.trim();

  return (
    <div className={styles.section}>
      {toast && (
        <div className={styles.toast}>
          <img src={galochka} alt="✓" className={styles.toastCheck} />
          {toastMsg}
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мой гараж</h2>
        <button className={styles.addCarBtn} onClick={openAdd}>
          <span className={styles.addCarBtnTextFull}>Добавить авто</span>
          <span className={styles.addCarBtnTextShort}>Добавить</span>
        </button>
      </div>

      {loadingCars ? (
        <div className={styles.emptyGarage}>
          <p className={styles.emptyGarageText}>Загрузка...</p>
        </div>
      ) : cars.length === 0 ? (
        <div className={styles.emptyGarage}>
          <span className={styles.emptyGarageIconWrap}>
            <img src={garagenet} alt="Гараж пуст" className={styles.emptyGarageImg} />
          </span>
          <p className={styles.emptyGarageText}>Добавленных авто еще нет</p>
        </div>
      ) : (
        <>
          <div className={styles.carGrid}>
            {paged.map(car => {
              const hasError = !car.make;
              const title = [car.model, car.make].filter(Boolean).join(' ');
              const sub = `${car.plate}/${car.body.toLowerCase()}`;
              return (
                <div
                  key={car.id}
                  className={`${styles.carCard} ${hasError ? styles.carCardError : ''}`}
                  onClick={() => { if (openMenu === car.id) { setOpenMenu(null); return; } setMobileActionCar(car); }}
                >
                  <div className={styles.carCardTop}>
                    <div>
                      <p className={styles.carName}>{title}</p>
                      <p className={styles.carSub}>{sub}</p>
                    </div>
                    <div className={styles.carMenuWrap}>
                      <button
                        className={styles.carMenuBtn}
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === car.id ? null : car.id); }}
                      >⋮</button>
                      {openMenu === car.id && (
                        <div className={styles.carMenuDropdown}>
                          <button className={styles.carMenuItem} onClick={() => openEdit(car)}>Редактировать</button>
                          <button className={styles.carMenuItemDelete} onClick={() => handleDelete(car)}>Удалить</button>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasError && (
                    <div className={styles.carError}>
                      <img src={errorGarage} alt="!" className={styles.carErrorIco} />
                      <span>Модель машины не выбран</span>
                    </div>
                  )}
                </div>
              );
            })}
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
              <button className={styles.addCarModalClose} onClick={() => setShowAdd(false)}>✕</button>
              <h3 className={styles.addCarModalTitle}>Добавление авто</h3>
            </div>
            <p className={styles.addCarLabel}>Тип кузова</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button key={t} className={`${styles.bodyChip} ${body === t ? styles.bodyChipActive : ''}`} onClick={() => setBody(t)}>{t}</button>
              ))}
            </div>
            <GarageInput label="Марка"     value={make}  onChange={setMake}  />
            <GarageInput label="Модель"    value={model} onChange={setModel} />
            <GarageInput label="Гос номер" value={plate} onChange={setPlate} />
            <button
              className={`${styles.addCarSubmit} ${canAdd ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canAdd}
              onClick={handleAdd}
            >Добавить</button>
          </div>
        </div>
      )}

      {deleteCar && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteCar(null)}>
          <div className={styles.deleteCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteCarTop}>
              <img src={deletelogo} alt="" className={styles.deleteCarIco} />
              <div>
                <h3 className={styles.deleteCarTitle}>Удаление авто</h3>
                <p className={styles.deleteCarText}>
                  Вы действительно хотите удалить авто {[deleteCar.model, deleteCar.make].filter(Boolean).join(' ')}/{deleteCar.plate}?
                </p>
              </div>
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.confirmBack} onClick={() => setDeleteCar(null)}>Отмена</button>
              <button className={styles.confirmDelete} onClick={confirmDelete}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {mobileActionCar && (
        <div className={styles.mobileSheetOverlay} onClick={() => setMobileActionCar(null)}>
          <div className={styles.mobileActionSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Действие</h3>
            <button className={styles.mobileActionBtn} onClick={() => { openEdit(mobileActionCar); setMobileActionCar(null); }}>Редактировать</button>
            <button className={styles.mobileActionBtn} onClick={() => { handleDelete(mobileActionCar); setMobileActionCar(null); }}>Удалить</button>
          </div>
        </div>
      )}

      {editCar && (
        <div className={styles.confirmOverlay} onClick={() => setEditCar(null)}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <h3 className={styles.addCarModalTitle}>Редактирование авто</h3>
              <button className={styles.addCarModalClose} onClick={() => setEditCar(null)}>✕</button>
            </div>
            <p className={styles.addCarLabel}>Кузов</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button key={t} className={`${styles.bodyChip} ${eBody === t ? styles.bodyChipActive : ''}`} onClick={() => setEBody(t)}>{t}</button>
              ))}
            </div>
            <GarageInput label="Модель"    value={eModel} onChange={setEModel} />
            <GarageInput label="Марка"     value={eMake}  onChange={setEMake}  />
            <GarageInput label="Гос номер" value={ePlate} onChange={setEPlate} />
            <button
              className={`${styles.addCarSubmit} ${canEdit ? styles.addCarSubmitActive : styles.addCarSubmitDisabled}`}
              disabled={!canEdit}
              onClick={handleEdit}
            >Редактировать</button>
          </div>
        </div>
      )}
    </div>
  );
}
