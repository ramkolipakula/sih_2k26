import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  iconBgColor = '#F1F5F9',
  iconColor = '#334155',
  badge,
  onClick
}) => {
  return (
    <div
      className={`stat-card ${onClick ? 'cursor-pointer hover:border-slate-400' : ''}`}
      onClick={onClick}
    >
      <div
        className="stat-icon"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        {icon}
      </div>
      <div className="stat-info flex-1">
        <div className="flex items-center justify-between">
          <span className="stat-title">{label}</span>
          {badge}
        </div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
