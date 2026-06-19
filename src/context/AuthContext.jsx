import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [phone, setPhone] = useState('');

  const openLogin = () => setModalStep('phone');
  const closeModal = () => setModalStep(null);

  const submitPhone = (p) => {
    setPhone(p);
    setModalStep('sms');
  };

  const submitCode = () => {
    setModalStep('name');
  };

  const submitName = (firstName, lastName) => {
    setUser({ phone, firstName, lastName });
    setModalStep(null);
  };

  const logout = () => setUser(null);
  const backToPhone = () => setModalStep('phone');

  return (
    <AuthContext.Provider value={{
      user, modalStep, phone,
      openLogin, closeModal,
      submitPhone, submitCode, submitName,
      logout, backToPhone,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
