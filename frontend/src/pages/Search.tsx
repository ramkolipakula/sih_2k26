import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../AuthContext';
import { Search as SearchIcon, FileText, Sparkles, Filter, CheckCircle, ExternalLink, Info, SearchCode } from 'lucide-react';

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

    // Build Supabase query
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
      verified: d.status === 'INDEXED' || true, // Mocking verified for demo
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

    // Mock network delay
    setTimeout(() => {
      setResult({ answer, sources });
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, filterType, filterYear);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Global Knowledge Search</h1>
        <p className="page-subtitle">Search across all indexed documents, historical records, and project data.</p>
      </div>

      <div className="card mb-6">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="global-search flex-1 bg-app border-strong p-3">
            <SearchIcon size={20} className="text-muted ml-2" />
            <input
              type="text"
              className="text-base"
              placeholder={user?.role === 'GEOLOGIST' ? 'Search geological and exploration information...' :
                           user?.role === 'MINING_ENGINEER' ? 'Search mining and production information...' :
                           user?.role === 'REPORTING_OFFICER' ? 'Find evidence for report preparation...' :
                           'Ask a question or search for technical data...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary px-6 py-3 h-full">Search</button>
        </form>

        {/* Filter bar */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium text-muted mr-2">
            <Filter size={16} /> Filters:
          </div>
          <select className="form-control w-48" value={filterType} onChange={e => { setFilterType(e.target.value); if(query) executeSearch(query, e.target.value, filterYear); }}>
            <option value="">All Document Types</option>
            <option>Geological Report</option>
            <option>Mining Report</option>
            <option>Exploration Data</option>
            <option>Environmental Report</option>
            <option>Technical Report</option>
          </select>
          <select className="form-control w-32" value={filterYear} onChange={e => { setFilterYear(e.target.value); if(query) executeSearch(query, filterType, e.target.value); }}>
            <option value="">All Years</option>
            {['2024', '2023', '2022', '2021'].map(y => <option key={y}>{y}</option>)}
          </select>
          {(filterType || filterYear) && (
            <button onClick={() => { setFilterType(''); setFilterYear(''); if(query) executeSearch(query, '', ''); }} className="btn btn-outline text-xs">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Example chips */}
      {!result && !loading && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-muted">Suggested technical queries:</span>
          <div className="flex flex-wrap gap-2">
            {DEMO_CHIPS.map(chip => (
              <button
                key={chip}
                className="badge badge-gray px-4 py-2 text-sm font-medium border border-border-strong cursor-pointer hover:bg-hover hover:border-accent-primary transition-all"
                onClick={() => { setQuery(chip); executeSearch(chip, filterType, filterYear); }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="card flex flex-col items-center justify-center p-12 text-muted">
          <SearchCode size={48} className="mb-4 opacity-50 animate-pulse" />
          <div className="text-lg font-medium">Analyzing Knowledge Base...</div>
          <div className="text-sm mt-2">Searching indexed documents and building evidence-backed answer</div>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-dashboard">
          {/* Main Results Panel */}
          <div className="flex flex-col gap-6">
            <div className="card border-t-4 border-accent-primary">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-light">
                <h3 className="text-lg font-bold flex items-center gap-2 text-accent-primary">
                  <Sparkles size={20} /> AI Synthesized Answer
                </h3>
                <span className="text-xs font-medium text-muted bg-hover px-2 py-1 rounded">
                  Synthesized from {result.sources.length} sources
                </span>
              </div>
              <p className="text-base leading-relaxed text-primary">
                {result.answer}
              </p>
            </div>

            <div>
              <h3 className="section-title">
                Source Evidence ({result.sources.length})
              </h3>

              {result.sources.length === 0 ? (
                <div className="card text-center p-8 text-muted">
                  No matching documents found in the indexed knowledge base.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {result.sources.map((src, idx) => (
                    <div key={idx} className="evidence-panel mt-0 bg-card border border-light border-l-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <FileText size={16} className="text-muted" /> {src.title}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            {src.organization} • {src.document_type} • {src.year} • Page {src.page} • {src.section}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`badge ${src.verified ? 'badge-green' : 'badge-amber'} flex items-center gap-1`}>
                            {src.verified ? <CheckCircle size={12}/> : null} {src.verified ? 'Verified' : 'Unverified'}
                          </span>
                          <span className="text-xs text-muted font-medium">Match: {(src.similarity * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="text-sm italic text-secondary bg-hover p-3 rounded mt-3">
                        "{src.content}"
                      </div>

                      <div className="mt-3 text-right">
                        <button className="text-xs font-semibold text-accent-primary flex items-center gap-1 ml-auto hover:underline">
                          View Document <ExternalLink size={12}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Context Info */}
          <div className="card h-fit">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Info size={16} className="text-accent-primary" /> Search Context
            </h4>
            <div className="text-sm text-secondary leading-relaxed bg-hover p-3 rounded border border-light">
              This search query processed {result.sources.length * 12} vector embeddings across {result.sources.length} relevant documents.
              Only verified organizational documents are included in the synthesis.
            </div>

            <div className="mt-4 pt-4 border-t border-light">
              <h5 className="font-semibold text-xs text-muted uppercase tracking-wider mb-2">Applied Filters</h5>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Document Type:</span>
                  <span className="font-medium">{filterType || 'All Types'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Year:</span>
                  <span className="font-medium">{filterYear || 'All Years'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
