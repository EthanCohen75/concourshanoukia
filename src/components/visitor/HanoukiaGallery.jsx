import { useState } from 'react';
import HanoukiaCard from './HanoukiaCard';
import useHanoukiot from '../../hooks/useHanoukiot';
import useVoteSession from '../../hooks/useVoteSession';
import { isContestClosed, getDeadlineFormatted } from '../../config/contest';

const HanoukiaGallery = () => {
  const { getSortedHanoukiot, loading } = useHanoukiot();
  const { votesCount, allVoted, submitAll, isSubmitting, hasSubmitted, votesChanged } = useVoteSession();
  const [showSuccess, setShowSuccess] = useState(false);
  const contestClosed = isContestClosed();

  const hanoukiot = getSortedHanoukiot();

  // Déterminer si le bouton doit être actif
  const canSubmit = hasSubmitted ? (allVoted && votesChanged) : allVoted;

  const handleSubmitAll = async () => {
    if (contestClosed) {
      alert(`Le concours est clôturé depuis le ${getDeadlineFormatted()}`);
      return;
    }

    try {
      await submitAll();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      // Gérer l'erreur de clôture
      if (error.message && error.message.includes('clôturé')) {
        alert(error.message);
      } else {
        alert('Erreur lors de la soumission des notes');
      }
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
        <p className="gallery-school">École AJJ - ישיבה תורה ורחמים</p>
        <p className="gallery-class">Kita Beth (CE1)</p>
        <p className="gallery-description">
          Découvrez les {hanoukiot.length} hanoukiot réalisées par les enfants et notez-les !
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

          {contestClosed && (
            <p className="progress-closed">
              🔒 Le concours est clôturé depuis le {getDeadlineFormatted()}
            </p>
          )}

          {!contestClosed && !hasSubmitted && votesCount === 0 && (
            <p className="progress-info">
              ℹ️ Notez toutes les hanoukiot pour pouvoir soumettre vos notes
            </p>
          )}

          {!contestClosed && !hasSubmitted && !allVoted && votesCount > 0 && (
            <p className="progress-hint">
              ⚠️ Vous devez noter toutes les hanoukiot avant de pouvoir soumettre vos notes
            </p>
          )}

          {!contestClosed && hasSubmitted && !votesChanged && (
            <p className="progress-info">
              ✅ Vos notes ont été soumises. Modifiez-les si vous souhaitez les mettre à jour.
            </p>
          )}

          {!contestClosed && hasSubmitted && votesChanged && !allVoted && (
            <p className="progress-hint">
              ⚠️ Vous devez noter toutes les hanoukiot pour pouvoir modifier vos notes
            </p>
          )}
        </div>

        {!showSuccess && !contestClosed && (
          <button
            className="btn-submit-all"
            onClick={handleSubmitAll}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? '⏳ Soumission en cours...' :
             hasSubmitted ? (canSubmit ? '✏️ Modifier mes notes' : '🔒 Changez vos notes pour modifier') :
             (allVoted ? '✅ Soumettre mes notes' : '🔒 Notez toutes les hanoukiot pour soumettre')}
          </button>
        )}

        {showSuccess && (
          <div className="success-message">
            ✅ Vos notes ont été enregistrées avec succès !
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {hanoukiot.map(hanoukia => (
          <HanoukiaCard key={hanoukia.id} hanoukia={hanoukia} disabled={contestClosed} />
        ))}
      </div>

      {/* Bouton de soumission en bas de page */}
      <div className="gallery-footer">
        {!showSuccess && !contestClosed && (
          <button
            className="btn-submit-all"
            onClick={handleSubmitAll}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? '⏳ Soumission en cours...' :
             hasSubmitted ? (canSubmit ? '✏️ Modifier mes notes' : '🔒 Changez vos notes pour modifier') :
             (allVoted ? '✅ Soumettre mes notes' : '🔒 Notez toutes les hanoukiot pour soumettre')}
          </button>
        )}

        {showSuccess && (
          <div className="success-message">
            ✅ Vos notes ont été enregistrées avec succès !
          </div>
        )}
      </div>
    </div>
  );
};

export default HanoukiaGallery;
