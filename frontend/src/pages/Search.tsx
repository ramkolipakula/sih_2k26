import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

type Source = {
  document_id: string;
  title: string;
  similarity: number;
  page: number;
  section: string;
  content: string;
  organization: string;
  year: number;
  document_type: string;
  verified: boolean;
};

type SearchResult = {
  answer: string;
  sources: Source[];
};

const DEMO_CHIPS = [
  'What was the coal production at Jharia in 2023?',
  'Show exploration projects in Odisha',
  'Generate a mine plan summary for BCCL',
  'Environmental monitoring findings for Jharia',
  'Compare production trends 2020 to 2024',
];

import { useAuth } from '../AuthContext';

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      executeSearch(q, '', '');
    }
  }, [location.search]);

  const executeSearch = async (q: string, type: string, year: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);

    // Build Supabase query — search across title, description, organization, mine, project
    let dbQuery = supabase
      .from('documents')
      .select('*')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,organization.ilike.%${q}%,mine.ilike.%${q}%,project.ilike.%${q}%`)
      .limit(8);

    if (type) dbQuery = dbQuery.eq('document_type', type);
    if (year) dbQuery = dbQuery.eq('year', parseInt(year));

    const { data: docs } = await dbQuery;

    const sources: Source[] = (docs || []).map((d: any, idx: number) => ({
      document_id: d.id,
      title: d.title,
      similarity: Math.max(0.75, 0.98 - idx * 0.04),
      page: Math.floor(Math.random() * (d.page_count || 50)) + 1,
      section: 'Executive Summary',
      content: d.description || `Key findings from ${d.title} covering ${d.mine || d.project || 'the project'} for ${d.year}.`,
      organization: d.organization,
      year: d.year,
      document_type: d.document_type,
      verified: d.status === 'INDEXED',
    }));

    // Derive a demo contextual answer
    let answer = '';
    if (sources.length === 0) {
      answer = 'Insufficient verified evidence was found in the indexed documents for this query. Try broader terms.';
    } else if (q.toLowerCase().includes('production') || q.toLowerCase().includes('jharia')) {
      answer = `Based on ${sources.length} indexed documents, coal production at Jharia showed consistent growth. The Jharia Coalfield Geological Report 2023 indicates an 18% increase over the period, driven by improved mechanisation and favourable seam conditions.`;
    } else if (q.toLowerCase().includes('odisha') || q.toLowerCase().includes('exploration')) {
      answer = `Found ${sources.length} documents related to Odisha exploration activities. The Odisha Block survey data shows 4 active deep-seam exploration projects, with preliminary drilling results indicating commercially viable reserves.`;
    } else if (q.toLowerCase().includes('bccl') || q.toLowerCase().includes('mine plan')) {
      answer = `${sources.length} BCCL documents retrieved. The mine planning summary indicates a target output of 40 MT for FY2024-25. Underground operations are being supplemented by surface mining to meet targets.`;
    } else if (q.toLowerCase().includes('environment') || q.toLowerCase().includes('monitoring')) {
      answer = `${sources.length} environmental monitoring documents found. All monitored parameters remain within CPCB-prescribed limits. Air quality indices across Jharia meet national standards as per the latest reporting period.`;
    } else {
      answer = `Found ${sources.length} relevant documents matching your query. Key findings suggest operational activities are progressing as per plan across the referenced mine sites and projects.`;
    }

    setResult({ answer, sources });
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, filterType, filterYear);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Search & Analyze</h2>

      {/* Search form */}
      <form onSubmit={handleSearch} className="hero-search" style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder={user?.role === 'GEOLOGIST' ? 'Search geological and exploration information...' :
                       user?.role === 'MINING_ENGINEER' ? 'Search mining and production information...' :
                       user?.role === 'REPORTING_OFFICER' ? 'Find evidence for report preparation...' :
                       user?.role === 'MANAGEMENT' ? 'Ask questions about projects, production and reports...' :
                       user?.role === 'DATA_ANALYST' ? 'Analyze documents, data quality and trends...' :
                       'Ask a question about CMPDI/CIL reports...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary">Analyze</button>
      </form>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select className="form-select" style={{ maxWidth: '200px' }} value={filterType} onChange={e => { setFilterType(e.target.value); }}>
          <option value="">All Document Types</option>
          <option>Geological Report</option>
          <option>Mining Report</option>
          <option>Exploration Data</option>
          <option>Environmental Report</option>
          <option>Technical Report</option>
        </select>
        <select className="form-select" style={{ maxWidth: '140px' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
          <option value="">All Years</option>
          {['2024', '2023', '2022', '2021'].map(y => <option key={y}>{y}</option>)}
        </select>
        {(filterType || filterYear) && (
          <button onClick={() => { setFilterType(''); setFilterYear(''); }} style={{ padding: '8px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
            Clear
          </button>
        )}
      </div>

      {/* Example chips */}
      {!result && !loading && (
        <div className="chip-container" style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Try asking:</span>
          {DEMO_CHIPS.map(chip => (
            <div key={chip} className="chip" onClick={() => { setQuery(chip); executeSearch(chip, filterType, filterYear); }}>
              {chip}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
          Searching indexed documents and building evidence-backed answer...
        </div>
      )}

      {result && !loading && (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Answer panel */}
          <div>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.2rem' }}>✨</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Generated Answer</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Based on {result.sources.length} indexed documents
                </span>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '0' }}>
                {result.answer}
              </p>
            </div>

            {/* Source results */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
              Source Documents ({result.sources.length} found)
            </h3>
            {result.sources.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No matching documents found in the indexed knowledge base.
              </div>
            ) : (
              result.sources.map((src, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{src.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {src.organization} • {src.document_type} • {src.year} • Page {src.page} • {src.section}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        color: src.verified ? '#2E7D32' : '#C46A24',
                        backgroundColor: src.verified ? '#E8F5E9' : '#FFF8F0',
                        padding: '3px 8px', borderRadius: '4px'
                      }}>
                        {src.verified ? '✓ Verified' : 'Unverified'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Relevance: {(src.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.88rem', fontStyle: 'italic',
                    borderLeft: '3px solid var(--accent-orange)',
                    paddingLeft: '12px', color: 'var(--text-secondary)', lineHeight: 1.6
                  }}>
                    "{src.content}"
                  </div>
                  <button style={{
                    marginTop: '12px', background: 'none', border: '1px solid var(--border-color)',
                    borderRadius: '4px', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}>
                    View Source Document →
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right panel: filters + search context */}
          <div style={{ alignSelf: 'start' }}>
            <div className="card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>Refine Search</h4>
              <div className="form-group">
                <label className="form-label">Document Type</label>
                <select className="form-select" value={filterType} onChange={e => { setFilterType(e.target.value); executeSearch(query, e.target.value, filterYear); }}>
                  <option value="">All Types</option>
                  <option>Geological Report</option>
                  <option>Mining Report</option>
                  <option>Exploration Data</option>
                  <option>Environmental Report</option>
                  <option>Technical Report</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select className="form-select" value={filterYear} onChange={e => { setFilterYear(e.target.value); executeSearch(query, filterType, e.target.value); }}>
                  <option value="">All Years</option>
                  {['2024', '2023', '2022', '2021'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="ai-insight" style={{ marginTop: '8px' }}>
                <div className="ai-insight-title">ℹ️ Demo Mode</div>
                <div className="ai-insight-text" style={{ fontSize: '0.8rem' }}>
                  Search results are retrieved from Supabase. Similarity scores and AI answers use demo logic. Connect a real RAG pipeline to replace this layer.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
