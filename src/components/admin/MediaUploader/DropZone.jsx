import { useRef } from 'react';
import { MAX_IMAGE_SIZE_MB } from '../../../utils/constants';

const DropZone = ({ fileInputRef, handleDrop, handleDragOver, handleFileSelect, openFilePicker, maxImages }) => {
  const cameraInputRef = useRef(null);

  const openCamera = (e) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  return (
    <div
      className="drop-zone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Input pour choisir depuis la galerie */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Input pour prendre une photo avec l'appareil */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="drop-zone-content">
        <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="drop-zone-text">
          Glissez-déposez des images ici
        </p>
        <p className="drop-zone-hint">
          Maximum {maxImages} images • {MAX_IMAGE_SIZE_MB}MB par image
        </p>

        <div className="upload-buttons">
          <button
            type="button"
            className="btn-upload btn-gallery"
            onClick={openFilePicker}
          >
            📁 Choisir des photos
          </button>
          <button
            type="button"
            className="btn-upload btn-camera"
            onClick={openCamera}
          >
            📷 Prendre une photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
