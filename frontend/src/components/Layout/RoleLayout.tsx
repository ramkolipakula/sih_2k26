import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Shield, ChevronDown, Sparkles } from 'lucide-react';
import Sidebar from '../Sidebar';

export const RoleLayout: React.FC = () => {
  const user = {
    name: 'Dr. Sharma',
    role: 'Technical Officer',
    organization: 'CMPDI Regional Institute VII',
    initials: 'DS'
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/admin/dashboard') {
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ai-copilot?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="app-container">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Execution Area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="flex items-center gap-3">
              <img
                src="/brand/strata-logo.png"
                alt="STRATA Mining Intelligence"
                style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
              />
              <span className="org-tag" style={{ border: '1px solid var(--border-light)', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.6875rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px' }}>
                CMPDI / CIL
              </span>
            </div>

            {/* Global Search */}
            <form onSubmit={handleSearchSubmit} className="global-search">
              <Search size={15} className="text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Search projects, boreholes, reports, documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Topbar Right - Actions & User Profile */}
          <div className="flex items-center gap-3">
            {/* AI Copilot Quick Launch */}
            <button
              onClick={() => navigate('/ai-copilot')}
              className="btn btn-outline btn-sm flex items-center gap-1.5"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                borderColor: '#06B6D4',
                color: '#0891B2',
                backgroundColor: '#ECFEFF',
                padding: '4px 10px'
              }}
              title="Launch STRATA AI Copilot"
            >
              <Sparkles size={13} style={{ color: '#06B6D4' }} />
              <span>AI Copilot</span>
            </button>

            {/* System Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                fontSize: '0.6875rem',
                fontWeight: 600
              }}
              title="Technical Evidence Index & Database connection active"
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  display: 'inline-block'
                }}
              />
              <span>System Online</span>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost"
                style={{
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  borderRadius: '8px',
                  position: 'relative'
                }}
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View notifications"
              >
                <Bell size={18} className="text-muted" />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-danger)',
                    border: '1.5px solid #FFFFFF'
                  }}
                />
              </button>

              {showNotifications && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '320px',
                    zIndex: 40,
                    padding: '14px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-semibold text-xs text-primary">System Notifications</span>
                    <span className="text-xs text-muted">2 unread</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div
                      className="p-2 rounded bg-muted hover:bg-hover cursor-pointer"
                      onClick={() => { setShowNotifications(false); navigate('/validation'); }}
                    >
                      <div className="text-xs font-semibold text-primary">Discrepancy Flagged</div>
                      <div className="text-xs text-secondary mt-0.5">Borehole density discrepancy in Jharia Block II.</div>
                      <div className="text-xs text-subtle mt-1">20m ago</div>
                    </div>
                    <div
                      className="p-2 rounded bg-muted hover:bg-hover cursor-pointer"
                      onClick={() => { setShowNotifications(false); navigate('/reports'); }}
                    >
                      <div className="text-xs font-semibold text-primary">Report Draft Ready</div>
                      <div className="text-xs text-secondary mt-0.5">Talcher Coalfield Sector B Draft compiled.</div>
                      <div className="text-xs text-subtle mt-1">1h ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              style={{
                paddingLeft: '14px',
                borderLeft: '1px solid var(--border-light)'
              }}
              onClick={() => navigate('/settings')}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {user.role}
                </div>
              </div>

              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 1px 3px rgba(37, 99, 235, 0.25)'
                }}
              >
                {user.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="content-scroll">
          <div className="content-max-width">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleLayout;
