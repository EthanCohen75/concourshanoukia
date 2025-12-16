import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [hanoukiot, setHanoukiot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHanoukiot = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAllHanoukiot();
      setHanoukiot(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading hanoukiot:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHanoukiot(); }, [loadHanoukiot]);

  const addHanoukia = useCallback(async (imageFiles, adminCode) => {
    try {
      const newHanoukia = await api.addHanoukia(imageFiles, adminCode);
      await loadHanoukiot();
      return newHanoukia;
    } catch (error) {
      console.error('Error adding hanoukia:', error);
      throw error;
    }
  }, [loadHanoukiot]);

  const deleteHanoukia = useCallback(async (id, adminCode) => {
    try {
      await api.deleteHanoukia(id, adminCode);
      await loadHanoukiot();
    } catch (error) {
      console.error('Error deleting hanoukia:', error);
      throw error;
    }
  }, [loadHanoukiot]);

  const reorderHanoukiot = useCallback(async (reorderedList, adminCode) => {
    try {
      const updated = await api.reorderHanoukiot(reorderedList, adminCode);
      setHanoukiot(updated);
    } catch (error) {
      console.error('Error reordering hanoukiot:', error);
      throw error;
    }
  }, []);

  const submitVote = useCallback(async (hanoukiaId, voterId, rating) => {
    try {
      await api.submitVote(hanoukiaId, voterId, rating);
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  }, []);

  const getUserVote = useCallback(async (hanoukiaId, voterId) => {
    try {
      return await api.getUserVote(hanoukiaId, voterId);
    } catch (error) {
      console.error('Error getting user vote:', error);
      return null;
    }
  }, []);

  const deleteVote = useCallback(async (hanoukiaId, voterId) => {
    try {
      await api.deleteVote(hanoukiaId, voterId);
      await loadHanoukiot();
    } catch (error) {
      console.error('Error deleting vote:', error);
      throw error;
    }
  }, [loadHanoukiot]);

  const getStatistics = useCallback(async () => {
    try {
      return await api.getStatistics();
    } catch (error) {
      console.error('Error getting statistics:', error);
      return [];
    }
  }, []);

  const getSortedHanoukiot = useCallback(() => {
    return [...hanoukiot].sort((a, b) => a.order - b.order);
  }, [hanoukiot]);

  return (
    <AppContext.Provider value={{
      hanoukiot, loading, error, loadHanoukiot, addHanoukia, deleteHanoukia,
      reorderHanoukiot, submitVote, getUserVote, deleteVote, getStatistics, getSortedHanoukiot
    }}>
      {children}
    </AppContext.Provider>
  );
};
