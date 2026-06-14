import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      const authData = { 
        accessToken, 
        email: user.email, 
        role: user.role,
        userId: user.id,
        name: user.name
      };
      setAuth(authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setAuth(null);
      localStorage.removeItem('auth');
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);