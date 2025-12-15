const databaseService = require('../services/databaseService');
const voteHelper = require('../helpers/voteHelper');

/**
 * Contrôleur pour la gestion des votes
 */
const votesController = {
  /**
   * Soumettre un vote
   */
  async submitVote(req, res) {
    try {
      const { hanoukiaId, voterId, rating } = req.body;

      // Validation
      const validation = voteHelper.validateVoteData(hanoukiaId, voterId, rating);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const db = await databaseService.readDatabase();

      // Vérifier que la hanoukia existe
      const hanoukia = db.hanoukiot.find(h => h.id === hanoukiaId);
      if (!hanoukia) {
        return res.status(404).json({ error: 'Hanoukia non trouvée' });
      }

      // Créer ou mettre à jour le vote
      voteHelper.upsertVote(db.votes, hanoukiaId, voterId, rating);

      await databaseService.writeDatabase(db);

      res.json({ message: 'Vote enregistré avec succès', rating });
    } catch (error) {
      console.error('Error in submitVote:', error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du vote' });
    }
  },

  /**
   * Récupérer le vote d'un utilisateur pour une hanoukia
   */
  async getUserVote(req, res) {
    try {
      const { hanoukiaId, voterId } = req.params;
      const db = await databaseService.readDatabase();

      const vote = voteHelper.findVote(db.votes, hanoukiaId, voterId);

      if (vote) {
        res.json({ rating: vote.rating });
      } else {
        res.json({ rating: null });
      }
    } catch (error) {
      console.error('Error in getUserVote:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du vote' });
    }
  },

  /**
   * Récupérer tous les votes d'un utilisateur
   */
  async getAllUserVotes(req, res) {
    try {
      const { voterId } = req.params;
      const db = await databaseService.readDatabase();

      const userVotes = voteHelper.findUserVotes(db.votes, voterId);

      res.json(userVotes);
    } catch (error) {
      console.error('Error in getAllUserVotes:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des votes' });
    }
  }
};

module.exports = votesController;
