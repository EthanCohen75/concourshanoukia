import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import AddHanoukia from './AddHanoukia';
import HanoukiaManager from './HanoukiaManager';
import Statistics from './Statistics';
import useHanoukiot from '../../hooks/useHanoukiot';
import { storage } from '../../services/storage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('add'); // add, manage, stats
  const { logout } = useContext(AdminContext);
  const { hanoukiot } = useHanoukiot();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const storageUsage = storage.estimateStorageSize();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Administration</h1>
          <div className="header-actions">
            <a href="/" className="view-site-link">
              Voir le site
            </a>
            <button onClick={handleLogout} className="btn-logout">
              Déconnexion
            </button>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-badge">
            <span className="stat-value">{hanoukiot.length}</span>
            <span className="stat-label">Hanoukiot</span>
          </div>
          <div className="stat-badge">
            <span className="stat-value">{storageUsage} MB</span>
            <span className="stat-label">Stockage utilisé</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ➕ Ajouter
        </button>
        <button
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          ⚙️ Gérer
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistiques
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'add' && <AddHanoukia />}
        {activeTab === 'manage' && <HanoukiaManager />}
        {activeTab === 'stats' && <Statistics />}
      </div>
    </div>
  );
};

export default AdminDashboard;
