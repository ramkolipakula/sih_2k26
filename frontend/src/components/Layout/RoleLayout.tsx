import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Folder, FileText, FileSearch, Map, 
  BarChart2, History, Cpu, CheckSquare, List, Settings, 
  LogOut, Search, Bell, User 
} from 'lucide-react';
import { useEffect } from 'react';

const mainNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Projects', path: '/projects', icon: <Folder size={18} /> },
  { name: 'Documents', path: '/documents', icon: <FileSearch size={18} /> },
];

const intelligenceNavItems = [
  { name: 'Geological Intel', path: '/geological-intelligence', icon: <Map size={18} /> },
  { name: 'Mining Analytics', path: '/mining-analytics', icon: <BarChart2 size={18} /> },
  { name: 'Historical Data', path: '/historical-knowledge', icon: <History size={18} /> },
  { name: 'AI Copilot', path: '/ai-copilot', icon: <Cpu size={18} /> },
];

const reportingNavItems = [
  { name: 'Review & Validation', path: '/validation', icon: <CheckSquare size={18} /> },
  { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
  { name: 'Audit Trail', path: '/audit-trail', icon: <List size={18} /> },
];

export default function RoleLayout() {
  const user = { name: 'Dr. Sharma', role: 'Technical Officer', organization: 'CMPDI' };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
     if(location.pathname === '/' || location.pathname === '/admin/dashboard') {
        navigate('/dashboard');
     }
  }, [location, navigate]);

  const handleLogout = () => {
    console.log("Auth is disabled.");
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            CMPDI
            <span>Intelligence Platform</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title">Workspace</div>
          {mainNavItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="nav-section-title">Intelligence</div>
          {intelligenceNavItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="nav-section-title">Reporting & Governance</div>
          {reportingNavItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            <span className="nav-link-icon"><Settings size={18} /></span>
            <span>Settings</span>
          </Link>
          <button className="nav-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="nav-link-icon"><LogOut size={18} /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="main-area">
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="top-bar-title">
               Mining Intelligence & Reporting Copilot
            </div>
            <div className="global-search">
              <Search size={16} color="var(--text-muted)" />
              <input type="text" placeholder="Search projects, reports, documents..." />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3" style={{ paddingLeft: '16px', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                 {user.name.charAt(0)}
              </div>
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

