import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <Navigation />
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Concours de Hanoukiot 5786 🕎</p>
          <p className="footer-note">
            Fait avec ❤️ pour Hanouka
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
