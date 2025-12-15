import { MAX_IMAGE_SIZE_MB } from '../../../utils/constants';

const DropZone = ({ fileInputRef, handleDrop, handleDragOver, handleFileSelect, openFilePicker, maxImages }) => {
  return (
    <div
      className="drop-zone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={openFilePicker}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
          Cliquez ou glissez-déposez des images
        </p>
        <p className="drop-zone-hint">
          Maximum {maxImages} images • {MAX_IMAGE_SIZE_MB}MB par image
        </p>
      </div>
    </div>
  );
};

export default DropZone;
