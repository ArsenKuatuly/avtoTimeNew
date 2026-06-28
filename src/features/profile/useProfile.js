import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';
import { AuthService } from '../../services/AuthService';
import { useAsync } from '../../hooks/useAsync';

export function useProfile(user) {
  const { logout } = useAuth();
  const navigate          = useNavigate();
  const { loading: saving, error: saveError, run } = useAsync();

  const [firstName,   setFirstName]   = useState(user?.firstName || '');
  const [saved,       setSaved]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isDirty = firstName !== (user?.firstName || '');

  const handleSave = () =>
    run(() => AuthService.updateProfile({ first_name: firstName }))
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch(() => {});

  const handleDelete = () => {
    logout();
    navigate('/');
    sessionStorage.setItem('accountDeleted', '1');
  };

  return {
    firstName, setFirstName,
    isDirty,
    saving, saveError,
    saved,
    showConfirm, setShowConfirm,
    handleSave,
    handleDelete,
  };
}
