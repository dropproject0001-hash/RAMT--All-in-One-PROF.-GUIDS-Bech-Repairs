import React, { useState } from 'react';
import { DrawerNavigation, TabType } from './components/layout/DrawerNavigation';
import { EcuScanner } from './components/scanner/EcuScanner';
import { DtcLookup } from './components/dtc/DtcLookup';
import { PinoutViewer } from './components/pinout/PinoutViewer';
import { ComponentReadings } from './components/bench/ComponentReadings';
import { PcbSchematics } from './components/schematics/PcbSchematics';
import { BenchSimulator } from './components/bench/BenchSimulator';
import { MechanicVoiceAssistant } from './components/assistant/MechanicVoiceAssistant';
import { ECU_PROFILES } from './data/ecuProfiles';
import { Wrench, Zap, Radio, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pinout');
  const [selectedEcuId, setSelectedEcuId] = useState<string>('denso_1gd_hilux');
  const [isBenchPowered, setIsBenchPowered] = useState<boolean>(true);
  const [benchVoltage, setBenchVoltage] = useState<number>(13.8);

  const currentEcu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Sidebar Navigation Drawer */}
      <DrawerNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedEcuId={selectedEcuId}
        setSelectedEcuId={setSelectedEcuId}
        benchVoltage={benchVoltage}
        isBenchPowered={isBenchPowered}
        setIsBenchPowered={setIsBenchPowered}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        {/* Top Header Bar - High Precision Bench UI */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ACTIVE TAB: {activeTab.toUpperCase()}
            </span>
            <h2 className="text-sm font-bold text-white tracking-wide truncate">
              {currentEcu.name} ({currentEcu.make} {currentEcu.model})
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SINGLE SOURCE PIN TABLE</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border border-slate-800">
              <Zap className={`w-3.5 h-3.5 ${isBenchPowered ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
              <span className={isBenchPowered ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                {isBenchPowered ? `${benchVoltage.toFixed(1)}V DC` : '0.0V OFF'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Scanner & Health Overview */}
          <EcuScanner
            selectedEcuId={selectedEcuId}
            isBenchPowered={isBenchPowered}
            benchVoltage={benchVoltage}
            setActiveTab={setActiveTab}
          />

          {/* Tab Views */}
          {activeTab === 'pinout' && (
            <PinoutViewer selectedEcuId={selectedEcuId} isBenchPowered={isBenchPowered} />
          )}

          {activeTab === 'dtc' && <DtcLookup />}

          {activeTab === 'readings' && (
            <ComponentReadings selectedEcuId={selectedEcuId} />
          )}

          {activeTab === 'schematics' && (
            <PcbSchematics selectedEcuId={selectedEcuId} />
          )}

          {activeTab === 'simulator' && (
            <BenchSimulator
              selectedEcuId={selectedEcuId}
              isBenchPowered={isBenchPowered}
              setIsBenchPowered={setIsBenchPowered}
              benchVoltage={benchVoltage}
            />
          )}

          {activeTab === 'assistant' && (
            <MechanicVoiceAssistant
              selectedEcuId={selectedEcuId}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>
    </div>
  );
}
