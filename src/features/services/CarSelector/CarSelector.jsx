import { useState, useEffect } from 'react';
import styles from '../../../pages/Services/Services.module.css';
import { VehicleService } from '../../../services/VehicleService';
import blueGalochka from '../../../assets/icons/blueGalochka.svg';

export const BODY_TYPES = [
  { code: 'sedan',     label: 'Седан'     },
  { code: 'hatchback', label: 'Хэтчбек'  },
  { code: 'crossover', label: 'Кроссовер' },
];

export function useCarSelector(user) {
  const [carSheet, setCarSheet]             = useState(false);
  const [carSheetView, setCarSheetView]     = useState('list');
  const [mobileCarSheet, setMobileCarSheet] = useState(false);
  const [localCars, setLocalCars]           = useState([]);
  const [activeCar, setActiveCar]           = useState(null);
  const [newBody, setNewBody]               = useState('sedan');
  const [newBrand, setNewBrand]             = useState('');
  const [newModel, setNewModel]             = useState('');
  const [newPlate, setNewPlate]             = useState('');

  useEffect(() => {
    if (!user?.id) return;
    VehicleService.getByUser(user.id).then(cars => {
      const normalized = cars.map(c => ({
        id:    c.id,
        brand: c.brandName,
        model: c.seriesName,
        plate: c.plate,
        body:  c.body,
      }));
      setLocalCars(normalized);
      if (normalized.length > 0) setActiveCar(normalized[0]);
    }).catch(() => {});
  }, [user?.id]);

  const openCarSheet = () => {
    const isMobile = window.innerWidth <= 1024;
    setMobileCarSheet(isMobile);
    setCarSheetView('list');
    setCarSheet(true);
  };

  const handleAddCar = () => {
    if (!newBrand.trim() || !newModel.trim() || !newPlate.trim()) return;
    const car = { body: newBody, brand: newBrand.trim(), model: newModel.trim(), plate: newPlate.trim() };
    setLocalCars(prev => [...prev, car]);
    setActiveCar(car);
    setNewBrand(''); setNewModel(''); setNewPlate(''); setNewBody('sedan');
    setCarSheetView('list');
  };

  return {
    carSheet, setCarSheet,
    carSheetView, setCarSheetView,
    mobileCarSheet,
    localCars, activeCar, setActiveCar,
    newBody, setNewBody,
    newBrand, setNewBrand,
    newModel, setNewModel,
    newPlate, setNewPlate,
    openCarSheet, handleAddCar,
  };
}

