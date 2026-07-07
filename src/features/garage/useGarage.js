import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { VehicleService } from '../../services/VehicleService';
import { useToast } from '../../components/ui';

const PAGE_SIZE = 6;

export function useGarage() {
  const { user } = useAuth();

  const [cars,       setCars]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [page,       setPage]       = useState(1);
  const [openMenu,   setOpenMenu]   = useState(null);
  const [modal,      setModal]      = useState({ type: null, car: null });
  const { visible: toast, message: toastMsg, showToast } = useToast();

  useEffect(() => {
    if (!user?.id) return;
    VehicleService.getByUser(user.id)
      .then(setCars)
      .catch(() => {
        setCars([]);
        setFetchError('Не удалось загрузить гараж. Попробуйте позже.');
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalPages = Math.max(1, Math.ceil(cars.length / PAGE_SIZE));
  const paged      = cars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeModal  = ()    => setModal({ type: null, car: null });
  const openAdd     = ()    => setModal({ type: 'add',    car: null });
  const openEdit    = (car) => { setModal({ type: 'edit',   car }); setOpenMenu(null); };
  const openDelete  = (car) => { setModal({ type: 'delete', car }); setOpenMenu(null); };
  const openMobile  = (car) => setModal({ type: 'mobile', car });

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      const created = await VehicleService.create(data, user.id);
      setCars(prev => [created, ...prev]);
      closeModal();
      setPage(1);
      showToast('Авто добавлено');
    } catch {
      showToast('Не удалось добавить авто');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      const updated = await VehicleService.update(modal.car.id, data);
      setCars(prev => prev.map(c => c.id === modal.car.id ? updated : c));
      closeModal();
      showToast('Авто отредактировано');
    } catch {
      showToast('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await VehicleService.delete(modal.car.id);
      setCars(prev => prev.filter(c => c.id !== modal.car.id));
      closeModal();
      showToast('Машина удалена');
    } catch {
      showToast('Не удалось удалить авто');
    } finally {
      setSaving(false);
    }
  };

  return {
    cars, loading, fetchError, saving, paged, totalPages,
    page, setPage,
    toast, toastMsg,
    openMenu, setOpenMenu,
    modal, closeModal,
    openAdd, openEdit, openDelete, openMobile,
    handleAdd, handleEdit, confirmDelete,
  };
}
