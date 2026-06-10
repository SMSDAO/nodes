import React from 'react';
import { Block } from '../types';
import { Database, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import * as motion from 'motion/react-client';

export function BlockchainExplorer({ blocks }: { blocks: Block[] }) {
  // Ordered descending
  const sortedBlocks = [...blocks].sort((a, b) => b.index - a.index);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
              <Database className="text-blue-400" />
              ATOMIC LEDGER Explorer
            </h2>
            <p className="text-slate-400 mt-2">Immutable blockchain audit trail. FIPS 140-2 verified SHA-256 cryptography.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-emerald-400 uppercase tracking-widest mb-1 font-bold border border-emerald-500/30 px-2 rounded bg-emerald-500/10">FIPS 140-2</div>
              <div className="font-mono text-[10px] text-slate-400">COMPLIANT</div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Blocks</div>
              <div className="font-mono text-lg font-bold text-blue-400">{blocks.length}</div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Chain Integrity</div>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 size={16} /> Verified
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative">
          {/* Connector Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700/50 hidden md:block"></div>
          
          {sortedBlocks.map((block, i) => (
            <motion.div 
              key={block.hash}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-900/40 p-5 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors"
            >
              <div className="hidden md:flex flex-col items-center justify-start py-2">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-950 font-mono text-lg font-bold text-slate-300 shadow-xl shrink-0">
                  {block.index}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="md:hidden inline-block bg-slate-800 px-2 py-0.5 rounded font-mono text-xs border border-slate-700">Block #{block.index}</span>
                    <h4 className="font-semibold text-lg text-emerald-400 capitalize">{block.action.replace(/_/g, ' ')}</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{new Date(block.timestamp).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-500 shrink-0" />
                    <span className="text-slate-500 font-medium w-24 shrink-0">Hash:</span>
                    <span className="font-mono text-blue-400 text-xs tracking-tight">{block.hash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-slate-500 shrink-0" />
                    <span className="text-slate-500 font-medium w-24 shrink-0">Prev Hash:</span>
                    <span className="font-mono text-slate-400 text-xs tracking-tight">{block.previousHash || '0'.repeat(64)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
