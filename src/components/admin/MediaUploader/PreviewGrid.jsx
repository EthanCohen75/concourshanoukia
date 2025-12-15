const PreviewGrid = ({ previews, removeImage }) => {
  if (previews.length === 0) return null;

  return (
    <>
      <div className="preview-grid">
        {previews.map((preview, index) => (
          <div key={index} className="preview-item">
            <img
              src={preview.previewUrl}
              alt={`Preview ${index + 1}`}
              className="preview-image"
            />
            <button
              type="button"
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
              aria-label="Supprimer l'image"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="upload-summary">
        {previews.length} {previews.length === 1 ? 'image' : 'images'} sélectionnée
        {previews.length !== 1 ? 's' : ''}
      </div>
    </>
  );
};

export default PreviewGrid;
