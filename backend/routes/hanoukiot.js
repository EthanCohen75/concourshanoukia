const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const hanoukiotController = require('../controllers/hanoukiotController');

/**
 * Routes pour la gestion des hanoukiot
 */

// GET - Récupérer toutes les hanoukiot
router.get('/', hanoukiotController.getAll);

// POST - Ajouter une nouvelle hanoukia (admin only)
router.post('/', upload.array('images', 5), hanoukiotController.create);

// PUT - Réorganiser les hanoukiot (admin only)
router.put('/reorder', hanoukiotController.reorder);

// DELETE - Supprimer une hanoukia (admin only)
router.delete('/:id', hanoukiotController.delete);

// GET - Statistiques (admin only)
router.get('/statistics', hanoukiotController.getStatistics);

module.exports = router;
