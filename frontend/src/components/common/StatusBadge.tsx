import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';

export type StatusType =
  | 'INDEXED'
  | 'PROCESSING'
  | 'UPLOADED'
  | 'NEEDS REVIEW'
  | 'FAILED'
  | 'Active'
  | 'Pending Review'
  | 'Completed'
  | 'Validated'
  | 'AI Draft'
  | 'PUBLISHED'
  | 'UNDER REVIEW'
  | 'Action Required'
  | 'Passed'
  | 'Critical'
  | 'Warning'
  | 'Positive Trend'
  | 'Depletion'
  | 'Improved'
  | 'Verified'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, className = '' }) => {
  const norm = (status || '').toUpperCase().trim();

  let badgeClass = 'badge-gray';
  let IconComponent = Info;

  if (['INDEXED', 'ACTIVE', 'COMPLETED', 'VALIDATED', 'PUBLISHED', 'APPROVED', 'PASSED', 'POSITIVE TREND', 'IMPROVED', 'VERIFIED', 'RESOLVED'].includes(norm)) {
    badgeClass = 'badge-green';
    IconComponent = CheckCircle2;
  } else if (['PENDING REVIEW', 'UNDER REVIEW', 'WARNING', 'ACTION REQUIRED', 'NEEDS REVIEW', 'AI DRAFT', 'IN REVIEW', 'TECHNICAL REVIEW'].includes(norm)) {
    badgeClass = 'badge-amber';
    IconComponent = AlertTriangle;
  } else if (['FAILED', 'CRITICAL', 'DEPLETION', 'ERROR'].includes(norm)) {
    badgeClass = 'badge-red';
    IconComponent = XCircle;
  } else if (['PROCESSING', 'UPLOADED', 'SYSTEM AUTOMATED'].includes(norm)) {
    badgeClass = 'badge-blue';
    IconComponent = Clock;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {showIcon && <IconComponent size={12} strokeWidth={2.5} />}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
