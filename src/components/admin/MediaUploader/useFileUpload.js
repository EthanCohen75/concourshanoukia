import { useState, useRef } from 'react';
import { MAX_IMAGE_SIZE_MB } from '../../../utils/constants';

const useFileUpload = (onImagesChange, maxImages) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const processFiles = (newFiles) => {
    setError('');
    if (files.length + newFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`);
      return;
    }

    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setError(`Certaines images dépassent ${MAX_IMAGE_SIZE_MB}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setError('Aucune image valide sélectionnée');
      return;
    }

    const newPreviews = validFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name
    }));

    const updatedFiles = [...files, ...validFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    if (onImagesChange) {
      onImagesChange(updatedFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previews[indexToRemove].previewUrl);

    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);

    setFiles(newFiles);
    setPreviews(newPreviews);

    if (onImagesChange) {
      onImagesChange(newFiles);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    files,
    previews,
    error,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    removeImage,
    openFilePicker,
  };
};

export default useFileUpload;
