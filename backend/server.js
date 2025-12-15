const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploads statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// S'assurer que les dossiers nécessaires existent
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Routes
const hanoukiotRoutes = require('./routes/hanoukiot');
const votesRoutes = require('./routes/votes');

app.use('/api/hanoukiot', hanoukiotRoutes);
app.use('/api/votes', votesRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Hanoukiot is running' });
});

// Route pour vérifier le code admin
app.post('/api/admin/verify', (req, res) => {
  const { code } = req.body;
  const dbPath = path.join(__dirname, 'data', 'db.json');

  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (code === data.adminCode) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Hanoukiot démarré sur le port ${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🖼️  Images disponibles sur http://localhost:${PORT}/uploads\n`);
});
