
import { useState, useEffect } from 'react';
import { fetchDocuments } from '../api';

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetchDocuments().then(res => setDocs(res.data));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Document Library</h2>
        <button className="btn-primary">Upload Document</button>
      </div>
      
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Type</th>
              <th>Organization</th>
              <th>Year</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, idx) => (
              <tr key={idx} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 500 }}>{doc.title}</td>
                <td>{doc.document_type}</td>
                <td>{doc.organization}</td>
                <td>{doc.year}</td>
                <td>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-orange)', backgroundColor: '#FFF8F0', padding: '4px 8px', borderRadius: '4px' }}>
                    {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
