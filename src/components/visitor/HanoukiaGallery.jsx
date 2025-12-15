import HanoukiaCard from './HanoukiaCard';
import useHanoukiot from '../../hooks/useHanoukiot';
import useVoter from '../../hooks/useVoter';

const HanoukiaGallery = () => {
  const { getSortedHanoukiot, loading } = useHanoukiot();
  const voterId = useVoter();

  const hanoukiot = getSortedHanoukiot();

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des hanoukiot...</p>
      </div>
    );
  }

  if (hanoukiot.length === 0) {
    return (
      <div className="gallery-empty">
        <h2>Aucune hanoukia pour le moment</h2>
        <p>Les hanoukiot seront bientôt disponibles pour le vote !</p>
      </div>
    );
  }

  // Calculate vote statistics
  const totalVotes = hanoukiot.reduce((sum, h) => sum + h.votes.length, 0);
  const userVotes = voterId
    ? hanoukiot.filter(h => h.votes.some(v => v.voterId === voterId)).length
    : 0;

  return (
    <div className="hanoukia-gallery">
      <div className="gallery-header">
        <h1>Concours de Hanoukiot</h1>
        <p className="gallery-description">
          Découvrez les {hanoukiot.length} hanoukiot participantes et votez pour vos préférées !
        </p>

        {voterId && (
          <div className="voting-progress">
            <p>
              Vous avez voté pour <strong>{userVotes}</strong> sur{' '}
              <strong>{hanoukiot.length}</strong> hanoukiot
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userVotes / hanoukiot.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="gallery-stats">
          <span className="stat-item">
            📊 {totalVotes} {totalVotes === 1 ? 'vote total' : 'votes totaux'}
          </span>
        </div>
      </div>

      <div className="gallery-grid">
        {hanoukiot.map(hanoukia => (
          <HanoukiaCard key={hanoukia.id} hanoukia={hanoukia} />
        ))}
      </div>
    </div>
  );
};

export default HanoukiaGallery;
