import { useState, useEffect } from 'react';
import { fetchDataSources } from '../api';

export default function DataSources() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataSources().then(res => {
      setSources(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Data Sources</h2>
      <div className="card">
        {loading ? (
           <p>Loading data sources...</p>
        ) : sources.length === 0 ? (
           <p>No data sources found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Source Name</th>
                <th>Category</th>
                <th>Document Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.source_type}</td>
                  <td>{s.document_count}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-orange)', backgroundColor: '#FFF8F0', padding: '4px 8px', borderRadius: '4px' }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
