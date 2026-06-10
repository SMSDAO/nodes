import React, { useState } from 'react';
import { Block } from '../types';
import { Database, Lock, ArrowRight, CheckCircle2, Cpu, Globe, Rocket, Terminal, Layers, Fuel } from 'lucide-react';
import * as motion from 'motion/react-client';

interface ExplorerProps {
  blocks: Block[];
  deployContract: (network: string, contractName: string, payload: any) => string;
  executeContract: (network: string, contractAddress: string, action: string, payload: any) => void;
  NETWORKS: string[];
  activeNetwork: string;
  setActiveNetwork: (network: string) => void;
}

const getGasEstimate = (network: string) => {
  switch (network) {
    case 'ATOMIC Native':
      return { cost: '0.001 AL', congestion: 'Low', time: '< 1s' };
    case 'Ethereum Mainnet':
      return { cost: '45 gwei ($2.10)', congestion: 'High', time: '~ 15s' };
    case 'Polygon PoS':
      return { cost: '120 gwei ($0.02)', congestion: 'Medium', time: '~ 2s' };
    case 'Arbitrum One':
      return { cost: '0.1 gwei ($0.05)', congestion: 'Low', time: '~ 1s' };
    case 'Solana':
      return { cost: '0.000005 SOL ($0.001)', congestion: 'Low', time: '< 1s' };
    case 'Optimism':
      return { cost: '0.001 ETH ($0.04)', congestion: 'Medium', time: '~ 2s' };
    default:
      return { cost: '0.005 TKN', congestion: 'Low', time: '~ 3s' };
  }
};

const GasEstimator = ({ network }: { network: string }) => {
  const estimate = getGasEstimate(network);
  return (
    <div className="bg-slate-900/60 p-4 rounded-xl flex items-center justify-between border border-slate-700/50 glass-panel">
       <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
             <Fuel size={20} className="text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Est. Transaction Fee</div>
            <div className="font-mono text-slate-200 text-lg">{estimate.cost}</div>
          </div>
       </div>
       <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-2 h-2 rounded-full ${estimate.congestion === 'Low' ? 'bg-emerald-400' : estimate.congestion === 'High' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300">{estimate.congestion} Congestion</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tracking-tight">Est. Finality: {estimate.time}</div>
       </div>
    </div>
  );
};

export function BlockchainExplorer({ blocks, deployContract, executeContract, NETWORKS, activeNetwork, setActiveNetwork }: ExplorerProps) {
  // Ordered descending
  const sortedBlocks = [...blocks].sort((a, b) => b.index - a.index);
  
  const [activeTab, setActiveTab] = useState<'explorer' | 'dapps'>('explorer');
  const [deployName, setDeployName] = useState('');
  const [dappAction, setDappAction] = useState('Transfer Ownership');
  const [dappAddress, setDappAddress] = useState('');

  const handleDeploy = () => {
    if (!deployName) return;
    const addr = deployContract(activeNetwork, deployName, { type: 'smart_contract', standard: 'ERC-20/Equivalent' });
    setDappAddress(addr);
    setDeployName('');
  };

  const handleExecute = () => {
    if (!dappAddress) return;
    executeContract(activeNetwork, dappAddress, dappAction, { executedBy: 'user-ui', timestamp: new Date().toISOString() });
    setDappAddress('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Metrics Header */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
              <Database className="text-blue-400" />
              ATOMIC LEDGER
            </h2>
            <p className="text-slate-400 mt-2">Immutable multi-chain audit trail with FIPS 140-2 compliance & dApp execution.</p>
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
               <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Chains</div>
               <div className="font-mono text-lg font-bold text-purple-400">{NETWORKS.length}</div>
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
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mt-8 border-b border-slate-800 pb-px">
          <button 
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${activeTab === 'explorer' ? 'border-blue-400 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
          >
            <div className="flex items-center gap-2"><Layers size={16}/> Ledger Explorer</div>
          </button>
          <button 
            onClick={() => setActiveTab('dapps')}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${activeTab === 'dapps' ? 'border-purple-400 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'}`}
          >
             <div className="flex items-center gap-2"><Cpu size={16}/> Smart Contracts & dApps</div>
          </button>
        </div>
      </div>

      {activeTab === 'dapps' && (
        <div className="space-y-6">
          <GasEstimator network={activeNetwork} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smart Contract Deployer */}
          <div className="glass-panel rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-400">
               <Rocket size={20} /> Deploy Smart Contract
            </h3>
            <div className="space-y-4">
              <div>
                 <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Target Network</label>
                 <div className="relative">
                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                   <select 
                     value={activeNetwork}
                     onChange={(e) => setActiveNetwork(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 appearance-none font-mono text-sm"
                   >
                     {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                 </div>
              </div>
              <div>
                 <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Contract Name</label>
                 <input 
                   type="text" 
                   placeholder="e.g. HealingDAO Token"
                   value={deployName}
                   onChange={e => setDeployName(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 font-mono text-sm"
                 />
              </div>
              <button 
                onClick={handleDeploy}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 rounded-lg px-4 py-2.5 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Cpu size={18} /> Initialize Contract
              </button>
            </div>
          </div>

          {/* DApp Execution */}
          <div className="glass-panel rounded-xl p-6 border border-slate-700/50">
             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
               <Terminal size={20} /> Execute dApp Agreement
            </h3>
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Contract Address</label>
                  <input 
                   type="text" 
                   placeholder="0x..."
                   value={dappAddress}
                   onChange={e => setDappAddress(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono text-sm"
                 />
               </div>
               <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Action</label>
                  <select 
                     value={dappAction}
                     onChange={(e) => setDappAction(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 appearance-none font-mono text-sm"
                   >
                     <option>Transfer Ownership</option>
                     <option>Authorize Auto-Repair</option>
                     <option>Mint Proof of Healing</option>
                     <option>Revoke Privileges</option>
                   </select>
               </div>
               <button 
                onClick={handleExecute}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 rounded-lg px-4 py-2.5 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Database size={18} /> Broadcast Transaction
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div className="glass-panel rounded-xl p-6">
          <div className="space-y-4 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700/50 hidden md:block"></div>
            
            {sortedBlocks.map((block, i) => (
              <motion.div 
                key={block.hash + block.index}
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
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg text-emerald-400 capitalize">{block.action.replace(/_/g, ' ')}</h4>
                          {block.contractAddress && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded text-xs font-mono font-bold">SMART CONTRACT</span>}
                        </div>
                        {block.network && (
                           <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                             <Globe size={12}/> Network: <span className="font-mono text-slate-300">{block.network}</span>
                           </div>
                        )}
                      </div>
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
                    {block.contractAddress && (
                       <div className="flex items-center gap-2 border-t border-slate-800 pt-2 mt-1">
                          <Cpu size={14} className="text-purple-400 shrink-0" />
                          <span className="text-purple-400/80 font-medium w-24 shrink-0">Contract:</span>
                          <span className="font-mono text-purple-300 text-xs tracking-tight">{block.contractAddress}</span>
                       </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
