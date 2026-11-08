import React from 'react';
import {
  Search,
  Cpu,
  Activity,
  FileCode2,
  Wrench,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { CONNECTORS, getConnectorStats } from '../../data/connectors';

export type TabType = 'dtc' | 'pinout' | 'readings' | 'schematics' | 'simulator' | 'assistant';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedEcuId: string;
  setSelectedEcuId: (id: string) => void;
  benchVoltage: number;
  isBenchPowered: boolean;
  setIsBenchPowered: (powered: boolean) => void;
}

export const DrawerNavigation: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  selectedEcuId,
  setSelectedEcuId,
  benchVoltage,
  isBenchPowered,
  setIsBenchPowered,
}) => {
  const currentEcu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  const currentConnector = CONNECTORS[currentEcu.connectorId];
  const stats = currentConnector ? getConnectorStats(currentConnector) : { verifiedPins: 0, totalPins: 0, percentage: 0 };

  const mainTools = [
    { id: 'dtc' as TabType, label: 'DTC Hardware Lookup', icon: Search, badge: 'DMM / Scanner' },
    { id: 'pinout' as TabType, label: 'ECU Pinouts & Power', icon: Cpu, badge: `${stats.percentage}% Verified` },
    { id: 'readings' as TabType, label: 'Component Readings', icon: Activity, badge: 'PDF Report' },
    { id: 'schematics' as TabType, label: 'PCB Schematics & Repair', icon: FileCode2, badge: 'Board View' },
    { id: 'simulator' as TabType, label: 'Bench Simulator', icon: Radio, badge: 'DEMO' },
    { id: 'assistant' as TabType, label: 'Tagalog Tech Assistant', icon: Bot, badge: 'Gemini AI' },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-200">
      {/* App Branding & Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                RAMT <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">BENCH REPAIR</span>
              </h1>
              <p className="text-xs text-slate-400">Ruben Automotive Modern Tech</p>
            </div>
          </div>
        </div>

        {/* Bench Power Switch */}
        <div className="mt-4 p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isBenchPowered ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-300">BENCH POWER 13.8V</div>
              <div className="text-[11px] font-mono text-slate-400">
                {isBenchPowered ? `${benchVoltage.toFixed(1)}V DC · ACTIVE` : '0.0V DC · OFF'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsBenchPowered(!isBenchPowered)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              isBenchPowered
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isBenchPowered ? 'POWER ON' : 'POWER OFF'}
          </button>
        </div>
      </div>

      {/* ECU Selector */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Select ECU Model
        </label>
        <select
          value={selectedEcuId}
          onChange={(e) => setSelectedEcuId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
        >
          {Object.values(ECU_PROFILES).map((ecu) => (
            <option key={ecu.id} value={ecu.id}>
              {ecu.make} - {ecu.name}
            </option>
          ))}
        </select>

        {/* Selected ECU Details Badge */}
        <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded-md border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="truncate pr-2">{currentEcu.model}</span>
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentEcu.connectorMatch === 'exact'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {currentEcu.connectorMatch.toUpperCase()}
            </span>
          </div>

          {currentEcu.connectorMatch !== 'exact' && (
            <div className="mt-1.5 text-[11px] text-amber-400/90 flex items-start gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{currentEcu.matchWarning || 'Non-exact connector. Verify wiring.'}</span>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Pinout Data:</span>
            <span className="font-mono text-slate-200">
              {stats.verifiedPins}/{stats.totalPins} pins ({stats.percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          BENCH REPAIR TOOLS
        </div>
        {mainTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tool.label}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  tool.badge === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : isActive
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {tool.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-500 text-center">
        <div>RAMT Bench Assistant v3.0 (Bench Repair)</div>
        <div className="mt-0.5 text-slate-400 font-mono">DTC · Pinouts · PCB Readings</div>
      </div>
    </aside>
  );
};
