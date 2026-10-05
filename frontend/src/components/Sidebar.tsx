import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileSearch,
  Map,
  BarChart3,
  History,
  Bot,
  CheckSquare2,
  FileText,
  ShieldAlert,
  Settings,
  LogOut,
  Building2
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const workspaceNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
  { name: 'Documents', path: '/documents', icon: <FileSearch size={18} /> },
];

const intelligenceNavItems: NavItem[] = [
  { name: 'Geological Intelligence', path: '/geological-intelligence', icon: <Map size={18} /> },
  { name: 'Mining Analytics', path: '/mining-analytics', icon: <BarChart3 size={18} /> },
  { name: 'Historical Knowledge', path: '/historical-knowledge', icon: <History size={18} /> },
  { name: 'AI Copilot', path: '/ai-copilot', icon: <Bot size={18} />, badge: 'AI' },
];

const reportingNavItems: NavItem[] = [
  { name: 'Review & Validation', path: '/validation', icon: <CheckSquare2 size={18} /> },
  { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
  { name: 'Audit Trail', path: '/audit-trail', icon: <ShieldAlert size={18} /> },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const handleLogout = () => {
    // Graceful signout or demo reset
    console.log("CMPDI Session active for Dr. Sharma");
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '4px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            <img
              src="/brand/strata-logo.png"
              alt="STRATA"
              style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              STRATA
            </span>
            <span style={{ fontSize: '0.625rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Mining Intelligence
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: '#94A3B8',
            backgroundColor: '#1E293B',
            padding: '2px 5px',
            borderRadius: '4px',
            border: '1px solid #334155'
          }}
        >
          CIL
        </span>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Workspace</div>
        {workspaceNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-link-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div className="nav-section-title">Intelligence</div>
        {intelligenceNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-link-icon">{item.icon}</span>
            <span>{item.name}</span>
            {item.badge && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(37, 99, 235, 0.3)',
                  color: '#93C5FD',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(147, 197, 253, 0.3)'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-title">Reporting & Governance</div>
        {reportingNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-link-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-link-icon"><Settings size={18} /></span>
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
          title="Sign out of CMPDI session"
        >
          <span className="nav-link-icon"><LogOut size={18} /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
