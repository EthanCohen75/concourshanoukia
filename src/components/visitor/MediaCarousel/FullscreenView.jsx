import api from '../../../services/api';

const FullscreenView = ({ isFullscreen, toggleFullscreen, images, currentIndex, goToPrevious, goToNext }) => {
  if (!isFullscreen) return null;

  return (
    <div className="fullscreen-overlay" onClick={toggleFullscreen}>
      <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="fullscreen-close"
          onClick={toggleFullscreen}
          aria-label="Fermer"
        >
          ✕
        </button>

        <img
          src={api.getImageUrl(images[currentIndex].url)}
          alt={`Hanoukia - Image ${currentIndex + 1}`}
          className="fullscreen-image"
        />

        {images.length > 1 && (
          <>
            <button
              className="fullscreen-btn prev"
              onClick={goToPrevious}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              className="fullscreen-btn next"
              onClick={goToNext}
              aria-label="Image suivante"
            >
              ›
            </button>
            <div className="fullscreen-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullscreenView;
