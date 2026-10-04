import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import RoleLayout from './components/Layout/RoleLayout';

import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import ManagementDashboard from './pages/ManagementDashboard';
import GeologistDashboard from './pages/GeologistDashboard';
import MiningDashboard from './pages/MiningDashboard';
import ReportingDashboard from './pages/ReportingDashboard';
import AnalystDashboard from './pages/AnalystDashboard';
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
            <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><div>Users Management (Demo)</div></ProtectedRoute>} />
            
            {/* Management Routes */}
            <Route path="management/dashboard" element={<ProtectedRoute allowedRoles={['MANAGEMENT']}><ManagementDashboard /></ProtectedRoute>} />
            <Route path="management/projects" element={<ProtectedRoute allowedRoles={['MANAGEMENT']}><div>Projects View (Demo)</div></ProtectedRoute>} />
            
            {/* Geologist Routes */}
            <Route path="geologist/dashboard" element={<ProtectedRoute allowedRoles={['GEOLOGIST']}><GeologistDashboard /></ProtectedRoute>} />
            <Route path="geologist/exploration" element={<ProtectedRoute allowedRoles={['GEOLOGIST']}><div>Exploration Projects (Demo)</div></ProtectedRoute>} />
            
            {/* Mining Engineer Routes */}
            <Route path="mining/dashboard" element={<ProtectedRoute allowedRoles={['MINING_ENGINEER']}><MiningDashboard /></ProtectedRoute>} />
            <Route path="mining/production" element={<ProtectedRoute allowedRoles={['MINING_ENGINEER']}><div>Production View (Demo)</div></ProtectedRoute>} />
            
            {/* Reporting Officer Routes */}
            <Route path="reporting/dashboard" element={<ProtectedRoute allowedRoles={['REPORTING_OFFICER']}><ReportingDashboard /></ProtectedRoute>} />
            <Route path="reporting/reviews" element={<ProtectedRoute allowedRoles={['REPORTING_OFFICER']}><div>Review Queue (Demo)</div></ProtectedRoute>} />
            
            {/* Data Analyst Routes */}
            <Route path="analyst/dashboard" element={<ProtectedRoute allowedRoles={['DATA_ANALYST']}><AnalystDashboard /></ProtectedRoute>} />

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
