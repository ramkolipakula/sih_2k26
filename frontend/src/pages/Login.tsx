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
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ marginBottom: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
              <img
                src="/brand/strata-logo.png"
                alt="STRATA Logo"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.05em', color: '#FFFFFF' }}>STRATA</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.04em' }}>Mining Intelligence</div>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#38BDF8',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              CMPDI / CIL Evaluation Prototype
            </span>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', fontWeight: 700, lineHeight: 1.25, color: '#FFFFFF' }}>
            AI-Assisted Technical Intelligence & Reporting
          </h2>
          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '520px' }}>
            AI-powered technical intelligence and reporting for geological and mining workflows across CMPDI and CIL subsidiaries.
          </p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '12px', color: '#64748B' }}>
          SIH 2026 National Prototype • SIH26023
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#0F172A', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: '#64748B', marginBottom: '32px', fontSize: '14px' }}>Sign in to access your intelligence workspace</p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div style={{ color: '#DC2626', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 16px', fontSize: '14px', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
