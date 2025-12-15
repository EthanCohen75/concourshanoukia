import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

/**
 * Hook to manage voter ID and voting functionality
 */
const useVoter = () => {
  const [voterId, setVoterId] = useState(null);

  useEffect(() => {
    // Get or create voter ID
    const id = storage.getVoterId();
    setVoterId(id);
  }, []);

  return voterId;
};

export default useVoter;
