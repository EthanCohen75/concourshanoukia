import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import router from './router';

function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </AppProvider>
  );
}

export default App;
