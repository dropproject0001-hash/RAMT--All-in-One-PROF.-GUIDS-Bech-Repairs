import React from 'react';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { CONNECTORS, getConnectorStats } from '../../data/connectors';
import { Activity, ShieldCheck, Zap, Cpu, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { TabType } from '../layout/DrawerNavigation';

interface Props {
  selectedEcuId: string;
  isBenchPowered: boolean;
  benchVoltage: number;
  setActiveTab: (tab: TabType) => void;
}

export const EcuScanner: React.FC<Props> = ({
  selectedEcuId,
  isBenchPowered,
  benchVoltage,
  setActiveTab,
}) => {
  const ecu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  const connector = CONNECTORS[ecu.connectorId];
  const stats = connector ? getConnectorStats(connector) : { verifiedPins: 0, totalPins: 0, percentage: 0 };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 text-slate-200 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ECU BENCH BENCHMARK
            </span>
            <span className="text-xs text-slate-400">{ecu.make}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{ecu.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Microcontroller: <span className="text-slate-200 font-mono">{ecu.microcontroller}</span> · Connector:{' '}
            <span className="text-slate-200 font-mono">{connector?.name || ecu.connectorId}</span>
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('readings')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10"
          >
            <Activity className="w-4 h-4" />
            <span>Component Readings</span>
          </button>
          <button
            onClick={() => setActiveTab('pinout')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>View Pinouts</span>
          </button>
        </div>
      </div>

      {/* Bench Telemetry Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Bench Supply Voltage */}
        <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Bench Supply Voltage</span>
            <Zap className={`w-3.5 h-3.5 ${isBenchPowered ? 'text-amber-400' : 'text-slate-600'}`} />
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {isBenchPowered ? `${benchVoltage.toFixed(1)}V DC` : '0.0V (OFF)'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isBenchPowered ? 'Stabilized DC Power Input' : 'Power switch is currently OFF'}
          </div>
        </div>

        {/* 5V Sensor Rail Status */}
        <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>5V VC Sensor Rail</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {isBenchPowered ? '5.00V ±0.05V' : '0.00V'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Regulated reference output for sensors
          </div>
        </div>

        {/* CAN Bus Impedance */}
        <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>CAN Termination</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">60.0 Ω</div>
          <div className="text-[11px] text-slate-500 mt-1">Parallel 120Ω resistors verified</div>
        </div>

        {/* Connector Completeness */}
        <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pinout Verification</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {stats.percentage}% <span className="text-xs font-normal text-slate-400">({stats.verifiedPins}/{stats.totalPins})</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.totalPins - stats.verifiedPins} unverified pins marked
          </div>
        </div>
      </div>
    </div>
  );
};
