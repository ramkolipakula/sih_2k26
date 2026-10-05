import { useState, useEffect } from 'react';
import { fetchDocuments } from '../api';
import DocumentDetail from './DocumentDetail';
import { FileText, Search, Filter, UploadCloud, X } from 'lucide-react';

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
    }).catch(() => {
      // Mock data if API fails
      setDocs([
        { id: '1', title: 'Talcher Coalfield - Geological Report', document_type: 'Geological Report', organization: 'CMPDI RI-I', project: 'Talcher', mine: '', year: 2024, file_type: 'PDF', page_count: 142, status: 'INDEXED', uploaded_at: '2024-03-12', description: '' },
        { id: '2', title: 'Jharia Block II Exploration Data', document_type: 'Exploration Data', organization: 'BCCL', project: 'Jharia', mine: '', year: 2024, file_type: 'XLSX', page_count: 5, status: 'INDEXED', uploaded_at: '2024-03-10', description: '' },
      ]);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Document Intelligence</h1>
          <p className="page-subtitle">Ingest, search, and extract intelligence from technical documents.</p>
        </div>
        <button className="btn btn-primary"><UploadCloud size={16}/> Upload Document</button>
      </div>

      <div className="card mb-6 p-4 flex flex-wrap gap-4 items-center">
        <div className="global-search flex-1" style={{ minWidth: '250px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search documents by title or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select className="form-control" style={{ width: '180px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Document Types</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="form-control" style={{ width: '140px' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(filterType || filterYear || search) && (
            <button
              onClick={() => { setFilterType(''); setFilterYear(''); setSearch(''); }}
              className="btn btn-outline"
            >
              <X size={16}/> Clear
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading documents...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted">No documents found matching the applied filters.</div>
        ) : (
          <div className="table-container">
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
                    className="cursor-pointer"
                    onClick={() => setSelected(doc)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-muted" />
                        <div className="flex flex-col">
                           <span className="font-medium text-text-primary">{doc.title}</span>
                           <span className="text-xs text-muted mt-1">{doc.file_type || 'PDF'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary">{doc.document_type}</td>
                    <td className="text-secondary">{doc.organization}</td>
                    <td className="text-secondary">{doc.year}</td>
                    <td className="text-secondary">{doc.page_count}</td>
                    <td>
                      <span className={`badge ${doc.status === 'INDEXED' ? 'badge-green' : 'badge-amber'}`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
