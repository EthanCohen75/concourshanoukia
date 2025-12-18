import { useState, useEffect } from 'react';
import MediaCarousel from './MediaCarousel';
import RatingInterface from './RatingInterface';
import useVoteSession from '../../hooks/useVoteSession';

const HanoukiaCard = ({ hanoukia, disabled = false }) => {
  const { tempVotes, saveTempVote, removeTempVote } = useVoteSession();
  const [currentRating, setCurrentRating] = useState(null);

  // Charger vote temporaire au montage
  useEffect(() => {
    const tempRating = tempVotes[hanoukia.id];
    setCurrentRating(tempRating || null);
  }, [tempVotes, hanoukia.id]);

  const handleVote = (rating) => {
    saveTempVote(hanoukia.id, rating);
    setCurrentRating(rating);
  };

  const handleCancelVote = () => {
    removeTempVote(hanoukia.id);
    setCurrentRating(null);
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
          {disabled ? 'Votre note' : currentRating ? 'Modifier votre note' : 'Notez cette hanoukia'}
        </h3>

        {!disabled && currentRating && (
          <span className="vote-draft-badge">📝 Brouillon</span>
        )}

        <RatingInterface
          currentRating={currentRating}
          onRate={handleVote}
          onCancel={handleCancelVote}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default HanoukiaCard;
