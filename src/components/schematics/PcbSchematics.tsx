import React, { useState } from 'react';
import { PCB_COMPONENTS, COMMON_BOARD_FAILURES } from '../../data/pcbData';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { FileCode2, Cpu, Wrench, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  selectedEcuId: string;
}

export const PcbSchematics: React.FC<Props> = ({ selectedEcuId }) => {
  const currentEcu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  const [selectedCompId, setSelectedCompId] = useState<string>('tle4267_regulator');

  const selectedComp = PCB_COMPONENTS[selectedCompId] || PCB_COMPONENTS.tle4267_regulator;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PCB BOARD REPAIR & SCHEMATICS
              </span>
              <span className="text-xs text-slate-400">Component Level Troubleshooting</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentEcu.name} Board Components
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect critical surface-mount chips, MOSFET drivers, power regulators, and protection diodes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split: PCB Graphic Board View & Component Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Board Layout Graphic */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>PCB Layout Schematic Diagram</span>
              <span className="text-[10px] font-mono text-emerald-400">DENSO / BOSCH SILKSCREEN</span>
            </h3>

            {/* Simulated Dark Green PCB Board Visualizer */}
            <div className="relative w-full aspect-[4/3] bg-emerald-950/80 border-2 border-emerald-800/80 rounded-xl p-4 shadow-inner overflow-hidden flex flex-col justify-between">
              {/* PCB Copper Trace Lines Background Graphic */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 relative z-10">
                <span>[RAMT-PCB-REV3]</span>
                <span>ECU MAIN BOARD</span>
              </div>

              {/* Interactive Component Placement Boxes */}
              <div className="grid grid-cols-2 gap-3 relative z-10 my-auto">
                {/* 5V Regulator IC101 */}
                <button
                  onClick={() => setSelectedCompId('tle4267_regulator')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCompId === 'tle4267_regulator'
                      ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400'
                      : 'bg-slate-950/90 border-emerald-600/60 text-emerald-300 hover:border-amber-400'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-amber-400">IC101</div>
                  <div className="text-[11px] font-semibold text-white">5V Regulator</div>
                  <div className="text-[9px] font-mono text-slate-400">TO-263</div>
                </button>

                {/* CAN Transceiver IC202 */}
                <button
                  onClick={() => setSelectedCompId('tja1050_can')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCompId === 'tja1050_can'
                      ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400'
                      : 'bg-slate-950/90 border-emerald-600/60 text-emerald-300 hover:border-amber-400'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-amber-400">IC202</div>
                  <div className="text-[11px] font-semibold text-white">CAN Transceiver</div>
                  <div className="text-[9px] font-mono text-slate-400">SOIC-8</div>
                </button>

                {/* Injector MOSFET Drivers Q501-Q504 */}
                <button
                  onClick={() => setSelectedCompId('injector_mosfet_d1gd')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCompId === 'injector_mosfet_d1gd'
                      ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400'
                      : 'bg-slate-950/90 border-emerald-600/60 text-emerald-300 hover:border-amber-400'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-amber-400">Q501-Q504</div>
                  <div className="text-[11px] font-semibold text-white">Injector Drivers</div>
                  <div className="text-[9px] font-mono text-slate-400">D2PAK FETs</div>
                </button>

                {/* Flyback Diodes D401-D404 */}
                <button
                  onClick={() => setSelectedCompId('flyback_diode_array')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCompId === 'flyback_diode_array'
                      ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400'
                      : 'bg-slate-950/90 border-emerald-600/60 text-emerald-300 hover:border-amber-400'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-amber-400">D401-D404</div>
                  <div className="text-[11px] font-semibold text-white">Flyback Diodes</div>
                  <div className="text-[9px] font-mono text-slate-400">SMC Package</div>
                </button>
              </div>

              <div className="text-[9px] font-mono text-emerald-500 text-right relative z-10">
                CLICK ANY COMPONENT BOX TO INSPECT
              </div>
            </div>
          </div>
        </div>

        {/* Right Component Inspector Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  DESIGNATOR: {selectedComp.designator}
                </span>
                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  PACKAGE: {selectedComp.packageType}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2">{selectedComp.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedComp.function}</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED COMPONENT
              </span>
              <span className="block text-[10px] font-mono text-slate-500 mt-1">
                Source: {selectedComp.source}
              </span>
            </div>
          </div>

          {/* Normal Expected Readings */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Normal Expected Readings:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {selectedComp.normalReadings.voltageKeyOn && (
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Voltage (Key ON):</span>
                  <span className="text-white font-bold">{selectedComp.normalReadings.voltageKeyOn}</span>
                </div>
              )}
              {selectedComp.normalReadings.diodeMode && (
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Diode Mode (to GND):</span>
                  <span className="text-emerald-400 font-bold">{selectedComp.normalReadings.diodeMode}</span>
                </div>
              )}
              {selectedComp.normalReadings.resistance && (
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Resistance:</span>
                  <span className="text-amber-400 font-bold">{selectedComp.normalReadings.resistance}</span>
                </div>
              )}
            </div>
          </div>

          {/* Known Common Failures for this component */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Common Board Failure Diagnostics:
            </h4>

            {COMMON_BOARD_FAILURES.map((failure) => (
              <div key={failure.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-amber-400 text-sm flex items-center justify-between">
                  <span>{failure.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    DIAGNOSTIC GUIDELINE
                  </span>
                </div>

                <div className="text-slate-300">
                  <span className="font-semibold text-slate-400">Symptom (Tagalog): </span>
                  {failure.symptomTagalog}
                </div>

                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-emerald-300 font-mono">
                  <span className="text-slate-500 block text-[10px]">Bench Test Procedure:</span>
                  {failure.benchDiagnosticStep}
                </div>

                <div className="text-slate-300">
                  <span className="font-semibold text-amber-400">Recommended Board Repair: </span>
                  {failure.recommendedRepair}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
