import { useState, useEffect } from 'react';
import { fetchDocuments } from '../api';
import DocumentDetail from './DocumentDetail';

type Doc = {
  id: string;
  title: string;
  document_type: string;
  organization: string;
  project: string;
  mine: string;
  year: number;
  file_type: string;
  page_count: number;
  status: string;
  uploaded_at: string;
  description: string;
};

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Doc | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDocuments().then(res => {
      setDocs(res.data);
      setLoading(false);
    });
  }, []);

  if (selected) {
    return <DocumentDetail doc={selected} onBack={() => setSelected(null)} />;
  }

  const filtered = docs.filter(d => {
    const matchType = filterType ? d.document_type === filterType : true;
    const matchYear = filterYear ? String(d.year) === filterYear : true;
    const matchSearch = search
      ? d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(search.toLowerCase())
      : true;
    return matchType && matchYear && matchSearch;
  });

  const docTypes = [...new Set(docs.map(d => d.document_type))];
  const years = [...new Set(docs.map(d => String(d.year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Document Library</h2>
        <button className="btn-primary">Upload Document</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ maxWidth: '300px' }}
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-select" style={{ maxWidth: '200px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: '160px' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {(filterType || filterYear || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterYear(''); setSearch(''); }}
            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading documents...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No documents found matching filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Type</th>
                <th>Organization</th>
                <th>Year</th>
                <th>Pages</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(doc)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`doc-type-icon ${doc.document_type === 'Exploration Data' ? 'doc-type-xls' : 'doc-type-pdf'}`}>
                        {doc.file_type || 'PDF'}
                      </span>
                      <span style={{ fontWeight: 500 }}>{doc.title}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.document_type}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.organization}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.year}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.page_count}</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600,
                      color: doc.status === 'INDEXED' ? '#2E7D32' : 'var(--accent-orange)',
                      backgroundColor: doc.status === 'INDEXED' ? '#E8F5E9' : '#FFF8F0',
                      padding: '4px 8px', borderRadius: '4px'
                    }}>
                      {doc.status}
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
