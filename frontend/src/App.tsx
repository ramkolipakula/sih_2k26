import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import RoleLayout from './components/Layout/RoleLayout';

import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

import Search from './pages/Search';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import DataSources from './pages/DataSources';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <RoleLayout />
            </ProtectedRoute>
          }>
            {/* Admin Routes */}
            <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />

            {/* Shared Protected Routes */}
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
