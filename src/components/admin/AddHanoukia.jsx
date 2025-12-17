import { useState, useContext } from 'react';
import MediaUploader from './MediaUploader';
import useHanoukiot from '../../hooks/useHanoukiot';
import { AdminContext } from '../../context/AdminContext';

const AddHanoukia = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploaderKey, setUploaderKey] = useState(0); // Pour forcer le reset du MediaUploader

  const { addHanoukia, hanoukiot } = useHanoukiot();
  const { getAdminCode } = useContext(AdminContext);
  const nextNumber = Math.max(0, ...hanoukiot.map(h => h.number)) + 1;

  const handleImagesChange = (newFiles) => {
    setImageFiles(newFiles);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      setErrorMessage('Veuillez sélectionner au moins une image');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const adminCode = getAdminCode();
      const newHanoukia = await addHanoukia(imageFiles, adminCode);
      setSuccessMessage(`Hanoukia ${newHanoukia.number} ajoutée avec succès !`);
      setImageFiles([]);
      setUploaderKey(prev => prev + 1); // Force la réinitialisation complète du MediaUploader
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding hanoukia:', error);
      setErrorMessage(error.message || 'Erreur lors de l\'ajout de la hanoukia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-hanoukia">
      <h2>Ajouter une Hanoukia</h2>

      <div className="next-number-display">
        <span className="label">Numéro de la prochaine hanoukia :</span>
        <span className="number">Hanoukia {nextNumber}</span>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-section">
          <label className="form-label">
            Images de la hanoukia *
          </label>
          <MediaUploader key={uploaderKey} onImagesChange={handleImagesChange} />
        </div>

        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || imageFiles.length === 0}
          >
            {isSubmitting ? 'Ajout en cours...' : `Ajouter Hanoukia ${nextNumber}`}
          </button>
        </div>
      </form>

      <div className="form-info">
        <p>
          💡 Les images seront uploadées sur le serveur.
        </p>
      </div>
    </div>
  );
};

export default AddHanoukia;
