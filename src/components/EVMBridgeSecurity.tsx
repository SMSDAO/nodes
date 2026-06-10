import React, { useState } from 'react';
import { Wallet, ShieldAlert, Activity, ArrowRightLeft, Cpu, Key, Lock, Server, CheckCircle2, Navigation } from 'lucide-react';
import * as motion from 'motion/react-client';

interface RepairTask {
  id: string;
  target: string;
  status: 'Deploying Mitigation...' | 'Awaiting Confirmation' | 'Secured On-Chain';
  gasFee: string;
  ledgerHash: string;
  timestamp: string;
}

export function EVMBridgeSecurity({ addBlock }: { addBlock?: (action: string) => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [remediating, setRemediating] = useState(false);
  const [bridgeTarget, setBridgeTarget] = useState('0xTargetBridgeContract...');
  const [repairs, setRepairs] = useState<RepairTask[]>([]);

  const handleScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  const handleRemediate = () => {
    setRemediating(true);
    const newRepairId = Math.random().toString(36).substr(2, 9);
    const mockHash = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newTask: RepairTask = {
      id: newRepairId,
      target: bridgeTarget,
      status: 'Deploying Mitigation...',
      gasFee: (Math.random() * 0.05 + 0.01).toFixed(4) + ' ETH',
      ledgerHash: 'Pending...',
      timestamp: new Date().toLocaleTimeString()
    };

    setRepairs(prev => [newTask, ...prev]);

    setTimeout(() => {
      setRepairs(prev => prev.map(t => t.id === newRepairId ? { ...t, status: 'Awaiting Confirmation' } : t));
    }, 1200);

    setTimeout(() => {
      setRemediating(false);
      setRepairs(prev => prev.map(t => t.id === newRepairId ? { ...t, status: 'Secured On-Chain', ledgerHash: mockHash } : t));
      if (addBlock) addBlock('evm_bridge_onchain_remediation');
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <Wallet className="text-purple-400" />
            EVM Bridge & Smart Contract Security
          </h2>
          <p className="text-slate-400 mt-2">Elite node integration to detect and mitigate zero-day re-entrancy and cross-chain bridge vulnerabilities.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-mono flex items-center gap-2">
            <Activity size={12} className="animate-pulse" />
            EVM Nodes: SYNCHRONIZED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-slate-700/50 lg:col-span-1 space-y-6">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Server size={18} className="text-blue-400" />
            Blockchain Target
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1.5 block uppercase tracking-wider">Target EVM Contract / Bridge</label>
              <input 
                type="text" 
                value={bridgeTarget}
                onChange={e => setBridgeTarget(e.target.value)}
                placeholder="0x..."
                className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono"
              />
            </div>
            
            <button 
              onClick={handleScan}
              disabled={analyzing}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>Deep Scanning Bytecode...</>
              ) : (
                <><Cpu size={16} /> Audit EVM Bridge</>
              )}
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/50">
             <h4 className="text-sm font-semibold mb-3">Supported Networks</h4>
             <div className="flex flex-wrap gap-2">
               <span className="text-[10px] uppercase px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Ethereum</span>
               <span className="text-[10px] uppercase px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Arbitrum</span>
               <span className="text-[10px] uppercase px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Optimism</span>
               <span className="text-[10px] uppercase px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Polygon</span>
               <span className="text-[10px] uppercase px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Base</span>
             </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-slate-700/50 lg:col-span-2 relative overflow-hidden">
          {analyzing && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-purple-400 font-mono">
              <Activity size={48} className="animate-spin mb-4" />
              <p className="animate-pulse text-sm">Simulating EVM Execution & Control Flows...</p>
            </div>
          )}

          {!analyzed && !analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 min-h-[300px]">
              <ArrowRightLeft size={48} className="mb-4 opacity-20" />
              <p>Awaiting smart contract analysis.</p>
            </div>
          )}

          {analyzed && !analyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ShieldAlert className="text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-200">Critical Risks Identified</h3>
                  <p className="text-slate-400 text-sm">ATOMIC SWARM has detected severe logic flaws in bridge validation.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-900/50 border border-red-500/20 p-4 rounded-lg flex items-start gap-4">
                  <div className="mt-1"><Key className="text-red-400" size={16} /></div>
                  <div>
                    <h4 className="text-red-400 font-medium text-sm">Cross-Chain Re-Entrancy Vector</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      The target bridge contract does not employ the Checks-Effects-Interactions pattern during cross-chain payload execution. The Elite ML Oracle recommends applying an OpenZeppelin ReentrancyGuard modifier immediately.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-amber-500/20 p-4 rounded-lg flex items-start gap-4">
                  <div className="mt-1"><Lock className="text-amber-400" size={16} /></div>
                  <div>
                    <h4 className="text-amber-400 font-medium text-sm">Unsafe ECDSA Signature Malleability</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      ecrecover validation allows malleable signatures. A relayer could replay bridge transactions under certain gas conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleRemediate}
                  disabled={remediating}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                   {remediating ? 'Executing Transact...' : 'Execute On-Chain Remediation Script'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {repairs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl border border-slate-700/50">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
            <Activity size={18} className="text-purple-400" />
            Active Mitigation & On-Chain Tracking
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono text-slate-400">
              <thead className="text-xs uppercase bg-slate-950/80 text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Target Bridge</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Gas Used</th>
                  <th className="px-4 py-3 font-semibold w-64 block">ATOMIC LEDGER Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {repairs.map(task => (
                  <tr key={task.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-4">{task.timestamp}</td>
                    <td className="px-4 py-4 text-slate-300">{task.target}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold ${task.status === 'Secured On-Chain' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {task.status !== 'Secured On-Chain' && <Activity size={12} className="animate-spin" />}
                        {task.status === 'Secured On-Chain' && <CheckCircle2 size={12} />}
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">{task.gasFee}</td>
                    <td className="px-4 py-4">
                      <span className={`truncate block w-64 ${task.status === 'Secured On-Chain' ? 'text-blue-400 group cursor-help' : 'text-slate-500'}`} title={task.ledgerHash}>
                        {task.ledgerHash}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </div>
  );
}
