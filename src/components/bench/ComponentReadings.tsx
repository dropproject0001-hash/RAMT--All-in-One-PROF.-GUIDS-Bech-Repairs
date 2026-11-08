import React, { useState, useEffect } from 'react';
import { COMPONENT_READINGS } from '../../data/componentReadings';
import { COMMON_BOARD_FAILURES } from '../../data/pcbData';
import { ECU_PROFILES } from '../../data/ecuProfiles';
import { ComponentReading, MeasuredReading } from '../../types/ecu';
import { Activity, Download, Save, CheckCircle2, XCircle, AlertTriangle, FileText, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Props {
  selectedEcuId: string;
}

export const ComponentReadings: React.FC<Props> = ({ selectedEcuId }) => {
  const currentEcu = ECU_PROFILES[selectedEcuId] || ECU_PROFILES.denso_1gd_hilux;
  
  const [technicianName, setTechnicianName] = useState<string>('Bench Tech Ruben');
  const [technicianNotes, setTechnicianNotes] = useState<string>('');
  const [measuredValues, setMeasuredValues] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Filter component readings for selected ECU
  const ecuReadings = COMPONENT_READINGS.filter((r) => r.ecuId === selectedEcuId);

  // Compute status for a reading item based on technician input
  const calculateStatus = (item: ComponentReading, inputVal: string): 'PASS' | 'FAIL' | 'UNVERIFIED' | 'PENDING' => {
    if (!inputVal || inputVal.trim() === '') return 'PENDING';
    if (!item.verified) return 'UNVERIFIED';

    const num = parseFloat(inputVal);
    if (isNaN(num)) return 'FAIL';

    // Extract tolerance numeric value if possible
    let tol = 0.05;
    if (item.tolerance.includes('±')) {
      const match = item.tolerance.match(/±([0-9.]+)/);
      if (match) tol = parseFloat(match[1]);
    }

    const min = item.expectedValue - tol;
    const max = item.expectedValue + tol;

    if (num >= min && num <= max) {
      return 'PASS';
    }
    return 'FAIL';
  };

  const handleInputChange = (id: string, val: string) => {
    setMeasuredValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleSaveSession = () => {
    const sessionData = {
      ecuId: selectedEcuId,
      timestamp: new Date().toISOString(),
      technicianName,
      technicianNotes,
      measuredValues,
    };
    localStorage.setItem(`ramt_readings_${selectedEcuId}`, JSON.stringify(sessionData));
    setSavedStatus('Readings saved to local session!');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    // Header Branding
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(245, 158, 11); // amber-500
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RAMT AUTOMOTIVE BENCH REPAIR', 14, 16);

    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.setFont('helvetica', 'normal');
    doc.text('Ruben Automotive Modern Tech - Component Diagnostic Report', 14, 24);

    // Metadata section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`ECU Model: ${currentEcu.name}`, 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Engine / Vehicle: ${currentEcu.model} (${currentEcu.engine})`, 14, 48);
    doc.text(`Technician: ${technicianName}`, 14, 54);
    doc.text(`Date & Time: ${dateStr}`, 14, 60);

    // Summary count
    let passCount = 0;
    let failCount = 0;
    let unverifiedCount = 0;

    ecuReadings.forEach((r) => {
      const st = calculateStatus(r, measuredValues[r.id] || '');
      if (st === 'PASS') passCount++;
      if (st === 'FAIL') failCount++;
      if (st === 'UNVERIFIED') unverifiedCount++;
    });

    doc.text(`Summary: PASS (${passCount})  |  FAIL (${failCount})  |  UNVERIFIED (${unverifiedCount})`, 14, 68);

    // Line Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 72, 196, 72);

    // Table Header
    let y = 80;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Test Point & Target', 16, y + 5.5);
    doc.text('Expected', 85, y + 5.5);
    doc.text('Measured', 125, y + 5.5);
    doc.text('Status', 165, y + 5.5);

    y += 10;
    doc.setFont('helvetica', 'normal');

    ecuReadings.forEach((r) => {
      const val = measuredValues[r.id] || 'N/A';
      const st = calculateStatus(r, val);

      doc.text(r.name.substring(0, 36), 16, y);
      doc.text(`${r.expectedDisplay} (${r.unit})`, 85, y);
      doc.text(val, 125, y);

      if (st === 'PASS') {
        doc.setTextColor(22, 163, 74); // green
        doc.text('PASS', 165, y);
      } else if (st === 'FAIL') {
        doc.setTextColor(220, 38, 38); // red
        doc.text('FAIL', 165, y);
      } else if (st === 'UNVERIFIED') {
        doc.setTextColor(217, 119, 6); // amber
        doc.text('UNVERIFIED', 165, y);
      } else {
        doc.setTextColor(100, 116, 139);
        doc.text('PENDING', 165, y);
      }

      doc.setTextColor(15, 23, 42);
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Notes
    if (technicianNotes) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Technician Bench Notes:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(technicianNotes, 14, y + 5);
    }

    doc.save(`RAMT_ECU_Report_${selectedEcuId}_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              COMPONENT READINGS LOG
            </span>
            <span className="text-xs text-slate-400">Multimeter / Oscilloscope Bench Probing</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {currentEcu.name} Baseline Readings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare actual bench multimeter measurements with verified OEM baselines.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveSession}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Session</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/10"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {savedStatus && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedStatus}</span>
        </div>
      )}

      {/* Technician Metadata Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            Technician Name / Shop
          </label>
          <input
            type="text"
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            Diagnostic & Repair Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Replaced shorted MLCC cap C105, 5V rail restored to 5.00V."
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Readings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Verified Test Points ({ecuReadings.length} Configured)
        </h3>

        {ecuReadings.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No pre-configured readings available for this specific ECU profile.
          </div>
        ) : (
          <div className="space-y-4">
            {ecuReadings.map((item) => {
              const inputVal = measuredValues[item.id] || '';
              const status = calculateStatus(item, inputVal);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    status === 'FAIL'
                      ? 'bg-red-950/20 border-red-500/40'
                      : status === 'PASS'
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : status === 'UNVERIFIED'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{item.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            item.verified
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.verified ? 'VERIFIED BASELINE' : 'UNVERIFIED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Condition: <span className="text-slate-300 font-medium">{item.testCondition}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Source: <span className="font-mono text-slate-400">{item.source}</span>
                      </p>
                    </div>

                    {/* Expected vs Measured Input */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Expected Baseline</span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {item.expectedDisplay} <span className="text-[10px] font-normal text-slate-400">({item.tolerance})</span>
                        </span>
                      </div>

                      <div className="w-32">
                        <span className="text-[10px] text-slate-500 block uppercase mb-1">Measured Value</span>
                        <input
                          type="text"
                          placeholder={`Enter (${item.unit})`}
                          value={inputVal}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Status Badge */}
                      <div className="w-28 text-center">
                        <span className="text-[10px] text-slate-500 block uppercase mb-1">Evaluation</span>
                        {status === 'PASS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                          </span>
                        )}
                        {status === 'FAIL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold font-mono">
                            <XCircle className="w-3.5 h-3.5" /> FAIL
                          </span>
                        )}
                        {status === 'UNVERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold font-mono">
                            <AlertTriangle className="w-3.5 h-3.5" /> UNVERIFIED
                          </span>
                        )}
                        {status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Probable Failure Diagnostic Warning */}
                  {status === 'FAIL' && item.likelyCausesIfFailed && (
                    <div className="mt-3 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-300">
                      <div className="font-bold uppercase tracking-wider mb-1 text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Probable Board Failure Causes (from pcbData.ts):
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 font-sans">
                        {item.likelyCausesIfFailed.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
