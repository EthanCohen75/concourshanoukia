import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { storage } from '../services/storage';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [hanoukiot, setHanoukiot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempVotes, setTempVotes] = useState({});
  const [submittedVotes, setSubmittedVotes] = useState({}); // Votes déjà soumis au backend

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

  // Charger les votes existants au démarrage
  useEffect(() => {
    const loadExistingVotes = async () => {
      try {
        // Récupérer le voterId depuis localStorage
        const voterId = storage.getVoterId();

        if (voterId) {
          // Charger les votes depuis le backend
          const existingVotes = await api.getUserVotes(voterId);

          if (existingVotes && existingVotes.length > 0) {
            // Convertir le tableau en objet { hanoukiaId: rating }
            const votesMap = {};
            existingVotes.forEach(vote => {
              votesMap[vote.hanoukiaId] = vote.rating;
            });

            // Sauvegarder dans localStorage et state
            Object.entries(votesMap).forEach(([hanoukiaId, rating]) => {
              storage.saveTempVote(hanoukiaId, rating);
            });
            setTempVotes(votesMap);
            setSubmittedVotes(votesMap); // Stocker les votes soumis pour comparaison
          } else {
            // Sinon charger depuis localStorage
            setTempVotes(storage.getTempVotes());
          }
        } else {
          // Pas de voterId, charger depuis localStorage
          setTempVotes(storage.getTempVotes());
        }
      } catch (error) {
        console.error('Error loading existing votes:', error);
        // En cas d'erreur, fallback sur localStorage
        setTempVotes(storage.getTempVotes());
      }
    };

    loadExistingVotes();
  }, []);

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

      // Mise à jour optimiste du state local (sans recharger depuis le serveur)
      setHanoukiot(prevHanoukiot =>
        prevHanoukiot.map(h => {
          if (h.id !== hanoukiaId) return h;

          // Vérifier si le vote existe déjà
          const existingVoteIndex = h.votes.findIndex(v => v.voterId === voterId);
          const updatedVotes = [...h.votes];

          if (existingVoteIndex >= 0) {
            // Mettre à jour le vote existant
            updatedVotes[existingVoteIndex] = {
              ...updatedVotes[existingVoteIndex],
              rating,
              timestamp: new Date().toISOString()
            };
          } else {
            // Ajouter un nouveau vote
            updatedVotes.push({
              id: `temp-${Date.now()}`, // ID temporaire
              hanoukiaId,
              voterId,
              rating,
              timestamp: new Date().toISOString()
            });
          }

          return { ...h, votes: updatedVotes };
        })
      );
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

      // Mise à jour optimiste du state local (sans recharger depuis le serveur)
      setHanoukiot(prevHanoukiot =>
        prevHanoukiot.map(h => {
          if (h.id !== hanoukiaId) return h;

          // Retirer le vote de cette hanoukia
          const updatedVotes = h.votes.filter(v => v.voterId !== voterId);
          return { ...h, votes: updatedVotes };
        })
      );
    } catch (error) {
      console.error('Error deleting vote:', error);
      throw error;
    }
  }, []);

  const saveTempVote = useCallback((hanoukiaId, rating) => {
    storage.saveTempVote(hanoukiaId, rating);
    setTempVotes(storage.getTempVotes());
  }, []);

  const removeTempVote = useCallback((hanoukiaId) => {
    storage.removeTempVote(hanoukiaId);
    setTempVotes(storage.getTempVotes());
  }, []);

  const clearTempVotes = useCallback(() => {
    storage.clearTempVotes();
    setTempVotes({});
  }, []);

  const submitAllVotes = useCallback(async (voterId, votes) => {
    try {
      await api.submitAllVotes(voterId, votes);
      await loadHanoukiot(); // Recharger les données

      // Créer votesMap à partir des votes soumis
      const votesMap = {};
      votes.forEach(vote => {
        votesMap[vote.hanoukiaId] = vote.rating;
      });

      // Essayer de recharger depuis le backend pour confirmation
      try {
        const existingVotes = await api.getUserVotes(voterId);
        if (existingVotes && existingVotes.length > 0) {
          // Si le backend retourne les votes, les utiliser
          const backendVotesMap = {};
          existingVotes.forEach(vote => {
            backendVotesMap[vote.hanoukiaId] = vote.rating;
          });
          // Mettre à jour avec les votes du backend
          Object.entries(backendVotesMap).forEach(([hanoukiaId, rating]) => {
            storage.saveTempVote(hanoukiaId, rating);
          });
          setTempVotes(backendVotesMap);
          setSubmittedVotes(backendVotesMap);
        } else {
          // FALLBACK: Utiliser les votes qu'on vient de soumettre
          Object.entries(votesMap).forEach(([hanoukiaId, rating]) => {
            storage.saveTempVote(hanoukiaId, rating);
          });
          setTempVotes(votesMap);
          setSubmittedVotes(votesMap); // ✅ Toujours mis à jour
        }
      } catch (error) {
        // En cas d'erreur lors du rechargement, utiliser les votes soumis
        console.error('Error reloading votes, using submitted votes:', error);
        Object.entries(votesMap).forEach(([hanoukiaId, rating]) => {
          storage.saveTempVote(hanoukiaId, rating);
        });
        setTempVotes(votesMap);
        setSubmittedVotes(votesMap); // ✅ Toujours mis à jour
      }
    } catch (error) {
      console.error('Error submitting all votes:', error);
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
      reorderHanoukiot, submitVote, getUserVote, deleteVote, submitAllVotes, getStatistics, getSortedHanoukiot,
      tempVotes, saveTempVote, removeTempVote, clearTempVotes, submittedVotes
    }}>
      {children}
    </AppContext.Provider>
  );
};
