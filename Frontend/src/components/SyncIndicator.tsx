import React from 'react';
import { Clock, Wifi, WifiOff } from 'lucide-react';

interface SyncIndicatorProps {
  lastSyncedAt: string;
  pendingSyncCount: number;
  compact?: boolean;
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ lastSyncedAt, pendingSyncCount, compact }) => {
  const isRecent = Date.now() - new Date(lastSyncedAt).getTime() < 3600000;
  if (compact) {
    return (
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isRecent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {isRecent ? <Wifi size={12} /> : <WifiOff size={12} />}
        <span>{pendingSyncCount > 0 ? `${pendingSyncCount} pending` : 'Synced'}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border ${isRecent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
      {isRecent ? <Wifi size={14} /> : <WifiOff size={14} />}
      <span>Last synced: <strong>{timeAgo(lastSyncedAt)}</strong></span>
      {pendingSyncCount > 0 && (
        <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">
          {pendingSyncCount} pending
        </span>
      )}
      <Clock size={12} className="opacity-50" />
    </div>
  );
};
