import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HanoukiaGallery from './components/visitor/HanoukiaGallery';
import AdminAuth from './components/admin/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HanoukiaGallery />
      },
      {
        path: 'admin',
        element: <AdminAuth />
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;
