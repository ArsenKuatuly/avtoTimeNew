import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { VehicleService } from '../../services/VehicleService';

const PAGE_SIZE = 6;

export function useGarage() {
  const { user } = useAuth();

  const [cars,           setCars]           = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState(null);
  const [page,           setPage]           = useState(1);
  const [toast,          setToast]          = useState(false);
  const [toastMsg,       setToastMsg]       = useState('');
  const [openMenu,       setOpenMenu]       = useState(null);
  const [showAdd,        setShowAdd]        = useState(false);
  const [body,           setBody]           = useState('');
  const [model,          setModel]          = useState('');
  const [make,           setMake]           = useState('');
  const [plate,          setPlate]          = useState('');
  const [deleteCar,      setDeleteCar]      = useState(null);
  const [mobileActionCar, setMobileActionCar] = useState(null);
  const [editCar,        setEditCar]        = useState(null);
  const [eBody,          setEBody]          = useState('');
  const [eModel,         setEModel]         = useState('');
  const [eMake,          setEMake]          = useState('');
  const [ePlate,         setEPlate]         = useState('');

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const openAdd = () => {
    setBody('Седан');
    setModel('');
    setMake('');
    setPlate('');
    setShowAdd(true);
  };

  const handleAdd = () => {
    setCars(prev => [{ id: Date.now(), model, make, plate, body }, ...prev]);
    setShowAdd(false);
    setPage(1);
    showToast('Авто добавлено');
  };

  const openEdit = (car) => {
    setEditCar(car);
    setEBody(car.body);
    setEModel(car.model);
    setEMake(car.make);
    setEPlate(car.plate);
    setOpenMenu(null);
  };

  const handleEdit = () => {
    setCars(prev => prev.map(c =>
      c.id === editCar.id
        ? { ...c, body: eBody, model: eModel, make: eMake, plate: ePlate }
        : c
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

  const canAdd      = model.trim() && make.trim() && plate.trim();
  const editIsDirty = editCar && (
    eBody  !== editCar.body  ||
    eModel !== editCar.model ||
    eMake  !== editCar.make  ||
    ePlate !== editCar.plate
  );
  const canEdit = editIsDirty && eModel.trim() && eMake.trim() && ePlate.trim();

  return {
    cars, loading, fetchError, paged, totalPages,
    page, setPage,
    toast, toastMsg,
    openMenu, setOpenMenu,
    showAdd, setShowAdd,
    body, setBody,
    model, setModel,
    make, setMake,
    plate, setPlate,
    canAdd,
    openAdd, handleAdd,
    deleteCar, setDeleteCar,
    handleDelete, confirmDelete,
    editCar, setEditCar,
    eBody, setEBody,
    eModel, setEModel,
    eMake, setEMake,
    ePlate, setEPlate,
    canEdit,
    openEdit, handleEdit,
    mobileActionCar, setMobileActionCar,
  };
}
