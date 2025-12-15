import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Hook to access hanoukiot data and methods
 */
const useHanoukiot = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useHanoukiot must be used within AppProvider');
  }

  return context;
};

export default useHanoukiot;
