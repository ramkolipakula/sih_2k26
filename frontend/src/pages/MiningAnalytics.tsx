import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Pickaxe,
  Truck,
  Layers,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { DOMAIN_MINING_METRICS } from '../data/domainData';

export const MiningAnalytics: React.FC = () => {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All Subsidiaries');

  const { monthlyProduction, subsidiaryPerformance, kpiOverview } = DOMAIN_MINING_METRICS;

  // Excavation split trend data
  const excavationTrend = [
    { month: 'Oct', overburden: 1.35, coal: 0.52, strippingRatio: 2.59 },
    { month: 'Nov', overburden: 1.38, coal: 0.55, strippingRatio: 2.50 },
    { month: 'Dec', overburden: 1.45, coal: 0.61, strippingRatio: 2.37 },
    { month: 'Jan', overburden: 1.40, coal: 0.58, strippingRatio: 2.41 },
    { month: 'Feb', overburden: 1.42, coal: 0.60, strippingRatio: 2.36 },
    { month: 'Mar', overburden: 1.42, coal: 0.64, strippingRatio: 2.21 },
  ];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Mining Analytics"
        subtitle="Production telemetry, overburden excavation, stripping ratio optimization, and heavy fleet indicators."
        actions={
          <div className="flex items-center gap-3">
            <select
              className="form-control"
              style={{ width: '200px' }}
              value={selectedSubsidiary}
              onChange={e => setSelectedSubsidiary(e.target.value)}
            >
              <option value="All Subsidiaries">All CIL Subsidiaries</option>
              <option value="MCL Talcher">MCL (Talcher Coalfield)</option>
              <option value="BCCL Jharia">BCCL (Jharia Block II)</option>
              <option value="NCL Singrauli">NCL (Singrauli)</option>
              <option value="MCL Ib Valley">MCL (Ib Valley)</option>
            </select>
            <button className="btn btn-outline btn-md flex items-center gap-1.5" onClick={() => alert("Exporting Mining Analytics Summary")}>
              <Download size={15} /> Export Dataset
            </button>
          </div>
        }
      />

      {/* 4 Standardized KPI Cards */}
      <div className="grid grid-cols-4 mb-6">
        <MetricCard
          label="Total Excavation (YTD)"
          value={kpiOverview.totalExcavationYTD}
          subtext="+4.8% above MoU target"
          icon={<Pickaxe size={22} />}
          iconBgColor="#EFF6FF"
          iconColor="#2563EB"
        />
        <MetricCard
          label="ROM Coal Extracted"
          value={kpiOverview.coalExtracted}
          subtext="104.8% of planned output"
          icon={<Layers size={22} />}
          iconBgColor="#DCFCE7"
          iconColor="#16A34A"
        />
        <MetricCard
          label="Composite Stripping Ratio"
          value={kpiOverview.avgStrippingRatio}
          subtext={`Plan: ${kpiOverview.strippingRatioPlan} m³/t (OB : Coal)`}
          icon={<TrendingUp size={22} />}
          iconBgColor="#FEF3C7"
          iconColor="#D97706"
        />
        <MetricCard
          label="HEMM Fleet Availability"
          value={kpiOverview.fleetAvailability}
          subtext={`${kpiOverview.fleetUtilization} Fleet Utilization`}
          icon={<Truck size={22} />}
          iconBgColor="#F1F5F9"
          iconColor="#334155"
        />
      </div>

      {/* 2-Chart Responsive Visualizations (Full Height Utilization) */}
      <div className="grid grid-cols-dashboard gap-6 mb-6">
        {/* Production vs Target Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title text-base">
                <BarChart3 size={18} className="text-accent-primary" />
                Monthly Coal Production vs Target (kT)
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Actual extraction against planned CIL MoU target with volume variance
              </p>
            </div>
            <span className="badge badge-green">MoU Compliant</span>
          </div>

          <div style={{ height: '320px', width: '100%', marginTop: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyProduction}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }}
                />
                <Bar
                  dataKey="actual"
                  name="Actual Production (kT)"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="target"
                  name="Planned Target (kT)"
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stripping Ratio & Overburden Excavation Trends */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title text-base">
                <TrendingUp size={18} className="text-secondary" />
                Excavation Volume Split (Million m³)
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Overburden removal vs Clean Coal production
              </p>
            </div>
            <span className="badge badge-gray">Monthly Telemetry</span>
          </div>

          <div style={{ height: '320px', width: '100%', marginTop: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={excavationTrend}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="overburden"
                  name="Overburden (M m³)"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="coal"
                  name="Clean Coal (M m³)"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subsidiary Performance Comparison Table */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <h3 className="section-title text-base">Subsidiary Mining Performance Benchmarks</h3>
            <p className="text-xs text-muted mt-0.5">Production achievement and stripping ratios across operational coalfields</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subsidiary & Mining Field</th>
                <th>Actual Production (kT)</th>
                <th>Target (kT)</th>
                <th>MoU Achievement (%)</th>
                <th>Stripping Ratio (OB:Coal)</th>
                <th>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {subsidiaryPerformance.map((sub, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className="text-subtle" />
                      <span className="font-semibold text-primary">{sub.subsidiary}</span>
                    </div>
                  </td>
                  <td className="font-mono font-semibold text-primary">{sub.actual.toLocaleString()}</td>
                  <td className="font-mono text-muted">{sub.target.toLocaleString()}</td>
                  <td>
                    <span className="font-bold" style={{ color: sub.achievement >= 100 ? 'var(--status-success)' : 'var(--status-warning)' }}>
                      {sub.achievement}%
                    </span>
                  </td>
                  <td className="font-mono text-secondary">{sub.strippingRatio} : 1</td>
                  <td>
                    <StatusBadge status={sub.achievement >= 100 ? 'Passed' : 'Warning'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Intelligence Technical Notice */}
      <div className="card border-l-4 border-accent-primary bg-muted">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-accent-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed">
            <span className="font-bold text-primary block mb-0.5">Operational Efficiency Summary:</span>
            MCL Talcher and NCL Singrauli exceeded planned output by 4.8% and 4.5% respectively. Heavy earth moving machinery (HEMM) fleet availability averaged 87.4%, surpassing the CIL mandate of 85.0%. To mitigate stripping ratio increases at Talcher Sector B (2.41 vs 2.15), CMPDI technical recommendations advise deploying auxiliary high-capacity draglines in advance of monsoon operations.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningAnalytics;
