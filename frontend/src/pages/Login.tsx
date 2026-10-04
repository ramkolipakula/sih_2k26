import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { login } from '../api';

export default function Login() {
  const [email, setEmail] = useState('admin@cmpdi-demo.in');
  const [password, setPassword] = useState('Admin@123');
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
        </div>
      </div>
    </div>
  );
}
