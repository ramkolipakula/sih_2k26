import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import RoleLayout from './components/Layout/RoleLayout';

import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import DataSources from './pages/DataSources';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleLayout />}>
            {/* Admin Routes */}
            <Route path="admin/dashboard" element={<Dashboard />} />

            {/* Shared Routes */}
            <Route path="documents" element={<Documents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="search" element={<Search />} />
            <Route path="data-sources" element={<DataSources />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
