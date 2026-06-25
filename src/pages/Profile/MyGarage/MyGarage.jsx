import styles from './MyGarage.module.css';
import { Button, Input } from '../../../components/ui';
import { useGarage } from '../../../hooks/useGarage';
import garagenet   from '../../../assets/icons/garagenet.png';
import errorGarage from '../../../assets/icons/errorGarage.png';
import deletelogo  from '../../../assets/icons/deletelogo.png';
import galochka    from '../../../assets/icons/galochka.png';

const BODY_TYPES = ['Хэтчбек', 'Седан', 'Кроссовер'];

export default function MyGarage() {
  const {
    cars, loading: loadingCars, paged, totalPages,
    page, setPage,
    toast, toastMsg,
    openMenu, setOpenMenu,
    showAdd, setShowAdd,
    body, setBody,
    model, setModel,
    make, setMake,
    plate, setPlate,
    canAdd, openAdd, handleAdd,
    deleteCar, setDeleteCar,
    handleDelete, confirmDelete,
    editCar, setEditCar,
    eBody, setEBody,
    eModel, setEModel,
    eMake, setEMake,
    ePlate, setEPlate,
    canEdit, openEdit, handleEdit,
    mobileActionCar, setMobileActionCar,
  } = useGarage();

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
        <Button className={styles.addCarBtn} onClick={openAdd}>
          <span className={styles.addCarBtnTextFull}>Добавить авто</span>
          <span className={styles.addCarBtnTextShort}>Добавить</span>
        </Button>
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
            <Input label="Марка"     value={make}  onChange={e => setMake(e.target.value)}  />
            <Input label="Модель"    value={model} onChange={e => setModel(e.target.value)} />
            <Input label="Гос номер" value={plate} onChange={e => setPlate(e.target.value)} />
            <Button fullWidth disabled={!canAdd} onClick={handleAdd}>Добавить</Button>
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
              <Button variant="secondary" className={styles.confirmBtn} onClick={() => setDeleteCar(null)}>Отмена</Button>
              <Button className={styles.confirmBtn} onClick={confirmDelete}>Удалить</Button>
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
            <Input label="Модель"    value={eModel} onChange={e => setEModel(e.target.value)} />
            <Input label="Марка"     value={eMake}  onChange={e => setEMake(e.target.value)}  />
            <Input label="Гос номер" value={ePlate} onChange={e => setEPlate(e.target.value)} />
            <Button fullWidth disabled={!canEdit} onClick={handleEdit}>Редактировать</Button>
          </div>
        </div>
      )}
    </div>
  );
}
