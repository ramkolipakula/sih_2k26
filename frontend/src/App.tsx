import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import ProposalView from './pages/ProposalView'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProposals from './pages/admin/AdminProposals'
import AdminProposalDetail from './pages/admin/AdminProposalDetail'
import AdminReviewQueue from './pages/admin/AdminReviewQueue'
import AdminKnowledgeBase from './pages/admin/AdminKnowledgeBase'
import AdminSystemHealth from './pages/admin/AdminSystemHealth'

function RoleSwitcher() {
  const { role, setRole } = useAuth();
  return (
    <div style={{ marginTop: 'auto', marginBottom: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>MOCK AUTH ROLE</div>
      <select 
        value={role} 
        onChange={e => setRole(e.target.value as 'USER' | 'ADMIN')}
        style={{ width: '100%', padding: '6px', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }}
      >
        <option value="USER">Applicant</option>
        <option value="ADMIN">Admin / Reviewer</option>
      </select>
    </div>
  )
}

function Sidebar() {
  const { isAdmin } = useAuth();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">R&D Tribunal</div>
      <div className="sidebar-subtitle">
        {isAdmin ? 'ADMIN CONSOLE' : 'AI PROPOSAL EVALUATION'}
      </div>
      
      <nav className="sidebar-nav">
        {!isAdmin ? (
          <>
            <NavLink to="/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/proposals/new" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📤 Upload Proposal
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/admin" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📊 Overview
            </NavLink>
            <NavLink to="/admin/proposals" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📁 Proposals
            </NavLink>
            <NavLink to="/admin/review" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              ⚖️ Review Queue
            </NavLink>
            <NavLink to="/admin/knowledge" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              📚 Knowledge Base
            </NavLink>
            <NavLink to="/admin/system" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              ⚙️ System Health
            </NavLink>
          </>
        )}
      </nav>
      
      <RoleSwitcher />
      
      <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>
        v2.0 — Multi-Agent Tribunal
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            {/* Applicant Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/proposals/new" element={<Upload />} />
            <Route path="/proposals/:id/*" element={<ProposalView />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/proposals" element={<AdminProposals />} />
            <Route path="/admin/proposals/:id/*" element={<AdminProposalDetail />} />
            <Route path="/admin/review" element={<AdminReviewQueue />} />
            <Route path="/admin/knowledge" element={<AdminKnowledgeBase />} />
            <Route path="/admin/system" element={<AdminSystemHealth />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
