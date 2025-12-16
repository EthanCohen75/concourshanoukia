const DeleteModal = ({ hanoukia, onConfirm, onCancel, isDeleting }) => {
  if (!hanoukia) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmer la suppression</h3>
        <p>
          Êtes-vous sûr de vouloir supprimer la <strong>Hanoukia {hanoukia.number}</strong> ?
        </p>
        <p className="warning-text">
          Cette action supprimera également toutes les notes associées ({hanoukia.votes.length} note
          {hanoukia.votes.length !== 1 ? 's' : ''}).
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={isDeleting}>
            Annuler
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
