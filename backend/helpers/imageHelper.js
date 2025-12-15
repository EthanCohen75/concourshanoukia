const fs = require('fs').promises;
const path = require('path');

/**
 * Helpers pour la gestion des images
 */
const imageHelper = {
  /**
   * Supprimer les fichiers images d'une hanoukia
   */
  async deleteHanoukiaImages(hanoukia) {
    const deletedFiles = [];
    const errors = [];

    for (const image of hanoukia.images) {
      try {
        const imagePath = path.join(__dirname, '../uploads', image.filename);
        await fs.unlink(imagePath);
        deletedFiles.push(image.filename);
      } catch (err) {
        console.error(`Error deleting image file ${image.filename}:`, err);
        errors.push({ filename: image.filename, error: err.message });
      }
    }

    return { deletedFiles, errors };
  }
};

module.exports = imageHelper;
