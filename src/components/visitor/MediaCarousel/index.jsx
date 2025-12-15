import { useState } from 'react';
import api from '../../../services/api';
import CarouselControls from './CarouselControls';
import FullscreenView from './FullscreenView';

const MediaCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return <div className="no-images">Aucune image disponible</div>;
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (isFullscreen) {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }
  };

  return (
    <>
      <div className="media-carousel" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="carousel-main">
          <img
            src={api.getImageUrl(images[currentIndex].url)}
            alt={`Hanoukia - Image ${currentIndex + 1}`}
            className="carousel-image"
            onClick={toggleFullscreen}
            style={{ cursor: 'pointer' }}
          />

          <CarouselControls
            images={images}
            currentIndex={currentIndex}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            goToSlide={goToSlide}
          />
        </div>
      </div>

      <FullscreenView
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        images={images}
        currentIndex={currentIndex}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />
    </>
  );
};

export default MediaCarousel;
