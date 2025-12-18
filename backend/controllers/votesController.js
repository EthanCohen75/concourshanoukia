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
  },

  /**
   * Supprimer un vote
   */
  async deleteVote(req, res) {
    try {
      const { hanoukiaId, voterId } = req.params;

      // Valider les paramètres
      if (!hanoukiaId || !voterId) {
        return res.status(400).json({ error: 'hanoukiaId et voterId requis' });
      }

      const db = await databaseService.readDatabase();

      // Supprimer le vote
      const deleted = voteHelper.removeVote(db.votes, hanoukiaId, voterId);

      if (deleted) {
        await databaseService.writeDatabase(db);
        return res.json({ success: true, message: 'Vote supprimé avec succès' });
      } else {
        return res.status(404).json({ error: 'Vote non trouvé' });
      }
    } catch (error) {
      console.error('Error in deleteVote:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * Soumettre tous les votes en une fois
   */
  async submitAllVotes(req, res) {
    try {
      const { voterId, votes } = req.body;

      // Validation
      if (!voterId || !votes || !Array.isArray(votes)) {
        return res.status(400).json({ error: 'voterId et votes requis' });
      }

      const db = await databaseService.readDatabase();
      const totalHanoukiot = db.hanoukiot.length;

      // Vérifier que tous les votes sont présents
      if (votes.length !== totalHanoukiot) {
        return res.status(400).json({
          error: `Vous devez noter toutes les hanoukiot (${votes.length}/${totalHanoukiot})`
        });
      }

      // Valider chaque vote
      for (const vote of votes) {
        if (!vote.hanoukiaId || !vote.rating) {
          return res.status(400).json({ error: 'Format de vote invalide' });
        }
        if (vote.rating < 1 || vote.rating > 10) {
          return res.status(400).json({ error: 'Rating doit être entre 1 et 10' });
        }
      }

      // Soumettre tous les votes
      const results = await voteHelper.submitBatchVotes(db, voterId, votes);

      res.json({
        success: true,
        message: 'Tous les votes ont été enregistrés',
        votes: results
      });
    } catch (error) {
      console.error('Error in submitAllVotes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = votesController;
