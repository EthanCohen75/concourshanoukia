import { API_BASE_URL, defaultHeaders } from './config';

const hanoukiotApi = {
  // Récupérer toutes les hanoukiot
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/hanoukiot`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des hanoukiot');
      }
      return await response.json();
    } catch (error) {
      console.error('[hanoukiotApi] Error in getAll:', error);
      throw error;
    }
  },

  // Ajouter une nouvelle hanoukia (admin)
  async add(images, adminCode) {
    try {
      const formData = new FormData();
      formData.append('adminCode', adminCode);

      images.forEach(image => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });

      const response = await fetch(`${API_BASE_URL}/hanoukiot`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout');
      }

      return await response.json();
    } catch (error) {
      console.error('[hanoukiotApi] Error in add:', error);
      throw error;
    }
  },

  // Réorganiser les hanoukiot (admin)
  async reorder(hanoukiot, adminCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/hanoukiot/reorder`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify({ hanoukiot, adminCode })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réorganisation');
      }
      return await response.json();
    } catch (error) {
      console.error('[hanoukiotApi] Error in reorder:', error);
      throw error;
    }
  },

  // Supprimer une hanoukia (admin)
  async delete(id, adminCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/hanoukiot/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
        body: JSON.stringify({ adminCode })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      return await response.json();
    } catch (error) {
      console.error('[hanoukiotApi] Error in delete:', error);
      throw error;
    }
  },

  // Récupérer les statistiques (admin)
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/hanoukiot/statistics`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
      return await response.json();
    } catch (error) {
      console.error('[hanoukiotApi] Error in getStatistics:', error);
      throw error;
    }
  }
};

export default hanoukiotApi;
