import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();
  
  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'MANAGEMENT': return '/management/dashboard';
      case 'GEOLOGIST': return '/geologist/dashboard';
      case 'MINING_ENGINEER': return '/mining/dashboard';
      case 'REPORTING_OFFICER': return '/reporting/dashboard';
      case 'DATA_ANALYST': return '/analyst/dashboard';
      default: return '/login';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ color: 'var(--accent-orange)', marginBottom: '16px' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          You do not have permission to view this page.
        </p>
        <Link to={getDashboardRoute()} className="btn-primary" style={{ textDecoration: 'none' }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
