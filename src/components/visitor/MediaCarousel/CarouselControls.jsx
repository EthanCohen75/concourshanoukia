const CarouselControls = ({ images, currentIndex, goToPrevious, goToNext, goToSlide }) => {
  if (images.length <= 1) return null;

  return (
    <>
      <button
        className="carousel-btn prev"
        onClick={goToPrevious}
        aria-label="Image précédente"
      >
        ‹
      </button>
      <button
        className="carousel-btn next"
        onClick={goToNext}
        aria-label="Image suivante"
      >
        ›
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      <div className="carousel-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </>
  );
};

export default CarouselControls;
