/**
 * Point d'entrée pour tous les services API
 * Maintient la compatibilité avec l'ancien format api.xxx()
 */

import hanoukiotApi from './hanoukiotApi';
import votesApi from './votesApi';
import adminApi from './adminApi';
import { getImageUrl } from './config';

/**
 * API unifiée compatible avec l'ancien format
 */
const api = {
  // ========== HANOUKIOT ==========
  getAllHanoukiot: () => hanoukiotApi.getAll(),
  addHanoukia: (images, adminCode) => hanoukiotApi.add(images, adminCode),
  reorderHanoukiot: (hanoukiot, adminCode) => hanoukiotApi.reorder(hanoukiot, adminCode),
  deleteHanoukia: (id, adminCode) => hanoukiotApi.delete(id, adminCode),
  getStatistics: () => hanoukiotApi.getStatistics(),

  // ========== VOTES ==========
  submitVote: (hanoukiaId, voterId, rating) => votesApi.submit(hanoukiaId, voterId, rating),
  getUserVote: (hanoukiaId, voterId) => votesApi.getUserVote(hanoukiaId, voterId),
  getUserVotes: (voterId) => votesApi.getAllUserVotes(voterId),

  // ========== ADMIN ==========
  verifyAdminCode: (code) => adminApi.verifyCode(code),
  healthCheck: () => adminApi.healthCheck(),

  // ========== UTILITAIRES ==========
  getImageUrl: getImageUrl
};

// Export par défaut pour compatibilité
export default api;

// Exports nommés pour usage moderne
export { hanoukiotApi, votesApi, adminApi, getImageUrl };
