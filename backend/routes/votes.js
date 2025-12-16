const express = require('express');
const router = express.Router();
const votesController = require('../controllers/votesController');

/**
 * Routes pour la gestion des votes
 */

// POST - Soumettre un vote
router.post('/', votesController.submitVote);

// GET - Récupérer le vote d'un utilisateur pour une hanoukia
router.get('/:hanoukiaId/:voterId', votesController.getUserVote);

// GET - Récupérer tous les votes d'un utilisateur
router.get('/user/:voterId', votesController.getAllUserVotes);

// DELETE - Supprimer un vote
router.delete('/:hanoukiaId/:voterId', votesController.deleteVote);

module.exports = router;
