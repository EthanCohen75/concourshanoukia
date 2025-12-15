import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import DeleteModal from './DeleteModal';
import useHanoukiaManager from './useHanoukiaManager';

const HanoukiaManager = () => {
  const {
    hanoukiot,
    deleteConfirm,
    isDeleting,
    handleDragEnd,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useHanoukiaManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (hanoukiot.length === 0) {
    return (
      <div className="manager-empty">
        <p>Aucune hanoukia à gérer</p>
      </div>
    );
  }

  return (
    <div className="hanoukia-manager">
      <h2>Gérer les Hanoukiot</h2>

      <div className="manager-info">
        <p>Glissez-déposez pour réorganiser l'ordre d'affichage</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={hanoukiot.map(h => h.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="sortable-list">
            {hanoukiot.map((hanoukia) => (
              <SortableItem
                key={hanoukia.id}
                hanoukia={hanoukia}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DeleteModal
        hanoukia={deleteConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HanoukiaManager;
