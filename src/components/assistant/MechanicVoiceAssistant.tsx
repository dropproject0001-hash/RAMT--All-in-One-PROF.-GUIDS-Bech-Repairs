import React, { useState } from 'react';
import { TAGALOG_KNOWLEDGE } from '../../data/tagalogKnowledge';
import { Bot, Send, User, Sparkles, Wrench, Search, Cpu, Activity, AlertTriangle } from 'lucide-react';
import { TabType } from '../layout/DrawerNavigation';

interface Props {
  selectedEcuId: string;
  setActiveTab: (tab: TabType) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionCommand?: string;
  timestamp: string;
}

export const MechanicVoiceAssistant: React.FC<Props> = ({ selectedEcuId, setActiveTab }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_init',
      sender: 'assistant',
      text: 'Magandang araw Boss Technician! Ako ang RAMT ECU Bench Repair Assistant. Maaari mo akong tanungin tungkol sa DTC codes, 5V VC rail troubleshooting, CAN Bus resistance (60Ω), at component testing sa Tagalog.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!inputQuery.trim()) return;

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryLower = inputQuery.toLowerCase();
    setInputQuery('');

    // Check offline Tagalog knowledge base first
    const offlineMatch = TAGALOG_KNOWLEDGE.find((item) =>
      item.keywords.some((kw) => queryLower.includes(kw))
    );

    if (offlineMatch) {
      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: offlineMatch.answerTagalog,
        actionCommand: offlineMatch.actionCommand,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    // Call server Gemini API endpoint /api/assistant
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `User technician question: "${queryLower}". Provide diagnostic bench repair steps in Tagalog, keeping technical electronics terms in English.`,
          systemInstruction:
            'You are RAMT (Ruben Automotive Modern Tech) ECU Bench-Repair Assistant. ' +
            'Provide accurate automotive ECU hardware repair guidance in Tagalog with English technical terms. ' +
            'Never invent pinouts or voltages.',
        }),
      });

      const data = await response.json();
      const replyText = data.text || data.message || 'Maaari mong i-check ang DTC Lookup o Component Readings para sa verified OEM data.';

      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `msg_a_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Paumanhin Boss, i-check ang iyong network connection o gamitin ang offline DTC Lookup at Component Readings tools.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleActionClick = (cmd: string) => {
    if (cmd === 'OPEN_PINOUT') setActiveTab('pinout');
    if (cmd === 'OPEN_DTC') setActiveTab('dtc');
    if (cmd === 'OPEN_READINGS') setActiveTab('readings');
    if (cmd === 'OPEN_SCHEMATICS') setActiveTab('schematics');
    if (cmd === 'OPEN_SIMULATOR') setActiveTab('simulator');
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                TAGALOG TECH ASSISTANT
              </span>
              <span className="text-xs text-slate-400">Gemini 3.8 Flash Powered</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">RAMT Bench Repair Voice & Chat AI</h2>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`text-[10px] font-mono ${
                    msg.sender === 'user' ? 'text-slate-900/80' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Quick Action Button */}
                {msg.actionCommand && (
                  <button
                    onClick={() => handleActionClick(msg.actionCommand!)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>BUKSAN ANG BENCH TOOL ({msg.actionCommand.replace('OPEN_', '')})</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Nagsusuri sa RAMT Repair Knowledge Base...</span>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Magtanong sa Tagalog (halimbawa: Paano i-check ang 5V VC short o CAN 60 ohms?)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputQuery.trim() || isAiLoading}
            className="px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>IPASA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
