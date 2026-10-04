
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import DataSources from './pages/DataSources';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-area">
          <div className="top-bar">
            <div className="top-bar-title">Mining Intelligence & Reporting Copilot</div>
          </div>
          <div className="content-scroll">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
