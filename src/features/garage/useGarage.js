import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { VehicleService } from '../../services/VehicleService';
import { useToast } from '../../components/ui';

const PAGE_SIZE = 6;

export function useGarage() {
  const { user } = useAuth();

  const [cars,            setCars]            = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [fetchError,      setFetchError]      = useState(null);
  const [page,            setPage]            = useState(1);
  const [openMenu,        setOpenMenu]        = useState(null);
  const { visible: toast, message: toastMsg, showToast } = useToast();
  const [showAdd,         setShowAdd]         = useState(false);
  const [deleteCar,       setDeleteCar]       = useState(null);
  const [mobileActionCar, setMobileActionCar] = useState(null);
  const [editCar,         setEditCar]         = useState(null);

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

  const openAdd = () => setShowAdd(true);

  const handleAdd = (data) => {
    setCars(prev => [{ id: Date.now(), ...data }, ...prev]);
    setShowAdd(false);
    setPage(1);
    showToast('Авто добавлено');
  };

  const openEdit = (car) => {
    setEditCar(car);
    setOpenMenu(null);
  };

  const handleEdit = (data) => {
    setCars(prev => prev.map(c =>
      c.id === editCar.id ? { ...c, ...data } : c
    ));
    setEditCar(null);
    showToast('Авто отредактировано');
  };

  const handleDelete = (car) => {
    setDeleteCar(car);
    setOpenMenu(null);
  };

  const confirmDelete = () => {
    setCars(prev => prev.filter(c => c.id !== deleteCar.id));
    setDeleteCar(null);
    showToast('Машина удалена');
  };

  return {
    cars, loading, fetchError, paged, totalPages,
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
  };
}
