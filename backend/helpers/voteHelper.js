const { v4: uuidv4 } = require('uuid');

/**
 * Helpers pour la gestion des votes
 */
const voteHelper = {
  /**
   * Valider les données d'un vote
   */
  validateVoteData(hanoukiaId, voterId, rating) {
    if (!hanoukiaId || !voterId || rating === undefined) {
      return { valid: false, error: 'Données manquantes' };
    }

    if (rating < 1 || rating > 10) {
      return { valid: false, error: 'La note doit être entre 1 et 10' };
    }

    return { valid: true };
  },

  /**
   * Créer ou mettre à jour un vote
   */
  upsertVote(votes, hanoukiaId, voterId, rating) {
    const existingVoteIndex = votes.findIndex(
      v => v.hanoukiaId === hanoukiaId && v.voterId === voterId
    );

    if (existingVoteIndex >= 0) {
      // Mettre à jour le vote existant
      votes[existingVoteIndex] = {
        ...votes[existingVoteIndex],
        rating,
        timestamp: new Date().toISOString()
      };
      return { updated: true, vote: votes[existingVoteIndex] };
    } else {
      // Créer un nouveau vote
      const newVote = {
        id: uuidv4(),
        hanoukiaId,
        voterId,
        rating,
        timestamp: new Date().toISOString()
      };
      votes.push(newVote);
      return { updated: false, vote: newVote };
    }
  },

  /**
   * Trouver un vote spécifique
   */
  findVote(votes, hanoukiaId, voterId) {
    return votes.find(v => v.hanoukiaId === hanoukiaId && v.voterId === voterId);
  },

  /**
   * Trouver tous les votes d'un utilisateur
   */
  findUserVotes(votes, voterId) {
    return votes.filter(v => v.voterId === voterId);
  }
};

module.exports = voteHelper;
