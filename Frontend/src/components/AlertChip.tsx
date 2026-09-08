import React from 'react';
import type { Alert } from '../types';
import { AlertTriangle, Info, X, TrendingDown } from 'lucide-react';

interface AlertChipProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  compact?: boolean;
}

export const AlertChip: React.FC<AlertChipProps> = ({ alert, onAcknowledge, compact }) => {
  const isAttention = alert.severity === 'attention';
  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isAttention ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
        {isAttention ? <AlertTriangle size={12} /> : <Info size={12} />}
        <span className="truncate max-w-[160px]">{alert.message}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-2 ${isAttention ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isAttention ? <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" /> : <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />}
          <span className={`font-semibold text-sm ${isAttention ? 'text-red-800' : 'text-blue-800'}`}>{alert.message}</span>
        </div>
        {onAcknowledge && (
          <button onClick={() => onAcknowledge(alert.id)} className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0" aria-label="Dismiss alert">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Rule-based stats — NOT AI text */}
      {alert.statLabel && (
        <div className="flex items-center gap-3 pl-6">
          <TrendingDown size={13} className={isAttention ? 'text-red-400' : 'text-blue-400'} />
          <div className="text-xs space-x-3">
            <span className={`font-bold ${isAttention ? 'text-red-700' : 'text-blue-700'}`}>
              {alert.statLabel}: <strong>{alert.statCurrent}{typeof alert.statCurrent === 'number' ? '%' : ''}</strong>
            </span>
            <span className="text-gray-500">
              (baseline: {alert.statBaseline}{typeof alert.statBaseline === 'number' ? '%' : ''})
            </span>
          </div>
        </div>
      )}

      <div className="pl-6 text-xs text-gray-400">{timeAgo(alert.createdAt)}</div>
    </div>
  );
};
