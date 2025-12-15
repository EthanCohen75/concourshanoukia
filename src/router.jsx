import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HanoukiaGallery from './components/visitor/HanoukiaGallery';
import AdminAuth from './components/admin/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';

const ProtectedAdminDashboard = () => (
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HanoukiaGallery
      },
      {
        path: 'admin',
        Component: AdminAuth
      },
      {
        path: 'admin/dashboard',
        Component: ProtectedAdminDashboard
      }
    ]
  }
]);

export default router;
