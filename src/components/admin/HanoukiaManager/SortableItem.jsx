import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../../services/api';

const SortableItem = ({ hanoukia, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: hanoukia.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const thumbnail = hanoukia.images[0]?.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
        </svg>
      </div>

      <div className="item-content">
        {thumbnail && (
          <img
            src={api.getImageUrl(thumbnail)}
            alt={`Hanoukia ${hanoukia.number}`}
            className="item-thumbnail"
          />
        )}
        <div className="item-info">
          <strong>Hanoukia {hanoukia.number}</strong>
          <span className="item-meta">
            {hanoukia.images.length} {hanoukia.images.length === 1 ? 'image' : 'images'}
            • {hanoukia.votes.length} {hanoukia.votes.length === 1 ? 'note' : 'notes'}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(hanoukia)}
        aria-label="Supprimer"
      >
        🗑️
      </button>
    </div>
  );
};

export default SortableItem;
