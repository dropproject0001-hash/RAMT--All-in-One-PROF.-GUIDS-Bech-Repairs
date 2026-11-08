import React, { useState } from 'react';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { CONNECTORS, getConnectorStats } from '../../data/connectors';
import { ConnectorPin, SignalType } from '../../types/ecu';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Zap, Radio, Search } from 'lucide-react';

interface Props {
  selectedEcuId: string;
  isBenchPowered: boolean;
}

export const PinoutViewer: React.FC<Props> = ({ selectedEcuId, isBenchPowered }) => {
  const ecu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  const connector = CONNECTORS[ecu.connectorId];
  const stats = connector ? getConnectorStats(connector) : { verifiedPins: 0, totalPins: 0, percentage: 0 };

  const [selectedPin, setSelectedPin] = useState<ConnectorPin | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!connector) {
    return (
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center text-slate-400">
        Connector data not found for {ecu.name}.
      </div>
    );
  }

  // Filter logic
  const filteredPins = connector.pins.filter((pin) => {
    // Search match
    const matchSearch =
      pin.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.pinNumber.toString().includes(searchTerm) ||
      pin.signalType.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterCategory === 'power') {
      return pin.signalType === 'VCC' || pin.signalType === 'IGNITION';
    }
    if (filterCategory === 'gnd') {
      return pin.signalType === 'GND';
    }
    if (filterCategory === 'sensor') {
      return pin.signalType === 'SENSOR_5V' || pin.signalType === 'SENSOR_GND';
    }
    if (filterCategory === 'can') {
      return pin.signalType === 'CAN_H' || pin.signalType === 'CAN_L' || pin.signalType === 'K_LINE';
    }
    if (filterCategory === 'drivers') {
      return pin.signalType === 'INJECTOR_DRV' || pin.signalType === 'COIL_DRV';
    }
    if (filterCategory === 'unverified') {
      return !pin.verified;
    }
    return true;
  });

  const getSignalBadgeColor = (type: SignalType, verified: boolean) => {
    if (!verified) return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
    switch (type) {
      case 'VCC':
      case 'IGNITION':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'GND':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      case 'SENSOR_5V':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SENSOR_GND':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40';
      case 'CAN_H':
      case 'CAN_L':
      case 'K_LINE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'INJECTOR_DRV':
      case 'COIL_DRV':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top ECU & Connector Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CONNECTOR ID: {connector.id}
              </span>
              {connector.genericImage && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  GENERIC CONNECTOR PATTERN
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">{connector.name}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Engine Model: <span className="text-slate-200 font-medium">{ecu.model}</span> ({ecu.engine})
            </p>
          </div>

          {/* Completeness Meter */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Pinout Completeness:</span>
              <span className="font-mono font-bold text-amber-400">{stats.percentage}% Verified</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
              <span>{stats.verifiedPins} Verified Pins</span>
              <span>{stats.totalPins - stats.verifiedPins} Unverified</span>
            </div>
          </div>
        </div>

        {/* Warning Banner for Non-Exact Connector Match */}
        {ecu.connectorMatch !== 'exact' && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold uppercase tracking-wider">Warning (Non-Exact Connector Match): </span>
              {ecu.matchWarning || 'This ECU shares physical housing with other models. Double-check pin numbers against OEM schematics before applying power.'}
            </div>
          </div>
        )}
      </div>

      {/* Bench Power-Up & Test Points Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Bench Power-Up & Test Points Protocol (Single Source of Truth)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <h4 className="text-xs font-semibold text-amber-400 mb-2">POWER-UP STEPS</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {ecu.benchInstructions.powerUp.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-slate-500">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <h4 className="text-xs font-semibold text-emerald-400 mb-2">TEST POINTS & VERIFICATION</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {ecu.benchInstructions.testPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({connector.totalPins})
          </button>
          <button
            onClick={() => setFilterCategory('power')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'power'
                ? 'bg-red-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Power (+12V)
          </button>
          <button
            onClick={() => setFilterCategory('gnd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'gnd'
                ? 'bg-slate-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ground (GND)
          </button>
          <button
            onClick={() => setFilterCategory('sensor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'sensor'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            5V Sensor
          </button>
          <button
            onClick={() => setFilterCategory('can')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'can'
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            CAN / Comms
          </button>
          <button
            onClick={() => setFilterCategory('unverified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === 'unverified'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
          >
            Unverified Warning
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter pin label or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Pin Grid View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Pin Grid Matrix ({connector.gridRows} Rows × {connector.gridCols} Columns)
        </h3>

        <div
          className="grid gap-2 overflow-x-auto pb-2"
          style={{ gridTemplateColumns: `repeat(${connector.gridCols}, minmax(100px, 1fr))` }}
        >
          {filteredPins.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            return (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all min-h-[90px] relative ${
                  isSelected
                    ? 'ring-2 ring-amber-400 bg-slate-800 border-amber-400'
                    : pin.verified
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-white">P{pin.pinNumber}</span>
                  {!pin.verified && (
                    <span title="Unverified Pin Data">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </span>
                  )}
                  {pin.verified && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Verified Pin" />
                  )}
                </div>

                <div className="text-[11px] font-medium text-slate-200 line-clamp-2 my-1">
                  {pin.label}
                </div>

                <div className="flex items-center justify-between w-full mt-auto">
                  <span
                    className={`text-[9px] font-mono px-1 py-0.5 rounded border ${getSignalBadgeColor(
                      pin.signalType,
                      pin.verified
                    )}`}
                  >
                    {pin.signalType}
                  </span>
                  {pin.voltage && (
                    <span className="text-[9px] font-mono text-slate-400">{pin.voltage}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pin Details Modal / Card */}
      {selectedPin && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-5 text-slate-200 shadow-2xl relative">
          <button
            onClick={() => setSelectedPin(null)}
            className="absolute right-4 top-4 text-slate-400 hover:text-white text-xs font-mono"
          >
            [CLOSE X]
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs border border-amber-500/30">
              PIN #{selectedPin.pinNumber} DETAILS
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                selectedPin.verified
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {selectedPin.verified ? 'OEM VERIFIED' : 'UNVERIFIED DATA'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">{selectedPin.label}</h3>
          <p className="text-xs text-slate-400 mb-3">{selectedPin.description || 'No detailed description available.'}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Signal Type:</span>
              <span className="text-amber-400 font-bold">{selectedPin.signalType}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Expected Voltage:</span>
              <span className="text-white font-bold">{selectedPin.voltage || 'N/A (Signal Line)'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Source Document:</span>
              <span className="text-slate-300 text-[11px] truncate block">{selectedPin.verificationSource}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
