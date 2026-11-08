import React, { useState, useEffect, useRef } from 'react';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { COMPONENT_READINGS } from '../../data/componentReadings';
import { Radio, Zap, Activity, AlertTriangle, Play, Square } from 'lucide-react';

interface Props {
  selectedEcuId: string;
  isBenchPowered: boolean;
  setIsBenchPowered: (powered: boolean) => void;
  benchVoltage: number;
}

export const BenchSimulator: React.FC<Props> = ({
  selectedEcuId,
  isBenchPowered,
  setIsBenchPowered,
  benchVoltage,
}) => {
  const currentEcu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  const ecuReadings = COMPONENT_READINGS.filter((r) => r.ecuId === selectedEcuId);

  const [inputVoltage, setInputVoltage] = useState<number>(13.8);
  const [rpmSignal, setRpmSignal] = useState<number>(850);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Computed simulated parameters connected directly to Component Readings data
  const simulated5V = isBenchPowered ? 5.00 + (Math.random() * 0.02 - 0.01) : 0.00;
  const simulatedCurrent = isBenchPowered ? 0.22 + (rpmSignal / 3000) * 0.15 : 0.00;
  const simulatedCanH = isBenchPowered ? 2.50 + 0.8 : 0.00;
  const simulatedCanL = isBenchPowered ? 2.50 - 0.8 : 0.00;

  // Render simulated Oscilloscope waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isBenchPowered && isSimRunning) {
        // Draw 5V Rail Trace (Yellow)
        ctx.strokeStyle = '#f59e0b'; // amber-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const noise = (Math.sin((x + offset) * 0.05) * 2);
          const y = canvas.height / 2 - 30 + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw CAN Differential Square Wave Signal (Cyan)
        ctx.strokeStyle = '#06b6d4'; // cyan-500
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const square = Math.sin((x + offset * 2) * 0.1) > 0 ? 25 : -25;
          const y = canvas.height / 2 + 30 + square;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += 2;
      } else {
        // Flatline OFF state
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isBenchPowered, isSimRunning]);

  return (
    <div className="space-y-6 text-slate-200">
      {/* Prominent DEMO / SIMULATION Banner */}
      <div className="bg-amber-950/40 border-2 border-amber-500 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-lg">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                DEMO / SIMULATION MODE ONLY
              </span>
              <span className="text-xs text-amber-300 font-semibold">Virtual ECU Signal Generator</span>
            </div>
            <p className="text-xs text-amber-200/90 mt-0.5">
              Simulated telemetry and waveforms for bench testing training.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSimRunning(!isSimRunning)}
          className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all ${
            isSimRunning
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isSimRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isSimRunning ? 'PAUSE SIM' : 'START SIM'}</span>
        </button>
      </div>

      {/* Simulator Controls & Oscilloscope View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Simulated Bench Controls
          </h3>

          <div>
            <label className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Bench Input Voltage:</span>
              <span className="font-mono font-bold text-amber-400">{inputVoltage.toFixed(1)}V DC</span>
            </label>
            <input
              type="range"
              min="10.0"
              max="15.0"
              step="0.1"
              value={inputVoltage}
              onChange={(e) => setInputVoltage(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg h-2"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Crank Signal Simulator RPM:</span>
              <span className="font-mono font-bold text-cyan-400">{rpmSignal} RPM</span>
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={rpmSignal}
              onChange={(e) => setRpmSignal(parseInt(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg h-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">Bench Relay Power Switch:</span>
            <button
              onClick={() => setIsBenchPowered(!isBenchPowered)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                isBenchPowered
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isBenchPowered ? 'POWERED (ON)' : 'POWERED (OFF)'}
            </button>
          </div>
        </div>

        {/* Right Oscilloscope Waveform Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Live Simulated Oscilloscope (2-Channel Trace)
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-amber-400">CH1: 5V Rail</span>
              <span className="text-cyan-400">CH2: CAN Bus Waveform</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={220}
            className="w-full h-56 bg-slate-950 rounded-xl border border-slate-800"
          />

          {/* Telemetry Summary synced to Component Readings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Simulated 5V Rail:</span>
              <span className="text-amber-400 font-bold">{simulated5V.toFixed(2)}V</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Bench Current Draw:</span>
              <span className="text-white font-bold">{simulatedCurrent.toFixed(2)}A</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CAN-H Signal:</span>
              <span className="text-cyan-400 font-bold">{simulatedCanH.toFixed(2)}V</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CAN-L Signal:</span>
              <span className="text-cyan-400 font-bold">{simulatedCanL.toFixed(2)}V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
