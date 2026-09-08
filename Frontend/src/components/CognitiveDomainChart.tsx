import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import type { CognitiveProfile } from '../types';

interface CognitiveDomainChartProps {
  profile: CognitiveProfile;
  mode?: 'radar' | 'history' | 'both';
}

const DOMAIN_LABELS: Record<string, string> = {
  memory: 'Memory',
  attention: 'Attention',
  sequencing: 'Sequencing',
  recognition: 'Recognition',
  auditoryComprehension: 'Auditory'
};

export const CognitiveDomainChart: React.FC<CognitiveDomainChartProps> = ({
  profile,
  mode = 'both'
}) => {
  const radarData = Object.keys(profile.baseline).map(key => ({
    domain: DOMAIN_LABELS[key] || key,
    Baseline: profile.baseline[key as keyof typeof profile.baseline],
    Current: profile.current[key as keyof typeof profile.current],
    fullMark: 100
  }));

  const historyData = profile.history.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    Memory: item.scores.memory,
    Attention: item.scores.attention,
    Sequencing: item.scores.sequencing,
    Recognition: item.scores.recognition,
    Auditory: item.scores.auditoryComprehension
  }));

  return (
    <div className="space-y-6">
      {(mode === 'radar' || mode === 'both') && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Cognitive Domain Balance</h3>
              <p className="text-xs text-gray-500">Current performance vs baseline score</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Current
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Baseline
              </span>
            </div>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Current"
                  dataKey="Current"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Baseline"
                  dataKey="Baseline"
                  stroke="#10b981"
                  fill="#34d399"
                  fillOpacity={0.2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-100">
            {radarData.map(d => {
              const diff = d.Current - d.Baseline;
              const isPositive = diff >= 0;
              return (
                <div key={d.domain} className="bg-gray-50 p-2.5 rounded-xl text-center">
                  <div className="text-xs text-gray-500 font-medium truncate">{d.domain}</div>
                  <div className="text-lg font-bold text-gray-900 my-0.5">{d.Current}%</div>
                  <div className={`text-[10px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isPositive ? `+${diff}%` : `${diff}%`} vs base
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(mode === 'history' || mode === 'both') && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-base">Longitudinal Trend</h3>
            <p className="text-xs text-gray-500">Weekly domain scores tracking over time</p>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="Memory" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Attention" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Sequencing" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Recognition" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Auditory" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
