import { useState, useEffect } from 'react';
import MediaCarousel from './MediaCarousel';
import RatingInterface from './RatingInterface';
import useHanoukiot from '../../hooks/useHanoukiot';
import useVoter from '../../hooks/useVoter';

const HanoukiaCard = ({ hanoukia }) => {
  const { submitVote, getUserVote, deleteVote } = useHanoukiot();
  const voterId = useVoter();
  const [isVoting, setIsVoting] = useState(false);
  const [currentRating, setCurrentRating] = useState(null);

  // Load current user vote on mount
  useEffect(() => {
    const loadUserVote = async () => {
      if (voterId && hanoukia.id) {
        const rating = await getUserVote(hanoukia.id, voterId);
        setCurrentRating(rating);
      }
    };
    loadUserVote();
  }, [voterId, hanoukia.id, getUserVote]);

  const handleVote = async (rating) => {
    if (!voterId) return;

    setIsVoting(true);

    try {
      await submitVote(hanoukia.id, voterId, rating);
      setCurrentRating(rating); // Update local state immediately
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Optional: Show error message
    } finally {
      setIsVoting(false);
    }
  };

  const handleCancelVote = async () => {
    if (!voterId || !currentRating) return;

    setIsVoting(true);

    try {
      await deleteVote(hanoukia.id, voterId);
      setCurrentRating(null); // Reset local state
    } catch (error) {
      console.error('Error canceling vote:', error);
      alert('Erreur lors de l\'annulation du vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="hanoukia-card">
      <div className="hanoukia-header">
        <h2 className="hanoukia-title">Hanoukia {hanoukia.number}</h2>
      </div>

      <div className="hanoukia-media">
        <MediaCarousel images={hanoukia.images} />
      </div>

      <div className="hanoukia-voting">
        <h3 className="voting-title">
          {currentRating ? 'Modifier votre note' : 'Notez cette hanoukia'}
        </h3>
        <RatingInterface
          currentRating={currentRating}
          onRate={handleVote}
          onCancel={handleCancelVote}
          disabled={isVoting || !voterId}
        />
        {isVoting && <span className="voting-status">Enregistrement...</span>}
      </div>
    </div>
  );
};

export default HanoukiaCard;
