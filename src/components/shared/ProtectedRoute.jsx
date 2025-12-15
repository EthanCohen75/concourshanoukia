import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useContext(AdminContext);

  useEffect(() => {
    // Verify authentication on mount
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
