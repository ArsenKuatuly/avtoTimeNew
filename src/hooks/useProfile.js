import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useProfile(user) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [firstName,   setFirstName]   = useState(user?.firstName || '');
  const [saved,       setSaved]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDirty = firstName !== (user?.firstName || '');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    logout();
    navigate('/');
    sessionStorage.setItem('accountDeleted', '1');
  };

  return {
    firstName, setFirstName,
    isDirty,
    saved,
    showConfirm, setShowConfirm,
    handleSave,
    handleDelete,
  };
}
