import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('beauty_glow_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (payload) => {
    const data = await api.login(payload);
    localStorage.setItem('beauty_glow_token', data.token);
    localStorage.setItem('beauty_glow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    localStorage.setItem('beauty_glow_token', data.token);
    localStorage.setItem('beauty_glow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('beauty_glow_token');
    localStorage.removeItem('beauty_glow_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
