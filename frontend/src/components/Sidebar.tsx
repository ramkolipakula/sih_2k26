
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          CMPDI<br/>
          <span>Coal India Limited</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">🏠</span> Dashboard
        </NavLink>
        <NavLink to="/search" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">🔍</span> Search & Analyze
        </NavLink>
        <NavLink to="/documents" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">📄</span> Documents
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">📊</span> Reports
        </NavLink>
        <NavLink to="/data-sources" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">🗄️</span> Data Sources
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">☑️</span> My Tasks
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-link-icon">⚙️</span> Settings
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <span className="user-name">Welcome, User</span>
            <span className="user-role">Geologist / Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
