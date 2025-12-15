/**
 * Configuration de l'API
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Options par défaut pour les requêtes fetch
 */
export const defaultHeaders = {
  'Content-Type': 'application/json'
};

/**
 * Obtenir l'URL de base du serveur (sans /api)
 */
const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  // Enlever /api à la fin si présent
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Obtenir l'URL complète d'une image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const baseUrl = getServerBaseUrl();
  return `${baseUrl}${imagePath}`;
};
