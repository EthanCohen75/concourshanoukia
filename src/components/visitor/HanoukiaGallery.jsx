import { useState } from 'react';
import HanoukiaCard from './HanoukiaCard';
import useHanoukiot from '../../hooks/useHanoukiot';
import useVoteSession from '../../hooks/useVoteSession';

const HanoukiaGallery = () => {
  const { getSortedHanoukiot, loading } = useHanoukiot();
  const { votesCount, allVoted, submitAll, isSubmitting } = useVoteSession();
  const [showSuccess, setShowSuccess] = useState(false);

  const hanoukiot = getSortedHanoukiot();

  const handleSubmitAll = async () => {
    try {
      await submitAll();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      alert('Erreur lors de la soumission des votes');
    }
  };

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
        <p>Les hanoukiot seront bientôt disponibles pour la notation !</p>
      </div>
    );
  }

  return (
    <div className="hanoukia-gallery">
      <div className="gallery-header">
        <h1>Concours de Hanoukiot</h1>
        <p className="gallery-description">
          Découvrez les {hanoukiot.length} hanoukiot participantes et notez les !
        </p>

        <div className="voting-progress">
          <p>
            Vous avez noté <strong>{votesCount}</strong> sur{' '}
            <strong>{hanoukiot.length}</strong> hanoukiot
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(votesCount / hanoukiot.length) * 100}%` }}
            />
          </div>

          {votesCount === 0 && (
            <p className="progress-info">
              ℹ️ Notez toutes les hanoukiot pour pouvoir soumettre vos votes
            </p>
          )}

          {!allVoted && votesCount > 0 && (
            <p className="progress-hint">
              ⚠️ Vous devez noter toutes les hanoukiot avant de pouvoir soumettre vos votes
            </p>
          )}
        </div>

        {!showSuccess && (
          <button
            className="btn-submit-all"
            onClick={handleSubmitAll}
            disabled={!allVoted || isSubmitting}
          >
            {isSubmitting ? '⏳ Soumission en cours...' :
             allVoted ? '✅ Soumettre mes votes' : '🔒 Notez toutes les hanoukiot pour soumettre'}
          </button>
        )}

        {showSuccess && (
          <div className="success-message">
            ✅ Vos votes ont été enregistrés avec succès !
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {hanoukiot.map(hanoukia => (
          <HanoukiaCard key={hanoukia.id} hanoukia={hanoukia} />
        ))}
      </div>

      {/* Bouton de soumission en bas de page */}
      <div className="gallery-footer">
        {!showSuccess && (
          <button
            className="btn-submit-all"
            onClick={handleSubmitAll}
            disabled={!allVoted || isSubmitting}
          >
            {isSubmitting ? '⏳ Soumission en cours...' :
             allVoted ? '✅ Soumettre mes votes' : '🔒 Notez toutes les hanoukiot pour soumettre'}
          </button>
        )}

        {showSuccess && (
          <div className="success-message">
            ✅ Vos votes ont été enregistrés avec succès !
          </div>
        )}
      </div>
    </div>
  );
};

export default HanoukiaGallery;
