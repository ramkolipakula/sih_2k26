import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import RoleLayout from './components/Layout/RoleLayout';

import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AICopilot from './pages/AICopilot';
import Validation from './pages/Validation';
import HistoricalKnowledge from './pages/HistoricalKnowledge';
import GeologicalIntelligence from './pages/GeologicalIntelligence';
import MiningAnalytics from './pages/MiningAnalytics';
import AuditTrail from './pages/AuditTrail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="documents" element={<Documents />} />
            <Route path="geological-intelligence" element={<GeologicalIntelligence />} />
            <Route path="mining-analytics" element={<MiningAnalytics />} />
            <Route path="historical-knowledge" element={<HistoricalKnowledge />} />
            <Route path="ai-copilot" element={<AICopilot />} />
            <Route path="validation" element={<Validation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit-trail" element={<AuditTrail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="search" element={<Search />} />

            {/* Legacy redirect */}
            <Route path="admin/dashboard" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
