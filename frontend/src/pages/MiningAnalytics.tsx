import { BarChart2, TrendingUp, Pickaxe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MiningAnalytics() {
  const mockData = [
    { name: 'Mine A', production: 4000, target: 4500 },
    { name: 'Mine B', production: 3000, target: 2800 },
    { name: 'Mine C', production: 2000, target: 2000 },
    { name: 'Mine D', production: 2780, target: 3000 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Mining Analytics</h1>
        <p className="page-subtitle">Production trends, resource estimates, and operational indicators.</p>
      </div>

      <div className="grid grid-cols-dashboard">
        <div className="card">
          <h3 className="section-title"><BarChart2 size={20} /> Production vs Target (Monthly)</h3>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-hover)'}} />
                <Bar dataKey="production" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} name="Actual Production" />
                <Bar dataKey="target" fill="var(--border-strong)" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card stat-card">
             <div className="stat-icon"><Pickaxe size={24} /></div>
             <div className="stat-info">
               <div className="stat-title">Total Excavation</div>
               <div className="stat-value">11.78M</div>
               <div className="text-xs text-muted mt-1">Cubic Meters (YTD)</div>
             </div>
          </div>
          
          <div className="card">
             <h3 className="section-title"><TrendingUp size={18} /> Operational Insight</h3>
             <div className="text-sm text-secondary leading-relaxed">
               Mine B has exceeded production targets by 7.1% due to improved fleet availability. However, stripping ratio at Mine A has increased from 2.1 to 2.4, requiring review of the mine plan.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
