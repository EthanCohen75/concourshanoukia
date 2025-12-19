const { v4: uuidv4 } = require('uuid');

/**
 * Helpers pour la création et manipulation des hanoukiot
 */
const hanoukiaHelper = {
  /**
   * Valider les fichiers uploadés
   */
  validateFiles(files) {
    if (!files || files.length === 0) {
      return { valid: false, error: 'Au moins une image est requise' };
    }
    return { valid: true };
  },
  /**
   * Calculer le prochain numéro de hanoukia
   */
  getNextNumber(hanoukiot) {
    return hanoukiot.length > 0
      ? Math.max(...hanoukiot.map(h => h.number)) + 1
      : 1;
  },

  /**
   * Calculer le prochain ordre
   */
  getNextOrder(hanoukiot) {
    return hanoukiot.length > 0
      ? Math.max(...hanoukiot.map(h => h.order)) + 1
      : 1;
  },

  /**
   * Créer un objet hanoukia à partir des fichiers uploadés
   */
  createHanoukia(files, number, order) {
    const images = files.map(file => ({
      id: uuidv4(),
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      originalName: file.originalname
    }));

    return {
      id: uuidv4(),
      number,
      order,
      createdAt: new Date().toISOString(),
      images
    };
  },

  /**
   * Ajouter les votes à chaque hanoukia et trier
   */
  addVotesAndSort(hanoukiot, votes) {
    const hanoukiotWithVotes = hanoukiot.map(hanoukia => ({
      ...hanoukia,
      votes: votes.filter(v => v.hanoukiaId === hanoukia.id)
    }));
    return hanoukiotWithVotes.sort((a, b) => a.order - b.order);
  },

  /**
   * Réorganiser les hanoukiot
   */
  reorderHanoukiot(hanoukiot) {
    return hanoukiot.map((h, index) => ({
      ...h,
      order: index + 1
    }));
  },

  /**
   * Supprimer une hanoukia et ses votes
   */
  removeHanoukia(db, hanoukiaId) {
    db.hanoukiot = db.hanoukiot.filter(h => h.id !== hanoukiaId);
    db.votes = db.votes.filter(v => v.hanoukiaId !== hanoukiaId);
    return db;
  },

  /**
   * Calculer les statistiques pour une hanoukia
   */
  calculateStatistics(hanoukia, votes) {
    const hanoukiaVotes = votes.filter(v => v.hanoukiaId === hanoukia.id);

    // Compter les votants uniques (nombre de notations)
    const uniqueVoters = new Set(hanoukiaVotes.map(v => v.voterId));
    const totalNotations = uniqueVoters.size;

    const averageRating = totalNotations > 0
      ? hanoukiaVotes.reduce((sum, v) => sum + v.rating, 0) / totalNotations
      : 0;

    // Préparer la liste des votes individuels pour affichage détaillé
    const individualVotes = hanoukiaVotes.map((vote, index) => ({
      voterNumber: index + 1, // Anonymiser: "Votant 1", "Votant 2", etc.
      rating: vote.rating,
      timestamp: vote.timestamp
    }));

    return {
      id: hanoukia.id,
      number: hanoukia.number,
      totalNotations, // Nombre de votants uniques
      averageRating: averageRating.toFixed(2),
      individualVotes // Liste des votes pour affichage détaillé
    };
  }
};

module.exports = hanoukiaHelper;