export function CarSelectorField({ selector, user }) {
  const { carSheet, mobileCarSheet, localCars, activeCar, setActiveCar, setCarSheet, openCarSheet } = selector;

  return (
    <div className={styles.carSelectorWrap}>
      <button className={styles.carSelector} onClick={openCarSheet}>
        <div>
          <p className={styles.carSelectorLabel}>Мое авто</p>
          <p className={styles.carSelectorVal}>
            {activeCar
              ? `${activeCar.brand} ${activeCar.model} / ${activeCar.plate}`
              : user?.car ? `${user.car.model}/${user.car.plate}/${user.car.body}` : 'Выберите авто'}
          </p>
        </div>
        <span className={styles.carSelectorArrow}>›</span>
      </button>

      {carSheet && !mobileCarSheet && (
        <>
          <div className={styles.carDropOverlay} onClick={() => setCarSheet(false)} />
          <div className={styles.carDrop}>
            {localCars.length === 0 ? (
              <p style={{ padding: '10px 16px', color: 'var(--color-text-muted)', fontSize: 13 }}>
                Нет добавленных авто
              </p>
            ) : (
              localCars.map((car, i) => (
                <button
                  key={car.id ?? i}
                  className={`${styles.carDropItem} ${activeCar === car ? styles.carDropItemActive : ''}`}
                  onClick={() => { setActiveCar(car); setCarSheet(false); }}
                >
                  <div>
                    <p className={styles.carDropName}>{car.brand} {car.model}</p>
                    <p className={styles.carDropSub}>
                      {BODY_TYPES.find(b => b.code === car.body)?.label || car.body} · {car.plate}
                    </p>
                  </div>
                  {activeCar === car && <img src={blueGalochka} alt="" className={styles.carDropCheck} />}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function CarSelectorSheets({ selector }) {
  const {
    carSheet, setCarSheet, carSheetView, setCarSheetView, mobileCarSheet,
    localCars, activeCar, setActiveCar,
    newBody, setNewBody, newBrand, setNewBrand, newModel, setNewModel, newPlate, setNewPlate,
    handleAddCar,
  } = selector;

  return (
    <>
      {carSheet && mobileCarSheet && (
        <>
          <div className={styles.sheetOverlay} onClick={() => setCarSheet(false)} />
          <div className={styles.sheet}>
            <h2 className={styles.sheetTitle}>Мое авто</h2>
            {localCars.length === 0 ? (
              <p className={styles.sheetEmpty}>Добавленных авто еще нет</p>
            ) : (
              <div className={styles.sheetCarList}>
                {localCars.map((car, i) => (
                  <button
                    key={car.id ?? i}
                    className={`${styles.sheetCarItem} ${activeCar === car ? styles.sheetCarItemActive : ''}`}
                    onClick={() => { setActiveCar(car); setCarSheet(false); }}
                  >
                    <div>
                      <p className={styles.sheetCarName}>{car.brand} {car.model}</p>
                      <p className={styles.sheetCarSub}>
                        {BODY_TYPES.find(b => b.code === car.body)?.label || car.body} · {car.plate}
                      </p>
                    </div>
                    {activeCar === car && <img src={blueGalochka} alt="" className={styles.sheetCarCheck} />}
                  </button>
                ))}
              </div>
            )}
            <button className={styles.sheetBtn} onClick={() => { setCarSheet(false); setCarSheetView('add'); }}>
              Добавить
            </button>
          </div>
        </>
      )}

      {carSheetView === 'add' && (
        <>
          <div className={styles.sheetOverlay} onClick={() => setCarSheetView('list')} />
          <div className={styles.sheet}>
            <div className={styles.sheetHead}>
              <button className={styles.sheetBack} onClick={() => setCarSheetView('list')}>‹</button>
              <h2 className={styles.sheetTitle}>Добавление авто</h2>
            </div>

            <p className={styles.sheetSectionLabel}>Тип кузова</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(b => (
                <button key={b.code}
                  className={`${styles.bodyChip} ${newBody === b.code ? styles.bodyChipActive : ''}`}
                  onClick={() => setNewBody(b.code)}>
                  {b.label}
                </button>
              ))}
            </div>

            <div className={styles.sheetField}>
              {newBrand && <span className={styles.sheetFieldLabel}>Марка</span>}
              <input className={styles.sheetFieldInput} placeholder="Марка"
                value={newBrand} onChange={e => setNewBrand(e.target.value)} />
            </div>
            <div className={styles.sheetField}>
              {newModel && <span className={styles.sheetFieldLabel}>Модель</span>}
              <input className={styles.sheetFieldInput} placeholder="Модель"
                value={newModel} onChange={e => setNewModel(e.target.value)} />
            </div>
            <div className={styles.sheetField}>
              {newPlate && <span className={styles.sheetFieldLabel}>Гос номер</span>}
              <input className={styles.sheetFieldInput} placeholder="Гос номер"
                value={newPlate} onChange={e => setNewPlate(e.target.value)} />
            </div>

            <button className={styles.sheetBtn}
              disabled={!newBrand.trim() || !newModel.trim() || !newPlate.trim()}
              onClick={handleAddCar}>
              Добавить
            </button>
          </div>
        </>
      )}
    </>
  );
}
