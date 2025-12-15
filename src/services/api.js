/**
 * Fichier de compatibilité - réexporte l'API refactorisée
 * Pour migrer progressivement, vous pouvez utiliser:
 * - import api from './services/api' (ancien style)
 * - import { hanoukiotApi, votesApi, adminApi } from './services/api' (nouveau style)
 */

export { default, hanoukiotApi, votesApi, adminApi, getImageUrl } from './api/index';
