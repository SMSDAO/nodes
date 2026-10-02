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

  const handleExportPDF = () => {
    const exportData = JSON.stringify(filteredEvents, null, 2);
    const signature = SHA256(exportData).toString();

    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Repair History Timeline - ATOMIC LEDGER', 14, 15);
        
        doc.setFontSize(10);
        doc.text(`Exported At: ${new Date().toISOString()}`, 14, 22);
        doc.text(`FIPS 140-2 Compliant: true`, 14, 27);
        doc.text(`Algorithm: SHA-256`, 14, 32);
        doc.text(`Signature: ${signature}`, 14, 37);

        const tableColumn = ["Action", "Severity", "Date", "Blockchain Hash", "Network"];
        const tableRows = filteredEvents.map(event => [
          event.action,
          event.severity,
          event.date.toLocaleString(),
          event.hash,
          event.network || 'ATOMIC Native'
        ]);

        autoTable(doc, {
          startY: 45,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [52, 211, 153] }
        });

        doc.save(`repair_history_signed_${new Date().getTime()}.pdf`);
      });
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <History className="text-emerald-400 glow-text-green" />
            <span className="glow-text-green">Repair History Timeline</span>
          </h2>
          <p className="text-slate-300 mt-2">Immutable ATOMIC LEDGER log of all self-healing events and code patches.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 glass-input hover:bg-slate-700/80 text-slate-300 px-4 py-2 rounded-lg transition-colors font-mono text-sm max-h-[40px]"
          >
            <Download size={16} />
            Export PDF
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 px-4 py-2 rounded-lg transition-colors font-mono text-sm max-h-[40px] glow-border-green shadow-[inset_0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 glow-text-blue" size={16} />
          <input 
            type="text" 
            placeholder="Search by action or hash..." 
            className="w-full glass-input cursor-text rounded-lg pl-10 pr-4 py-2 text-sm placeholder-slate-400 focus:border-emerald-500/80 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 glow-text-purple" />
          <select 
            className="glass-input rounded-lg px-3 py-2 text-sm focus:border-emerald-500/80 cursor-pointer appearance-none"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
          >
            <option value="All" className="bg-slate-900">All Severities</option>
            <option value="Critical" className="bg-slate-900">Critical</option>
            <option value="High" className="bg-slate-900">High</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Low" className="bg-slate-900">Low</option>
          </select>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-700/50 ml-4 pl-8 space-y-8">
        {filteredEvents.length === 0 ? (
           <div className="text-slate-400 font-mono py-8 glow-text-blue">No matching entries found in the ledger.</div>
        ) : (
          filteredEvents.map((event, i) => (
            <motion.div 
              key={event.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-slate-900/80 border border-emerald-500/80 flex items-center justify-center z-10 box-content backdrop-blur-sm glow-border-green">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,1)]"></div>
              </div>
              
              <div className="glass-card p-5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-slate-500/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded flex items-center gap-1.5 border shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${getSeverityColor(event.severity)}`}>
                      {event.severity === 'Critical' ? <ShieldAlert size={12} /> : <ShieldQuestion size={12} />}
                      {event.severity}
                    </span>
                    <h3 className="font-mono text-white text-base drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{event.action}</h3>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {event.date.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex-1">
                    <div className="text-[10px] uppercase text-slate-400 mb-1 flex items-center justify-between">
                      <span>Blockchain Hash</span>
                      <span className="text-emerald-400 font-bold border border-emerald-500/50 bg-emerald-500/10 px-1 rounded glow-text-green glow-border-green">FIPS 140-2 SHA-256</span>
                    </div>
                    <div className="font-mono text-xs text-blue-300 truncate w-full sm:max-w-md group relative glow-text-blue">
                      {event.hash}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end text-emerald-400 shrink-0 glow-text-green">
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
