import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

const Navigation = () => {
  const { isAuthenticated } = useContext(AdminContext);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links">
          {!isAdminRoute && (
            <Link to="/admin" className="nav-link admin-link">
              🔐 Admin
            </Link>
          )}

          {isAdminRoute && !location.pathname.includes('dashboard') && (
            <Link to="/" className="nav-link">
              ← Retour au concours
            </Link>
          )}

          {isAuthenticated && location.pathname.includes('dashboard') && (
            <Link to="/" className="nav-link">
              ← Retour au concours
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
