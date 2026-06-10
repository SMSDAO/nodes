import React from 'react';
import { K8sPod } from '../types';
import { Server, Activity, ShieldAlert, Cpu, Network, Zap } from 'lucide-react';
import * as motion from 'motion/react-client';

interface KubernetesOperatorProps {
  pods: K8sPod[];
  onForceFailure: () => void;
}

export function KubernetesOperator({ pods, onForceFailure }: KubernetesOperatorProps) {
  const healthyCount = pods.filter(p => p.status === 'Running').length;
  const inProgressCount = pods.filter(p => p.status !== 'Running').length;
  
  const getStatusColor = (status: K8sPod['status']) => {
    switch(status) {
      case 'Running': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'CrashLoopBackOff': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Healing': return 'text-amber-400 bg-amber-400/10 border-amber-400/30 animate-pulse';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const getLangBadge = (lang: string) => {
    switch(lang) {
      case 'Node.js':
      case 'JavaScript': 
      case 'React': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Python': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Rust': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Go': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'TypeScript': return 'bg-blue-600/20 text-blue-500 border-blue-600/30';
      case 'Shell':
      case 'PowerShell':
      case 'Git': return 'bg-slate-700/20 text-slate-300 border-slate-700/30';
      case 'HTML': return 'bg-orange-600/20 text-orange-500 border-orange-600/30';
      case 'YAML':
      case 'Workflows': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <Server className="text-blue-400" />
            Kubernetes Auto-Healing Operator
          </h2>
          <p className="text-slate-400 mt-2">Real-time workload management across multi-language clusters.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-700/50">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cluster Health</div>
            <div className="font-mono text-lg font-bold text-emerald-400">{Math.round((healthyCount / pods.length) * 100)}%</div>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <button 
            onClick={onForceFailure}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium px-3 py-1.5 rounded transition-colors border border-red-500/30"
          >
            <ShieldAlert size={16} /> Force Pod Failure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pods.map(pod => (
          <motion.div 
            key={pod.id}
            layout
            className="glass-panel p-5 rounded-xl border border-slate-700/50 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <Network className={pod.status === 'Running' ? 'text-emerald-400' : 'text-red-400'} size={20} />
                <div>
                  <h3 className="font-mono font-bold text-slate-200">{pod.name}</h3>
                  <div className="flex gap-2 mt-1">
                     <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getLangBadge(pod.language)}`}>
                       {pod.language}
                     </span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getStatusColor(pod.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pod.status === 'Running' ? 'bg-emerald-400' : pod.status === 'CrashLoopBackOff' ? 'bg-red-400' : 'bg-amber-400 animate-pulse'}`}></span>
                {pod.status === 'Running' ? 'Healthy' : pod.status === 'CrashLoopBackOff' ? 'Failed' : pod.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-slate-950/50 rounded-lg relative z-10 border border-slate-800/50">
              <div className="text-slate-500">Uptime: <span className="text-slate-300 block">{pod.uptime}</span></div>
              <div className="text-slate-500">Restarts: <span className="text-slate-300 block">{pod.restarts} (verified)</span></div>
            </div>

            {/* Background glowing effect for healing pods */}
            {pod.status === 'Healing' && (
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent animate-pulse rounded-xl" />
            )}
             {pod.status === 'CrashLoopBackOff' && (
               <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-5 border border-slate-700/50 mt-6">
         <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
           <Zap className="text-blue-400" size={18} /> Operator Live Rules
         </h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 shadow-inner">
               <div className="text-slate-400 mb-1 text-xs">Rule 01: Healing</div>
               <div className="text-slate-200 font-medium">Automatic Pod Restart &lt; 2s</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 shadow-inner">
               <div className="text-slate-400 mb-1 text-xs">Rule 02: Verification</div>
               <div className="text-slate-200 font-medium">Write restart to ATOMIC LEDGER</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 shadow-inner">
               <div className="text-slate-400 mb-1 text-xs">Rule 03: Multi-lang</div>
               <div className="text-slate-200 font-medium">Cross-compile Rust/Go validation</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 shadow-inner">
               <div className="text-slate-400 mb-1 text-xs">Rule 04: AI Policy</div>
               <div className="text-slate-200 font-medium">ML predictive instance scaling</div>
            </div>
         </div>
      </div>
    </div>
  );
}
