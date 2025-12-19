const databaseService = require('../services/databaseService');
const hanoukiaHelper = require('../helpers/hanoukiaHelper');
const imageHelper = require('../helpers/imageHelper');
const adminHelper = require('../helpers/adminHelper');

const hanoukiotController = {
  // Récupérer toutes les hanoukiot avec leurs votes
  async getAll(req, res) {
    try {
      const db = await databaseService.readDatabase();
      const sortedHanoukiot = hanoukiaHelper.addVotesAndSort(db.hanoukiot, db.votes);
      res.json(sortedHanoukiot);
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des hanoukiot' });
    }
  },

  // Ajouter une nouvelle hanoukia (admin only)
  async create(req, res) {
    try {
      if (!await adminHelper.verifyAdminCode(req.body.adminCode, res)) return;

      const fileValidation = hanoukiaHelper.validateFiles(req.files);
      if (!fileValidation.valid) {
        return res.status(400).json({ error: fileValidation.error });
      }

      const db = await databaseService.readDatabase();
      const nextNumber = hanoukiaHelper.getNextNumber(db.hanoukiot);
      const nextOrder = hanoukiaHelper.getNextOrder(db.hanoukiot);
      const newHanoukia = hanoukiaHelper.createHanoukia(req.files, nextNumber, nextOrder);

      db.hanoukiot.push(newHanoukia);
      await databaseService.writeDatabase(db);

      res.status(201).json(newHanoukia);
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la hanoukia' });
    }
  },

  // Réorganiser les hanoukiot (admin only)
  async reorder(req, res) {
    try {
      if (!await adminHelper.verifyAdminCode(req.body.adminCode, res)) return;

      const db = await databaseService.readDatabase();
      const updatedHanoukiot = hanoukiaHelper.reorderHanoukiot(req.body.hanoukiot);
      db.hanoukiot = updatedHanoukiot;
      await databaseService.writeDatabase(db);

      res.json(updatedHanoukiot);
    } catch (error) {
      console.error('Error in reorder:', error);
      res.status(500).json({ error: 'Erreur lors de la réorganisation' });
    }
  },

  // Supprimer une hanoukia (admin only)
  async delete(req, res) {
    try {
      if (!await adminHelper.verifyAdminCode(req.body.adminCode, res)) return;

      const db = await databaseService.readDatabase();
      const hanoukia = db.hanoukiot.find(h => h.id === req.params.id);
      if (!hanoukia) {
        return res.status(404).json({ error: 'Hanoukia non trouvée' });
      }

      await imageHelper.deleteHanoukiaImages(hanoukia);
      const updatedDb = hanoukiaHelper.removeHanoukia(db, req.params.id);
      await databaseService.writeDatabase(updatedDb);

      res.json({ message: 'Hanoukia supprimée avec succès' });
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  },

  // Obtenir les statistiques (admin only)
  async getStatistics(req, res) {
    try {
      const db = await databaseService.readDatabase();

      const statistics = db.hanoukiot
        .map(hanoukia => hanoukiaHelper.calculateStatistics(hanoukia, db.votes))
        .sort((a, b) => a.number - b.number);

      // Calculer le nombre total de votants uniques
      const uniqueVoters = new Set(db.votes.map(v => v.voterId));
      const totalVoters = uniqueVoters.size;

      res.json({
        statistics,
        totalVoters
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({ error: 'Erreur lors du calcul des statistiques' });
    }
  }
};

module.exports = hanoukiotController;
