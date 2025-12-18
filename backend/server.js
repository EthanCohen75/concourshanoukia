const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour permettre l'accès depuis Vercel
const corsOptions = {
  origin: '*', // Permet toutes les origines (vous pouvez restreindre à votre domaine Vercel si besoin)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploads statiquement avec les bons headers CORS
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// S'assurer que les dossiers nécessaires existent
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(__dirname, 'data', 'db.json');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialiser db.json s'il n'existe pas
if (!fs.existsSync(dbPath)) {
  const initialDb = {
    adminCode: 'petitbb',
    hanoukiot: [],
    votes: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf8');
  console.log('✅ Base de données initialisée avec le code admin: petitbb');
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

// Route temporaire pour changer le code admin
app.post('/api/admin/change-password', (req, res) => {
  const { oldCode, newCode } = req.body;
  const dbPath = path.join(__dirname, 'data', 'db.json');

  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Vérifier l'ancien code
    if (oldCode !== data.adminCode) {
      return res.status(403).json({ error: 'Ancien code incorrect' });
    }

    // Mettre à jour avec le nouveau code
    data.adminCode = newCode;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

    res.json({ success: true, message: 'Code admin modifié avec succès' });
  } catch (error) {
    console.error('Error changing admin code:', error);
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
