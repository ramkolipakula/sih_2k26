import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';

const roleNavMap: Record<string, {name: string, path: string, icon?: string}[]> = {
  ADMIN: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Reports', path: '/reports', icon: '📝' },
    { name: 'Data Sources', path: '/data-sources', icon: '🗄️' },
    { name: 'Tasks', path: '/tasks', icon: '✅' },
  ],
};

export default function RoleLayout() {
  const user = { name: 'Admin', role: 'ADMIN', designation: 'System Administrator' };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
     if(location.pathname === '/') {
        navigate('/admin/dashboard');
     }
  }, [location, navigate]);

  const handleLogout = () => {
    // Auth is disabled
    console.log("Auth is disabled.");
  };

  const navItems = user ? (roleNavMap[user.role] || []) : [];

  return (
    <div className="app-container">
      {/* Dynamic Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '24px 20px' }}>
          <div className="sidebar-logo">
            <span style={{ color: 'var(--accent-orange)', fontSize: '1.2rem', marginRight: '8px' }}>▲</span>
            CMPDI<span style={{color: 'var(--accent-orange)'}}> Copilot</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 'bold' }}>
            {user?.role.replace('_', ' ')} PORTAL
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              <span className="nav-link-icon">👤</span> Profile
            </Link>
            <button className="nav-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span className="nav-link-icon"><LogOut size={18} /></span>
              Logout
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <div className="main-area">
        <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="top-bar-title" style={{ fontSize: '1rem', fontWeight: 600 }}>
             Mining Intelligence & Reporting Copilot
          </div>
          <div className="user-profile" style={{ marginRight: '24px' }}>
            <div className="user-info" style={{ textAlign: 'right' }}>
               <div className="user-name" style={{ color: 'var(--text-primary)' }}>{user?.name}</div>
               <div className="user-role" style={{ color: 'var(--text-muted)' }}>{user?.designation}</div>
            </div>
            <div className="user-avatar" style={{ background: 'var(--accent-orange)', color: 'white', fontWeight: 'bold' }}>
               {user?.name.charAt(0)}
            </div>
          </div>
        </div>
        <div className="content-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
