import { API_BASE_URL, defaultHeaders } from './config';

/**
 * API pour l'administration
 */
const adminApi = {
  /**
   * Vérifier le code admin
   */
  async verifyCode(code) {
    try {
      console.log('[adminApi] Envoi de la requête de vérification du code admin');
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ code })
      });

      console.log('[adminApi] Statut de la réponse:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error('Erreur de vérification');
      }

      const data = await response.json();
      console.log('[adminApi] Données reçues:', data);
      console.log('[adminApi] Retour de data.valid:', data.valid);

      return data.valid;
    } catch (error) {
      console.error('[adminApi] Erreur lors de la vérification:', error);
      return false;
    }
  },

  /**
   * Vérifier la santé de l'API
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('[adminApi] Error in healthCheck:', error);
      return false;
    }
  }
};

export default adminApi;
