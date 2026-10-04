import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { login } from '../api';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@cmpdi-demo.in', pass: 'Admin@123', color: '#1a1f2b' },
  { role: 'Management', email: 'management@cmpdi-demo.in', pass: 'Management@123', color: '#2c3e50' },
  { role: 'Geologist', email: 'geologist@cmpdi-demo.in', pass: 'Geologist@123', color: '#8e44ad' },
  { role: 'Mining Engineer', email: 'mining.engineer@cmpdi-demo.in', pass: 'Mining@123', color: '#d35400' },
  { role: 'Reporting Officer', email: 'reporting@cmpdi-demo.in', pass: 'Reporting@123', color: '#27ae60' },
  { role: 'Data Analyst', email: 'analyst@cmpdi-demo.in', pass: 'Analyst@123', color: '#2980b9' }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await login({ email, password });
      if (res.success) {
        loginUser(res.data.user, res.data.token);
        
        // redirect to requested page or default dashboard
        const from = (location.state as any)?.from?.pathname;
        if (from && from !== '/' && from !== '/login') {
            navigate(from);
        } else {
            // route based on role
            switch(res.data.user.role) {
                case 'ADMIN': navigate('/admin/dashboard'); break;
                case 'MANAGEMENT': navigate('/management/dashboard'); break;
                case 'GEOLOGIST': navigate('/geologist/dashboard'); break;
                case 'MINING_ENGINEER': navigate('/mining/dashboard'); break;
                case 'REPORTING_OFFICER': navigate('/reporting/dashboard'); break;
                case 'DATA_ANALYST': navigate('/analyst/dashboard'); break;
                default: navigate('/');
            }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (email: string, pass: string) => {
    setEmail(email);
    setPassword(pass);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Left branding panel */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #1a1f2b 0%, #2c3e50 100%)', 
        padding: '60px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ marginBottom: 'auto' }}>
          <div className="logo" style={{ color: 'white' }}>
            <span className="logo-icon" style={{ color: 'var(--accent-orange)' }}>▲</span>
            <h1>CMPDI<span style={{color: 'var(--accent-orange)'}}> Copilot</span></h1>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 700 }}>
            Mining Intelligence <br />& Reporting Portal
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#a0aec0', lineHeight: 1.6, maxWidth: '500px' }}>
            A unified AI-powered ecosystem for CMPDI/CIL subsidiaries to manage geological data, track mining operations, and streamline reporting workflows.
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Sign in to access your portal</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <div style={{ color: '#e74c3c', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
            
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Section */}
          <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
              Demo Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => autofill(acc.email, acc.pass)}
                  style={{
                    background: 'white',
                    border: `1px solid ${acc.color}40`,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: acc.color,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = `${acc.color}10`}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: acc.color }}></div>
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
