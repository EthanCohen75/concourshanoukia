import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AdminContext = createContext();

const SESSION_KEY = 'admin-session';
const ADMIN_CODE_KEY = 'admin-code';

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState(null);

  // Check if there's an active session on mount
  useEffect(() => {
    const existingSession = sessionStorage.getItem(SESSION_KEY);
    const existingCode = sessionStorage.getItem(ADMIN_CODE_KEY);
    if (existingSession && existingCode) {
      setAdminCode(existingCode);
      setIsAuthenticated(true);
    }
  }, []);

  // Login with admin code
  const login = useCallback(async (inputCode) => {
    try {
      console.log('[AdminContext] Vérification du code:', inputCode);
      const isValid = await api.verifyAdminCode(inputCode);
      console.log('[AdminContext] Réponse API verifyAdminCode:', isValid);

      if (isValid) {
        console.log('[AdminContext] Code valide, sauvegarde de la session');
        sessionStorage.setItem(SESSION_KEY, 'authenticated');
        sessionStorage.setItem(ADMIN_CODE_KEY, inputCode);
        setAdminCode(inputCode);
        setIsAuthenticated(true);
        return { success: true };
      }

      console.log('[AdminContext] Code invalide');
      return { success: false, error: 'Code incorrect' };
    } catch (error) {
      console.error('[AdminContext] Erreur lors de la vérification:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ADMIN_CODE_KEY);
    setAdminCode(null);
    setIsAuthenticated(false);
  }, []);

  // Check if authenticated
  const checkAuth = useCallback(() => {
    const existingSession = sessionStorage.getItem(SESSION_KEY);
    return !!existingSession;
  }, []);

  // Get admin code
  const getAdminCode = useCallback(() => {
    return adminCode || sessionStorage.getItem(ADMIN_CODE_KEY);
  }, [adminCode]);

  const value = {
    isAuthenticated,
    adminCode,
    login,
    logout,
    checkAuth,
    getAdminCode
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
