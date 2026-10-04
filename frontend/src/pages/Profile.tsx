import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>User Profile</h2>
      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'var(--accent-orange)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold'
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.name}</h3>
            <div style={{ color: 'var(--text-secondary)' }}>{user.designation}</div>
          </div>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</div>
            <div style={{ fontWeight: 500 }}>{user.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role</div>
            <div style={{ fontWeight: 500 }}>{user.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Department</div>
            <div style={{ fontWeight: 500 }}>{user.department}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</div>
            <div style={{ fontWeight: 500, color: '#2E7D32' }}>Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
