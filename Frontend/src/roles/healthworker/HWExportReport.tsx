import React, { useState } from 'react';
import {
  Printer,
  Download,
  Stethoscope,
  Heart,
  CheckCircle,
  Brain,
  Calendar,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { CognitiveDomainChart } from '../../components/CognitiveDomainChart';

export const HWExportReport: React.FC = () => {
  const navigate = useNavigate();
  const patients = useStore(s => s.patients);
  const patientList = Object.values(patients);
  const [selectedId, setSelectedId] = useState(patientList[0]?.id || '');

  const patient = patients[selectedId];

  if (!patient) {
    return <div className="p-12 text-center text-gray-500">No patient selected</div>;
  }

  const profile = patient.cognitiveProfile;
  const functioning = profile.dailyFunctioning;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header (hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/healthworker')}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-gray-300">|</span>
          <label className="text-xs font-bold text-gray-700">Select Patient:</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border rounded-xl text-xs font-semibold outline-none"
          >
            {patientList.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Age {p.age})</option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Printer size={15} /> Print / Export PDF
        </button>
      </div>

      {/* Printable Document Container */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-indigo-900 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-black text-xl">
              <Heart size={22} fill="#4338ca" /> CareCue Cognitive Health Report
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Field Clinical Assessment & Longitudinal Cognitive Profile
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div><span className="font-semibold text-gray-700">Report Date:</span> {new Date().toLocaleDateString()}</div>
            <div><span className="font-semibold text-gray-700">Protocol:</span> Assam Dementia Field Care</div>
          </div>
        </div>

        {/* Patient Clinical Demographics */}
        <div className="bg-gray-50 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-400 font-bold uppercase text-[10px]">Patient Name</div>
            <div className="font-black text-gray-900 text-sm mt-0.5">{patient.name}</div>
          </div>
          <div>
            <div className="text-gray-400 font-bold uppercase text-[10px]">Age / Language</div>
            <div className="font-bold text-gray-900 text-sm mt-0.5">{patient.age} yrs • {patient.preferredLanguage}</div>
          </div>
          <div>
            <div className="text-gray-400 font-bold uppercase text-[10px]">Patient ID</div>
            <div className="font-bold text-gray-900 text-sm mt-0.5">{patient.id}</div>
          </div>
          <div>
            <div className="text-gray-400 font-bold uppercase text-[10px]">Last Synced</div>
            <div className="font-bold text-gray-900 text-sm mt-0.5">{new Date(patient.lastSyncedAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Daily Functioning Adherence Grid */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider text-xs">
            1. Daily Functioning & Adherence (Past 30 Days)
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="border border-gray-200 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 font-semibold">Medicine Adherence</div>
              <div className="text-xl font-black text-gray-900 mt-1">{functioning.medicineAdherence}%</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 font-semibold">Hydration Adherence</div>
              <div className="text-xl font-black text-gray-900 mt-1">{functioning.hydrationAdherence}%</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 font-semibold">Daily Routine Completion</div>
              <div className="text-xl font-black text-gray-900 mt-1">{functioning.routineCompletion}%</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-3">
              <div className="text-[10px] text-gray-500 font-semibold">Social Interactions</div>
              <div className="text-xl font-black text-gray-900 mt-1">{functioning.socialInteractionCount}</div>
            </div>
          </div>
        </div>

        {/* Cognitive Domain Analysis */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider text-xs">
            2. Standardized 5-Domain Cognitive Evaluation
          </h3>

          <div className="border border-gray-200 rounded-2xl p-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-gray-400 font-bold uppercase">
                  <th className="pb-2">Cognitive Domain</th>
                  <th className="pb-2">Baseline Score</th>
                  <th className="pb-2">Current Score</th>
                  <th className="pb-2">Variance</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(profile.current).map(([domain, currentVal]) => {
                  const baselineVal = profile.baseline[domain as keyof typeof profile.baseline];
                  const diff = currentVal - baselineVal;
                  const isPositive = diff >= 0;

                  return (
                    <tr key={domain} className="py-2">
                      <td className="py-2.5 font-bold text-gray-900 capitalize">
                        {domain.replace(/([A-Z])/g, ' $1')}
                      </td>
                      <td className="py-2.5 text-gray-600">{baselineVal}%</td>
                      <td className="py-2.5 font-bold text-gray-900">{currentVal}%</td>
                      <td className={`py-2.5 font-bold ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isPositive ? `+${diff}%` : `${diff}%`}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          Math.abs(diff) < 10
                            ? 'bg-gray-100 text-gray-700'
                            : isPositive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {Math.abs(diff) < 10 ? 'Stable' : isPositive ? 'Improving' : 'Monitoring'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cognitive Domain Charts */}
        <div className="pt-2">
          <CognitiveDomainChart profile={profile} mode="radar" />
        </div>

        {/* Recent Game Activity Log */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider text-xs">
            3. Recent Game Exercises Summary
          </h3>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50">
                <tr className="border-b text-gray-500 font-bold">
                  <th className="p-2.5">Game Activity</th>
                  <th className="p-2.5">Level</th>
                  <th className="p-2.5">Accuracy</th>
                  <th className="p-2.5">Avg Response</th>
                  <th className="p-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patient.activityLog.slice(-4).reverse().map(act => (
                  <tr key={act.id}>
                    <td className="p-2.5 font-semibold text-gray-800 capitalize">
                      {act.gameId.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="p-2.5 text-gray-600">Lvl {act.difficultyLevel}</td>
                    <td className="p-2.5 font-bold text-gray-900">{act.accuracy}%</td>
                    <td className="p-2.5 text-gray-600">{(act.responseTimeMs / 1000).toFixed(1)}s</td>
                    <td className="p-2.5 text-gray-400">
                      {new Date(act.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="border-b border-gray-300 pb-12"></div>
            <div className="font-bold text-gray-900 mt-2">Primary ASHA / Health Worker</div>
            <div className="text-gray-500">CareCue Community Health Ward 4</div>
          </div>
          <div>
            <div className="border-b border-gray-300 pb-12"></div>
            <div className="font-bold text-gray-900 mt-2">Supervising Medical Officer</div>
            <div className="text-gray-500">District Dementia Outreach Division</div>
          </div>
        </div>
      </div>
    </div>
  );
};
