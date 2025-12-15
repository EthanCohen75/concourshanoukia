import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

const AdminAuth = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Veuillez entrer le code d\'accès');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[AdminAuth] Tentative de connexion avec le code:', code);
      const result = await login(code);
      console.log('[AdminAuth] Résultat du login:', result);

      if (result.success) {
        console.log('[AdminAuth] Connexion réussie, navigation vers dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('[AdminAuth] Connexion échouée:', result.error);
        setError(result.error || 'Code incorrect');
        setCode('');
      }
    } catch (err) {
      console.error('[AdminAuth] Erreur lors de la connexion:', err);
      setError('Une erreur s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h1>Administration</h1>
        <p className="auth-description">
          Entrez votre code d'accès administrateur
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="admin-code">Code d'accès</label>
            <input
              id="admin-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez le code"
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <a href="/" className="back-link">
            ← Retour au concours
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
