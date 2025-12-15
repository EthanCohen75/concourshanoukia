const databaseService = require('../services/databaseService');

/**
 * Helpers pour les opérations administrateur
 */
const adminHelper = {
  /**
   * Vérifier le code administrateur
   */
  async verifyAdminCode(adminCode, res) {
    const isValid = await databaseService.verifyAdminCode(adminCode);
    if (!isValid) {
      res.status(403).json({ error: 'Code administrateur invalide' });
      return false;
    }
    return true;
  }
};

module.exports = adminHelper;
