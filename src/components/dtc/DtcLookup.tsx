import React, { useState } from 'react';
import { DTC_DATABASE } from '../../data/dtcDatabase';
import { DtcCode } from '../../types/ecu';
import { Search, AlertTriangle, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';

export const DtcLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [activeCode, setActiveCode] = useState<DtcCode | null>(DTC_DATABASE[0]);

  const filteredCodes = DTC_DATABASE.filter((dtc) => {
    const matchesSearch =
      dtc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dtc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dtc.descriptionTagalog.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dtc.descriptionEnglish.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSystem = selectedSystem === 'all' || dtc.system === selectedSystem;

    return matchesSearch && matchesSystem;
  });

  const systems = [
    'all',
    'Power Supply',
    'Injector Driver',
    'Sensor 5V Rail',
    'CAN Bus Communication',
    'Microcontroller',
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                BENCH DTC LOOKUP
              </span>
              <span className="text-xs text-slate-400">ECU Hardware Diagnostic Database</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Diagnostic Trouble Codes (Hardware Focus)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified fault code causes, Tagalog bench diagnostic steps, and component replacement targets.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {systems.map((sys) => (
              <button
                key={sys}
                onClick={() => setSelectedSystem(sys)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedSystem === sys
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sys === 'all' ? 'All Systems' : sys}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search code (e.g. P0641, P0201)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-h-[600px] overflow-y-auto space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            DTC List ({filteredCodes.length} Codes)
          </div>

          {filteredCodes.map((dtc) => {
            const isActive = activeCode?.code === dtc.code;
            return (
              <button
                key={dtc.code}
                onClick={() => setActiveCode(dtc)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-amber-400">{dtc.code}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {dtc.system}
                  </span>
                </div>
                <div className="text-xs font-semibold mt-1 line-clamp-1">{dtc.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{dtc.descriptionTagalog}</div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          {activeCode ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-extrabold text-amber-400 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                      {activeCode.code}
                    </span>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      SYSTEM: {activeCode.system}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">{activeCode.title}</h3>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED CODE
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500 mt-1">
                    Source: {activeCode.source}
                  </span>
                </div>
              </div>

              {/* Tagalog & English Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Tagalog Explanation:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{activeCode.descriptionTagalog}</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    English Description:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeCode.descriptionEnglish}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Observed Symptoms on Bench:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {activeCode.symptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>

              {/* Tagalog Bench Diagnostic Steps */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Tagalog Bench Diagnostic Steps:
                </h4>
                <ol className="space-y-1.5 text-xs text-slate-200">
                  {activeCode.benchTestSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Hardware Causes */}
              <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Probable PCB Component Causes:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-200">
                  {activeCode.hardwareCauses.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Select a DTC from the left list to view hardware diagnostic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
