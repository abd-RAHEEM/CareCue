import React from 'react';
import {
  Brain,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  FileCheck,
  Award,
  Zap
} from 'lucide-react';
import { useStore } from '../../store/store';
import { CognitiveDomainChart } from '../../components/CognitiveDomainChart';
import { AlertChip } from '../../components/AlertChip';

export const CaregiverCognitiveProfile: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const alerts = useStore(s => s.alerts);
  const acknowledgeAlert = useStore(s => s.acknowledgeAlert);

  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">No Patient Selected</h2>
      </div>
    );
  }

  const profile = patient.cognitiveProfile;
  const patientAlerts = alerts.filter(a => a.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Brain size={16} /> Clinical & Cognitive Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Cognitive Profile • {patient.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Standardized 5-domain cognitive score tracking, game activity analytics, and longitudinal trends.
        </p>
      </div>

      {/* Main Charts Component (Radar + Line Graph) */}
      <CognitiveDomainChart profile={profile} mode="both" />

      {/* Domain Score Matrix vs Baseline */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Domain Baseline Comparison</h2>
        <p className="text-xs text-gray-500 mb-4">
          Direct statistical comparison between initial clinical baseline and recent aggregate activity scores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(profile.current).map(([domain, currentVal]) => {
            const baselineVal = profile.baseline[domain as keyof typeof profile.baseline];
            const diff = currentVal - baselineVal;
            const isGood = diff >= 0;

            return (
              <div
                key={domain}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider capitalize">
                    {domain.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mt-1">{currentVal}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Baseline: {baselineVal}%</div>
                </div>

                <div
                  className={`mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-1 text-xs font-bold ${
                    isGood ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {isGood ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{isGood ? `+${diff}%` : `${diff}%`} Delta</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity History Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cognitive Activity History</h2>
            <p className="text-xs text-gray-500">Log of all completed games, reaction times, and accuracy</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl">
            {patient.activityLog.length} Sessions Logged
          </span>
        </div>

        {patient.activityLog.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No game sessions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                  <th className="pb-3">Activity / Game</th>
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Response Time</th>
                  <th className="pb-3">Hints Used</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...patient.activityLog].reverse().map(act => (
                  <tr key={act.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-semibold text-gray-900 capitalize">
                      {act.gameId.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md font-bold">
                        Lvl {act.difficultyLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold ${
                          act.accuracy >= 80
                            ? 'text-emerald-600'
                            : act.accuracy >= 50
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {act.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 font-medium">
                      {(act.responseTimeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-3 text-gray-600">{act.hintsUsed}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(act.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rule-Based System Alerts Log */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Rule-Based Clinical Alerts</h2>
        <p className="text-xs text-gray-500 mb-4">
          Structured notifications generated automatically when metrics deviate by &gt;15% from baseline.
        </p>

        {patientAlerts.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            No active or past alerts for this patient.
          </div>
        ) : (
          <div className="space-y-2">
            {patientAlerts.map(alert => (
              <AlertChip
                key={alert.id}
                alert={alert}
                onAcknowledge={id => acknowledgeAlert(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
