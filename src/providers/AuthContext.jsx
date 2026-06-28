import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

const AuthContext = createContext(null);

const TOKEN_KEY   = 'avtotime_token';
const REFRESH_KEY = 'avtotime_refresh';

const toUser = (data) => {
  const u = data?.data || data;
  return {
    ...u,
    firstName: u.first_name || u.firstName || u.name || '',
    lastName:  u.last_name  || u.lastName  || '',
    phone:     u.phone || '',
  };
};

const extractToken   = (d) => d?.token || d?.access_token || d?.data?.token;
const extractRefresh = (d) => d?.refresh_token || d?.data?.refresh_token;


const toApiPhone = (formatted) => formatted.replace(/\D/g, '').slice(1);

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [phone,     setPhone]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const savedToken   = localStorage.getItem(TOKEN_KEY);
    const savedRefresh = localStorage.getItem(REFRESH_KEY);
    if (!savedToken) return;

    (async () => {
      try {
        await AuthService.verifyToken(savedToken);
        const me = await AuthService.getMe();
        setUser(toUser(me));
        setToken(savedToken);
        return;
      } catch {}

      if (savedRefresh) {
        try {
          const data       = await AuthService.refreshToken(savedRefresh);
          const newToken   = extractToken(data);
          const newRefresh = extractRefresh(data);
          localStorage.setItem(TOKEN_KEY, newToken);
          if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
          const me = await AuthService.getMe();
          setUser(toUser(me));
          setToken(newToken);
          return;
        } catch { }
      }

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    })();
  }, []);

  const openLogin  = () => { setError(''); setModalStep('phone'); };
  const closeModal = () => { setModalStep(null); setError(''); };
  const backToPhone = () => { setError(''); setModalStep('phone'); };

  const submitPhone = async (p) => {
    setLoading(true);
    setError('');
    try {
      await AuthService.sendCode(toApiPhone(p));
      setPhone(p);
      setModalStep('sms');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await AuthService.sendCode(toApiPhone(phone));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (code) => {
    setLoading(true);
    setError('');
    try {
      const data      = await AuthService.checkCode(toApiPhone(phone), code);
      const tk        = extractToken(data);
      const refreshTk = extractRefresh(data);
      localStorage.setItem(TOKEN_KEY, tk);
      if (refreshTk) localStorage.setItem(REFRESH_KEY, refreshTk);
      setToken(tk);

      const me       = await AuthService.getMe();
      const userData = toUser(me);

      if (!userData.firstName && !userData.lastName) {
        setModalStep('name');
      } else {
        setUser(userData);
        setModalStep(null);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitName = async (firstName, lastName) => {
    setLoading(true);
    setError('');
    try {
      const data = await AuthService.updateProfile({ first_name: firstName, last_name: lastName });
      setUser(toUser(data?.user || data?.data || { first_name: firstName, last_name: lastName, phone }));
      setModalStep(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, modalStep, phone, loading, error,
      openLogin, closeModal, backToPhone,
      submitPhone, submitCode, submitName,
      resendCode, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
