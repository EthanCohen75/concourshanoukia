import { API_BASE_URL, defaultHeaders } from './config';

/**
 * API pour la gestion des votes
 */
const votesApi = {
  /**
   * Soumettre un vote
   */
  async submit(hanoukiaId, voterId, rating) {
    try {
      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ hanoukiaId, voterId, rating })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors du vote');
      }

      return await response.json();
    } catch (error) {
      console.error('[votesApi] Error in submit:', error);
      throw error;
    }
  },

  /**
   * Récupérer le vote d'un utilisateur pour une hanoukia
   */
  async getUserVote(hanoukiaId, voterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/${hanoukiaId}/${voterId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du vote');
      }
      const data = await response.json();
      return data.rating;
    } catch (error) {
      console.error('[votesApi] Error in getUserVote:', error);
      return null;
    }
  },

  /**
   * Récupérer tous les votes d'un utilisateur
   */
  async getAllUserVotes(voterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/user/${voterId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des votes');
      }
      return await response.json();
    } catch (error) {
      console.error('[votesApi] Error in getAllUserVotes:', error);
      return [];
    }
  },

  /**
   * Supprimer un vote
   */
  async delete(hanoukiaId, voterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/${hanoukiaId}/${voterId}`, {
        method: 'DELETE',
        headers: defaultHeaders
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression du vote');
      }

      return await response.json();
    } catch (error) {
      console.error('[votesApi] Error in delete:', error);
      throw error;
    }
  }
};

export default votesApi;
