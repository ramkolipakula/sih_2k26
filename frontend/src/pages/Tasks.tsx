import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks().then(res => {
      setTasks(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My Tasks</h2>
      {loading ? (
         <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
         <p>No tasks assigned.</p>
      ) : (
        <div className="grid grid-cols-3">
          {tasks.map((t, idx) => (
            <div className="card" key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.priority} Priority</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: t.status === 'COMPLETED' ? '#2E7D32' : 'var(--accent-orange)' }}>
                  {t.status}
                </span>
              </div>
              <h4 style={{ marginBottom: '8px' }}>{t.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
