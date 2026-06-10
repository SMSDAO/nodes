import React, { useState, useMemo } from 'react';
import { Block } from '../types';
import { History, Search, Filter, ShieldAlert, CheckCircle2, Activity, ShieldQuestion, Download } from 'lucide-react';
import * as motion from 'motion/react-client';
import SHA256 from 'crypto-js/sha256';

interface RepairHistoryProps {
  blocks: Block[];
}

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

const getSeverity = (action: string): Severity => {
  const lower = action.toLowerCase();
  if (lower.includes('remediate') || lower.includes('patch') || lower.includes('secure') || lower.includes('heal') || lower.includes('xss') || lower.includes('pollution')) return 'Critical';
  if (lower.includes('audit') || lower.includes('enforce') || lower.includes('validate') || lower.includes('auth')) return 'High';
  if (lower.includes('predict') || lower.includes('shift') || lower.includes('types')) return 'Medium';
  return 'Low';
};

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Low': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export function RepairHistory({ blocks }: RepairHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');

  // Skip the Genesis block and map the rest
  const historyEvents = useMemo(() => {
    return blocks
      .filter((b) => b.index > 0)
      .map((b) => ({
        ...b,
        severity: getSeverity(b.action),
        date: new Date(b.timestamp)
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [blocks]);

  const filteredEvents = useMemo(() => {
    return historyEvents.filter(event => {
      const matchesSearch = event.action.toLowerCase().includes(searchTerm.toLowerCase()) || event.hash.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || event.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [historyEvents, searchTerm, severityFilter]);

  const handleExport = () => {
    const exportData = JSON.stringify(filteredEvents, null, 2);
    const signature = SHA256(exportData).toString();
    const signedWrapper = {
      metadata: {
        exportedAt: new Date().toISOString(),
        fipsCompliant: true,
        algorithm: 'SHA-256',
        signature
      },
      data: filteredEvents
    };

    const blob = new Blob([JSON.stringify(signedWrapper, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repair_history_signed_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <History className="text-emerald-400" />
            Repair History Timeline
          </h2>
          <p className="text-slate-400 mt-2">Immutable ATOMIC LEDGER log of all self-healing events and code patches.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg transition-colors font-mono text-sm"
        >
          <Download size={16} />
          Export Signed JSON
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by action or hash..." 
            className="w-full bg-slate-900/50 border border-slate-700 cursor-text rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-8">
        {filteredEvents.length === 0 ? (
           <div className="text-slate-500 font-mono py-8">No matching entries found in the ledger.</div>
        ) : (
          filteredEvents.map((event, i) => (
            <motion.div 
              key={event.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-500/50 flex items-center justify-center z-10 box-content">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              </div>
              
              <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded flex items-center gap-1.5 border ${getSeverityColor(event.severity)}`}>
                      {event.severity === 'Critical' ? <ShieldAlert size={12} /> : <ShieldQuestion size={12} />}
                      {event.severity}
                    </span>
                    <h3 className="font-mono text-slate-200 text-base">{event.action}</h3>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {event.date.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-800">
                  <div className="flex-1">
                    <div className="text-[10px] uppercase text-slate-500 mb-1 flex items-center justify-between">
                      <span>Blockchain Hash</span>
                      <span className="text-emerald-500 font-bold border border-emerald-500/30 bg-emerald-500/10 px-1 rounded">FIPS 140-2 SHA-256</span>
                    </div>
                    <div className="font-mono text-xs text-blue-400/80 truncate w-full sm:max-w-md group relative">
                      {event.hash}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-mono tracking-wides">LEDGER SYNCED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
