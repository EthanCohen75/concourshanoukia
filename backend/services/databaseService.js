const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

/**
 * Service de gestion de la base de données JSON
 */
const databaseService = {
  /**
   * Lire la base de données
   */
  async readDatabase() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      // Retourner une structure par défaut si la DB n'existe pas
      return {
        adminCode: 'default-code-5786',
        hanoukiot: [],
        votes: []
      };
    }
  },

  /**
   * Écrire dans la base de données
   */
  async writeDatabase(data) {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error writing database:', error);
      return false;
    }
  },

  /**
   * Vérifier le code admin
   */
  async verifyAdminCode(code) {
    try {
      const db = await this.readDatabase();
      return code === db.adminCode;
    } catch (error) {
      console.error('Error verifying admin code:', error);
      return false;
    }
  }
};

module.exports = databaseService;
