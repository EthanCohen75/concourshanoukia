import { useState } from 'react';
import { RATING_MIN, RATING_MAX } from '../../utils/constants';

const RatingInterface = ({ currentRating, onRate, disabled = false }) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const ratings = Array.from(
    { length: RATING_MAX - RATING_MIN + 1 },
    (_, i) => i + RATING_MIN
  );

  const handleClick = (rating) => {
    if (!disabled && onRate) {
      onRate(rating);
    }
  };

  return (
    <div className="rating-interface">
      <div className="rating-buttons">
        {ratings.map(rating => (
          <button
            key={rating}
            className={`rating-btn ${
              currentRating === rating ? 'active' : ''
            } ${hoveredRating === rating ? 'hovered' : ''}`}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={disabled}
            aria-label={`Noter ${rating} sur ${RATING_MAX}`}
          >
            {rating}
          </button>
        ))}
      </div>

      {currentRating && (
        <div className="current-rating-display">
          <span className="current-rating-text">
            Votre note : <strong>{currentRating}/{RATING_MAX}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default RatingInterface;
