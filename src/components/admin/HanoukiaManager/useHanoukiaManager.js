import { useState, useContext } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import useHanoukiot from '../../../hooks/useHanoukiot';
import { AdminContext } from '../../../context/AdminContext';

const useHanoukiaManager = () => {
  const { getSortedHanoukiot, reorderHanoukiot, deleteHanoukia } = useHanoukiot();
  const { getAdminCode } = useContext(AdminContext);
  const [hanoukiot, setHanoukiot] = useState(getSortedHanoukiot());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setIsReordering(true);

      const oldIndex = hanoukiot.findIndex((item) => item.id === active.id);
      const newIndex = hanoukiot.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(hanoukiot, oldIndex, newIndex);
      setHanoukiot(reordered);

      try {
        const adminCode = getAdminCode();
        await reorderHanoukiot(reordered, adminCode);
      } catch (error) {
        console.error('Error reordering hanoukiot:', error);
        setHanoukiot(getSortedHanoukiot());
      } finally {
        setIsReordering(false);
      }
    }
  };

  const handleDelete = (hanoukia) => {
    setDeleteConfirm(hanoukia);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      setIsDeleting(true);

      try {
        const adminCode = getAdminCode();
        await deleteHanoukia(deleteConfirm.id, adminCode);
        setHanoukiot(getSortedHanoukiot());
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting hanoukia:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return {
    hanoukiot,
    deleteConfirm,
    isReordering,
    isDeleting,
    handleDragEnd,
    handleDelete,
    confirmDelete,
    cancelDelete,
  };
};

export default useHanoukiaManager;
