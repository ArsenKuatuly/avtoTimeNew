import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import styles from './MyGarage.module.css';
import { Button, Input, Pagination, Toast, Spinner, EmptyState, ConfirmDialog } from '../../../components/ui';
import { useGarage } from '../useGarage';
import { useCarForm } from '../useCarForm';
import garagenet   from '../../../assets/icons/garagenet.png';
import errorGarage from '../../../assets/icons/errorGarage.png';
import deletelogo  from '../../../assets/icons/deletelogo.png';

const BODY_TYPES = ['Хэтчбек', 'Седан', 'Кроссовер'];

export default function MyGarage() {
  const {
    cars, loading: loadingCars, fetchError, paged, totalPages,
    page, setPage,
    toast, toastMsg,
    openMenu, setOpenMenu,
    showAdd, setShowAdd,
    openAdd, handleAdd,
    deleteCar, setDeleteCar,
    handleDelete, confirmDelete,
    editCar, setEditCar,
    openEdit, handleEdit,
    mobileActionCar, setMobileActionCar,
  } = useGarage();

  const [addBody,  setAddBody]  = useState('Седан');
  const [editBody, setEditBody] = useState('');

  const addForm  = useCarForm();
  const editForm = useCarForm();

  const onOpenAdd = () => {
    addForm.reset({ make: '', model: '', plate: '' });
    setAddBody('Седан');
    openAdd();
  };

  const onOpenEdit = (car) => {
    editForm.reset({ make: car.make, model: car.model, plate: car.plate });
    setEditBody(car.body);
    openEdit(car);
  };

  const onSubmitAdd = (data) => handleAdd({ ...data, body: addBody });
  const onSubmitEdit = (data) => handleEdit({ ...data, body: editBody });

  return (
    <div className={styles.section}>
      <Toast message={toastMsg} visible={toast} />

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мой гараж</h2>
        <Button className={styles.addCarBtn} onClick={onOpenAdd}>
          <span className={styles.addCarBtnTextFull}>Добавить авто</span>
          <span className={styles.addCarBtnTextShort}>Добавить</span>
        </Button>
      </div>

      {loadingCars ? (
        <Spinner />
      ) : fetchError ? (
        <EmptyState text={fetchError} />
      ) : cars.length === 0 ? (
        <EmptyState icon={garagenet} text="Добавленных авто еще нет" />
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
                          <button className={styles.carMenuItem} onClick={() => onOpenEdit(car)}>Редактировать</button>
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

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
                <button key={t} className={`${styles.bodyChip} ${addBody === t ? styles.bodyChipActive : ''}`} onClick={() => setAddBody(t)}>{t}</button>
              ))}
            </div>
            <Controller
              name="make"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Марка" {...field} error={addForm.formState.errors.make?.message} />
              )}
            />
            <Controller
              name="model"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Модель" {...field} error={addForm.formState.errors.model?.message} />
              )}
            />
            <Controller
              name="plate"
              control={addForm.control}
              render={({ field }) => (
                <Input label="Гос номер" {...field} error={addForm.formState.errors.plate?.message} />
              )}
            />
            <Button fullWidth onClick={addForm.handleSubmit(onSubmitAdd)}>Добавить</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteCar}
        icon={deletelogo}
        title="Удаление авто"
        message={deleteCar ? `Вы действительно хотите удалить авто ${[deleteCar.model, deleteCar.make].filter(Boolean).join(' ')}/${deleteCar.plate}?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCar(null)}
      />

      {mobileActionCar && (
        <div className={styles.mobileSheetOverlay} onClick={() => setMobileActionCar(null)}>
          <div className={styles.mobileActionSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Действие</h3>
            <button className={styles.mobileActionBtn} onClick={() => { onOpenEdit(mobileActionCar); setMobileActionCar(null); }}>Редактировать</button>
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
                <button key={t} className={`${styles.bodyChip} ${editBody === t ? styles.bodyChipActive : ''}`} onClick={() => setEditBody(t)}>{t}</button>
              ))}
            </div>
            <Controller
              name="model"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Модель" {...field} error={editForm.formState.errors.model?.message} />
              )}
            />
            <Controller
              name="make"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Марка" {...field} error={editForm.formState.errors.make?.message} />
              )}
            />
            <Controller
              name="plate"
              control={editForm.control}
              render={({ field }) => (
                <Input label="Гос номер" {...field} error={editForm.formState.errors.plate?.message} />
              )}
            />
            <Button fullWidth onClick={editForm.handleSubmit(onSubmitEdit)}>Редактировать</Button>
          </div>
        </div>
      )}
    </div>
  );
}
