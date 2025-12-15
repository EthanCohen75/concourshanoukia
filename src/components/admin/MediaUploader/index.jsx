import { MAX_IMAGES_PER_HANOUKIA } from '../../../utils/constants';
import DropZone from './DropZone';
import PreviewGrid from './PreviewGrid';
import useFileUpload from './useFileUpload';

const MediaUploader = ({ onImagesChange, maxImages = MAX_IMAGES_PER_HANOUKIA }) => {
  const {
    previews,
    error,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    openFilePicker,
  } = useFileUpload(onImagesChange, maxImages);

  return (
    <div className="media-uploader">
      <DropZone
        fileInputRef={fileInputRef}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleFileSelect={handleFileSelect}
        openFilePicker={openFilePicker}
        maxImages={maxImages}
      />

      {error && (
        <div className="upload-error">
          ⚠️ {error}
        </div>
      )}

      <PreviewGrid
        previews={previews}
        removeImage={removeImage}
      />
    </div>
  );
};

export default MediaUploader;
