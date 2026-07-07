import { useState } from 'react';
import { Controller } from 'react-hook-form';
import styles from './MyGarage.module.css';
import { Button, Input, Select, Pagination, Toast, Spinner, EmptyState, ConfirmDialog } from '../../../components/ui';
import { useGarage } from '../useGarage';
import { useCarForm } from '../useCarForm';
import { useCarSelects } from '../useCarSelects';
import errorGarage from '../../../assets/icons/errorGarage.svg';
import deletelogo  from '../../../assets/icons/deleteLogo.svg';

const BODY_TYPES = ['Хэтчбек', 'Седан', 'Кроссовер'];

export default function MyGarage() {
  const {
    cars, loading: loadingCars, fetchError, saving, paged, totalPages,
    page, setPage,
    toast, toastMsg,
    openMenu, setOpenMenu,
    modal, closeModal,
    openAdd, openEdit, openDelete, openMobile,
    handleAdd, handleEdit, confirmDelete,
  } = useGarage();

  const [addBody,  setAddBody]  = useState('Седан');
  const [editBody, setEditBody] = useState('');

  const addForm  = useCarForm();
  const editForm = useCarForm();

  const addSelects  = useCarSelects();
  const editSelects = useCarSelects();

  const [addError,  setAddError]  = useState('');
  const [editError, setEditError] = useState('');

  const onOpenAdd = () => {
    addForm.reset({ plate: '' });
    setAddBody('Седан');
    addSelects.reset();
    setAddError('');
    openAdd();
  };

  const onOpenEdit = (car) => {
    editForm.reset({ plate: car.plate });
    setEditBody(car.body);
    setEditError('');
    editSelects.reset();
    editSelects.init(car.model, car.make);
    openEdit(car);
  };

  const onSubmitAdd = (formData) => {
    if (!addSelects.brandId || !addSelects.seriesId) {
      setAddError('Выберите марку и модель');
      return;
    }
    setAddError('');
    handleAdd({
      model:    addSelects.brandName,
      make:     addSelects.seriesName,
      brandId:  addSelects.brandId,
      seriesId: addSelects.seriesId,
      plate:    formData.plate,
      body:     addBody,
    });
  };

  const onSubmitEdit = (formData) => {
    if (!editSelects.brandId || !editSelects.seriesId) {
      setEditError('Выберите марку и модель');
      return;
    }
    setEditError('');
    handleEdit({
      model:    editSelects.brandName,
      make:     editSelects.seriesName,
      brandId:  editSelects.brandId,
      seriesId: editSelects.seriesId,
      plate:    formData.plate,
      body:     editBody,
    });
  };

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
        <EmptyState text="Добавленных авто еще нет" />
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
                  onClick={() => { if (openMenu === car.id) { setOpenMenu(null); return; } openMobile(car); }}
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
                          <button className={styles.carMenuItemDelete} onClick={() => openDelete(car)}>Удалить</button>
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

      {modal.type === 'add' && (
        <div className={styles.confirmOverlay} onClick={closeModal}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <button className={styles.addCarModalClose} onClick={closeModal}>✕</button>
              <h3 className={styles.addCarModalTitle}>Добавление авто</h3>
            </div>
            <p className={styles.addCarLabel}>Тип кузова</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button key={t} className={`${styles.bodyChip} ${addBody === t ? styles.bodyChipActive : ''}`} onClick={() => setAddBody(t)}>{t}</button>
              ))}
            </div>
            <Select
              label="Марка"
              value={addSelects.brandId}
              options={addSelects.brands}
              onChange={addSelects.onBrandChange}
            />
            <Select
              label="Модель"
              value={addSelects.seriesId}
              options={addSelects.series}
              loading={addSelects.loadingSeries}
              disabled={!addSelects.brandId}
              onChange={addSelects.onSeriesChange}
            />
            {addError && <p className={styles.fieldError}>{addError}</p>}
            <Controller name="plate" control={addForm.control} render={({ field }) => (
              <Input label="Гос номер" {...field} error={addForm.formState.errors.plate?.message} />
            )} />
            <Button fullWidth loading={saving} disabled={saving} onClick={addForm.handleSubmit(onSubmitAdd)}>Добавить</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={modal.type === 'delete'}
        icon={deletelogo}
        title="Удаление авто"
        message={modal.car ? `Вы действительно хотите удалить авто ${[modal.car.model, modal.car.make].filter(Boolean).join(' ')}/${modal.car.plate}?` : ''}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />

      {modal.type === 'mobile' && (
        <div className={styles.mobileSheetOverlay} onClick={closeModal}>
          <div className={styles.mobileActionSheet} onClick={e => e.stopPropagation()}>
            <h3 className={styles.mobileActionTitle}>Действие</h3>
            <button className={styles.mobileActionBtn} onClick={() => onOpenEdit(modal.car)}>Редактировать</button>
            <button className={styles.mobileActionBtn} onClick={() => openDelete(modal.car)}>Удалить</button>
          </div>
        </div>
      )}

      {modal.type === 'edit' && (
        <div className={styles.confirmOverlay} onClick={closeModal}>
          <div className={styles.addCarModal} onClick={e => e.stopPropagation()}>
            <div className={styles.addCarModalHead}>
              <h3 className={styles.addCarModalTitle}>Редактирование авто</h3>
              <button className={styles.addCarModalClose} onClick={closeModal}>✕</button>
            </div>
            <p className={styles.addCarLabel}>Кузов</p>
            <div className={styles.bodyChips}>
              {BODY_TYPES.map(t => (
                <button key={t} className={`${styles.bodyChip} ${editBody === t ? styles.bodyChipActive : ''}`} onClick={() => setEditBody(t)}>{t}</button>
              ))}
            </div>
            <Select
              label="Марка"
              value={editSelects.brandId}
              options={editSelects.brands}
              onChange={editSelects.onBrandChange}
            />
            <Select
              label="Модель"
              value={editSelects.seriesId}
              options={editSelects.series}
              loading={editSelects.loadingSeries}
              disabled={!editSelects.brandId}
              onChange={editSelects.onSeriesChange}
            />
            {editError && <p className={styles.fieldError}>{editError}</p>}
            <Controller name="plate" control={editForm.control} render={({ field }) => (
              <Input label="Гос номер" {...field} error={editForm.formState.errors.plate?.message} />
            )} />
            <Button fullWidth loading={saving} disabled={saving} onClick={editForm.handleSubmit(onSubmitEdit)}>Редактировать</Button>
          </div>
        </div>
      )}
    </div>
  );
}
