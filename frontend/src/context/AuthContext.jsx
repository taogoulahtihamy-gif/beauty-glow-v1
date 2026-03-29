import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('beauty_glow_user');
    return raw ? JSON.parse(raw) : null;
  });

  const persistAuth = (token, userData) => {
    localStorage.setItem('beauty_glow_token', token);
    localStorage.setItem('beauty_glow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (payload) => {
    const data = await api.login(payload);
    persistAuth(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    persistAuth(data.token, data.user);
    return data.user;
  };

  const refreshUser = async () => {
    const data = await api.getMe();
    localStorage.setItem('beauty_glow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const data = await api.updateMe(payload);
    localStorage.setItem('beauty_glow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('beauty_glow_token');
    localStorage.removeItem('beauty_glow_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      refreshUser,
      updateProfile,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}