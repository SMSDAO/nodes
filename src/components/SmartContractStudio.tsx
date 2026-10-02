import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Cpu, 
  Database, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Terminal, 
  Activity, 
  Lock, 
  ArrowRight, 
  Plus, 
  Workflow, 
  Scale, 
  Coins, 
  History,
  CheckCircle2,
  AlertCircle,
  Code2,
  Layers
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { Block } from '../types';

interface DAppTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Automation' | 'Governance' | 'Finance';
  icon: typeof Workflow;
  status: 'production' | 'beta';
  version: string;
}

const DAPP_TEMPLATES: DAppTemplate[] = [
  {
    id: 'repair-escrow',
    name: 'Automated Repair Escrow',
    description: 'Locks repair funds in a smart contract. Funds are released automatically only when the ELITE Oracle verifies a successful self-healing cycle.',
    category: 'Finance',
    icon: Coins,
    status: 'production',
    version: '1.2.0'
  },
  {
    id: 'swarm-dao',
    name: 'Elite Swarm DAO',
    description: 'Decentralized governance for prioritizing repair swarms and resource allocation across Kubernetes clusters.',
    category: 'Governance',
    icon: Scale,
    status: 'production',
    version: '2.1.4'
  },
  {
    id: 'fips-multisig',
    name: 'FIPS Multi-Sig Auditor',
    description: 'Requires M-of-N FIPS-certified auditors to sign off on cryptographic seals before blockchain commitment.',
    category: 'Automation',
    icon: ShieldCheck,
    status: 'production',
    version: '1.0.5'
  },
  {
    id: 'oracle-bridge',
    name: 'ML Oracle Data Bridge',
    description: 'Bridges real-time ML telemetry from the Universal Auto-Repair system into smart contract state variables.',
    category: 'Automation',
    icon: Cpu,
    status: 'beta',
    version: '0.9.2'
  },
  {
    id: 'bridge-validator',
    name: 'Cross-Chain Bridge Validator',
    description: 'Ensures cryptographic consistency between ATOMIC Native and external EVM chains. Automatically halts bridging if FIPS KAT tests fail on either side.',
    category: 'Automation',
    icon: Globe,
    status: 'production',
    version: '2.0.1'
  },
  {
    id: 'resource-market',
    name: 'AI Swarm Resource Market',
    description: 'Tokenized marketplace for trading compute power between self-healing swarms. Uses demand-based pricing for Kubernetes pod scaling.',
    category: 'Finance',
    icon: Activity,
    status: 'beta',
    version: '0.8.5'
  }
];

interface SmartContractStudioProps {
  blocks: Block[];
  deployContract: (network: string, contractName: string, payload: any) => string;
  executeContract: (network: string, contractAddress: string, action: string, payload: any) => void;
  NETWORKS: string[];
  activeNetwork: string;
  deployedContracts: {address: string, name: string, network: string, template: string}[];
}

export function SmartContractStudio({ blocks, deployContract, executeContract, NETWORKS, activeNetwork, deployedContracts }: SmartContractStudioProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'workflows' | 'deploy' | 'monitor' | 'interact'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<DAppTemplate | null>(null);
  const [selectedContract, setSelectedContract] = useState<{address: string, name: string, network: string, template: string} | null>(null);
  const [interactionAction, setInteractionAction] = useState('');
  const [interactionPayload, setInteractionActionPayload] = useState('');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeWorkflows, setActiveWorkflows] = useState([
    { id: 'wf-1', trigger: '@selfHeal Success', action: 'Release Escrow', status: 'Armed' },
    { id: 'wf-2', trigger: 'FIPS Violation', action: 'Quarantine Node', status: 'Monitoring' }
  ]);

  const handleDeployTemplate = () => {
    if (!selectedTemplate) return;
    setIsDeploying(true);
    setDeploymentLogs([`[STUDIO] Initializing deployment for ${selectedTemplate.name}...`]);
    
    setTimeout(() => {
      setDeploymentLogs(prev => [...prev, `[VM] Compiling ${selectedTemplate.category} logic into optimized bytecode...`]);
      setTimeout(() => {
        setDeploymentLogs(prev => [...prev, `[VM] Validating FIPS-140-2 cryptographic signatures...`]);
        setTimeout(() => {
          const addr = deployContract(activeNetwork, selectedTemplate.name, { 
            template: selectedTemplate.id, 
            version: selectedTemplate.version,
            fipsValidated: true 
          });
          setDeploymentLogs(prev => [...prev, `[LEDGER] Contract deployed at ${addr}`, `[STUDIO] dApp activated on ${activeNetwork}!`]);
          setIsDeploying(false);
        }, 1000);
      }, 800);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 glow-border-purple">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl glow-border-purple">
              <Rocket className="text-purple-400 glow-text-purple w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                ATOMIC dApp Studio
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">V2.4</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Deploy sophisticated decentralized applications and automated workflows on the ATOMIC LEDGER.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Active Network</span>
                <span className="text-blue-400 font-bold glow-text-blue flex items-center gap-1.5">
                   <Globe size={12} /> {activeNetwork}
                </span>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-border-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Layers size={14} /> dApp Templates
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'workflows'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 glow-border-blue'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Workflow size={14} /> Automation Workflows
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'deploy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-border-green'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Terminal size={14} /> Contract Deployment
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'monitor'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 glow-border-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Activity size={14} /> Live State Monitor
          </button>
          <button
            onClick={() => setActiveTab('interact')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'interact'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 glow-border-blue'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Plus size={14} /> Contract Interaction
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Explorer/Library */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {DAPP_TEMPLATES.map((template) => (
                 <motion.div 
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`glass-card p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col ${
                      selectedTemplate?.id === template.id ? 'border-purple-500/60 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700'
                    }`}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <div className={`p-2.5 rounded-xl ${
                         template.category === 'Finance' ? 'bg-amber-500/10 text-amber-400' :
                         template.category === 'Governance' ? 'bg-blue-500/10 text-blue-400' :
                         'bg-purple-500/10 text-purple-400'
                       }`}>
                          <template.icon size={20} />
                       </div>
                       <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{template.version}</span>
                    </div>
                    <h4 className="text-lg font-display font-bold text-white mb-2">{template.name}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1">{template.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                       <span className="text-[10px] font-mono text-slate-500">{template.category} dApp</span>
                       <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                         template.status === 'production' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                       }`}>
                          {template.status.toUpperCase()}
                       </span>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Workflow className="text-blue-400 glow-text-blue" size={20} />
                  Automation Workflow Builder
                </h3>
                <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all">
                  <Plus size={14} /> New Workflow
                </button>
              </div>

              <div className="space-y-4">
                {activeWorkflows.map((wf) => (
                  <div key={wf.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 flex items-center gap-4">
                       <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs text-blue-300">
                          IF <span className="text-white font-bold">{wf.trigger}</span>
                       </div>
                       <ArrowRight size={16} className="text-slate-600" />
                       <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs text-emerald-300">
                          THEN <span className="text-white font-bold">{wf.action}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <div className={`w-1.5 h-1.5 rounded-full ${wf.status === 'Armed' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></div>
                          {wf.status.toUpperCase()}
                       </span>
                       <button className="text-slate-500 hover:text-white transition-colors">
                          <Terminal size={14} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                 <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800">
                    <Workflow size={32} className="text-slate-600" />
                 </div>
                 <div>
                    <h4 className="text-slate-300 font-semibold">Visual Workflow Designer</h4>
                    <p className="text-slate-500 text-xs max-w-sm mt-1">Connect on-chain events to automated smart contract executions without writing code.</p>
                 </div>
                 <button className="text-xs font-mono text-blue-400 hover:text-white border border-blue-500/30 px-4 py-2 rounded-lg bg-blue-500/10">
                    Open Visual Builder
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Code2 className="text-emerald-400 glow-text-green" size={20} />
                 Advanced Contract Deployment
               </h3>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Compiler Version</label>
                      <select className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-mono bg-slate-950">
                        <option>Solidity v0.8.20</option>
                        <option>Vyper v0.3.10</option>
                        <option>Rust v1.75.0 (WASM)</option>
                        <option>Go v1.21.0 (TinyGo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Optimization Level</label>
                      <select className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-mono bg-slate-950">
                        <option>Default (200 runs)</option>
                        <option>Aggressive (999 runs)</option>
                        <option>Size Optimized</option>
                      </select>
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Contract Source / Bytecode</label>
                     <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 min-h-[200px] shadow-inner">
                        <span className="text-emerald-400 font-bold">// Atomic dApp Source v2.4</span><br/>
                        <span className="text-blue-400">contract</span> <span className="text-white">AtomicAutomation</span> {"{"}<br/>
                        &nbsp;&nbsp;<span className="text-slate-500">/* FIPS 140-2 validated payload signing */</span><br/>
                        &nbsp;&nbsp;<span className="text-purple-400">function</span> <span className="text-white">executeHealTask</span>(bytes32 taskId) <span className="text-purple-400">external</span> {"{"}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;...<br/>
                        &nbsp;&nbsp;{"}"}<br/>
                        {"}"}
                        <div className="animate-pulse inline-block w-2 h-4 bg-blue-500 ml-1 translate-y-1"></div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <button className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 py-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-green shadow-lg">
                        <ShieldCheck size={16} /> Validate & Deploy to {activeNetwork}
                     </button>
                     <button className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                        <History size={18} />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'interact' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Terminal className="text-blue-400 glow-text-blue" size={20} />
                 Smart Contract Execution Interface
              </h3>

              {deployedContracts.length === 0 ? (
                <div className="text-center py-10 space-y-4 border-2 border-dashed border-slate-800 rounded-2xl">
                   <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800 w-fit mx-auto opacity-30">
                      <Terminal size={32} className="text-slate-500" />
                   </div>
                   <p className="text-xs text-slate-500 italic max-w-[220px] mx-auto">No active deployments found on the ATOMIC LEDGER. Deploy a template to begin interaction.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Select Target Contract</label>
                        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                           {deployedContracts.map((c) => (
                             <div 
                                key={c.address}
                                onClick={() => setSelectedContract(c)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                  selectedContract?.address === c.address ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                                }`}
                             >
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-xs font-bold text-white">{c.name}</span>
                                   <span className="text-[9px] font-mono text-blue-400 uppercase">{c.network}</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate">{c.address}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {selectedContract ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                           <div>
                              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Function / Action</label>
                              <input 
                                 type="text" 
                                 placeholder="e.g., authorizeRepair(0x92...)"
                                 value={interactionAction}
                                 onChange={e => setInteractionAction(e.target.value)}
                                 className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-mono"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Payload Data (JSON)</label>
                              <textarea 
                                 placeholder='{"reason": "test_failure"}'
                                 value={interactionPayload}
                                 onChange={e => setInteractionActionPayload(e.target.value)}
                                 className="w-full glass-input rounded-xl px-4 py-2.5 text-xs font-mono min-h-[80px]"
                              />
                           </div>
                           <button 
                              onClick={() => {
                                 if (!interactionAction) return;
                                 setIsInteracting(true);
                                 setTimeout(() => {
                                    executeContract(activeNetwork, selectedContract.address, interactionAction, { data: interactionPayload });
                                    setIsInteracting(false);
                                    setInteractionAction('');
                                    setInteractionActionPayload('');
                                 }, 1200);
                              }}
                              disabled={isInteracting || !interactionAction}
                              className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 py-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-blue shadow-lg disabled:opacity-50"
                           >
                              {isInteracting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                              {isInteracting ? 'Transmitting Payload...' : 'Execute dApp Transaction'}
                           </button>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center">
                           <p className="text-xs text-slate-500 italic">Select a contract from the list to view available interface hooks.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Activity className="text-amber-400 glow-text-orange" size={20} />
                 Live State & Liquidity Monitor
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Escrow Vault</span>
                       <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">SYNCED</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-white glow-text-blue">48,250.00 <span className="text-xs font-mono text-slate-500">AL</span></div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Pending Release</span>
                          <span className="text-amber-400">12,400 AL</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[25%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">DAO Voting Power</span>
                       <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-white glow-text-purple">128 <span className="text-xs font-mono text-slate-500">ELITE VOTERS</span></div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Quorum Progress</span>
                          <span className="text-emerald-400">78%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[78%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-1">Recent dApp Internal Events</h4>
                 <div className="space-y-2">
                    {[
                      { time: '14:22:01', msg: 'Escrow #X82 released funds to worker-09.', type: 'success' },
                      { time: '14:15:45', msg: 'DAO Proposal #42: Add Go Modules support - PASSED.', type: 'info' },
                      { time: '13:58:12', msg: 'FIPS Multi-Sig: 2/3 signatures collected for block #291.', type: 'warning' }
                    ].map((ev, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-mono py-2 px-3 bg-slate-900/50 rounded-lg border border-slate-800">
                         <span className="text-slate-500">{ev.time}</span>
                         <span className={ev.type === 'success' ? 'text-emerald-400' : ev.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}>{ev.msg}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Active Deployment & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
             <h3 className="text-base font-semibold text-white flex items-center gap-2">
               <Zap className="text-amber-400 glow-text-orange" size={18} />
               Deployment Control
             </h3>

             {selectedTemplate ? (
               <div className="space-y-5">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Selected</span>
                        <span className="text-[10px] font-mono text-purple-400 font-bold">TEMPLATE</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                           <selectedTemplate.icon size={16} className="text-purple-400" />
                        </div>
                        <div className="font-display font-bold text-sm text-white">{selectedTemplate.name}</div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Target Network</label>
                     <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                        <select className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 appearance-none">
                           {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                     </div>
                  </div>

                  <button 
                    onClick={handleDeployTemplate}
                    disabled={isDeploying}
                    className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/50 py-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-purple shadow-lg disabled:opacity-50"
                  >
                    {isDeploying ? <Loader2 className="animate-spin" size={16} /> : <Rocket size={16} />}
                    {isDeploying ? 'Processing Deployment...' : 'Initiate Deployment'}
                  </button>

                  {deploymentLogs.length > 0 && (
                    <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1 shadow-inner max-h-[160px] overflow-y-auto">
                       {deploymentLogs.map((log, i) => (
                         <div key={i} className={log.includes('[LEDGER]') ? 'text-emerald-400' : log.includes('[VM]') ? 'text-blue-400' : ''}>{log}</div>
                       ))}
                       {isDeploying && <div className="animate-pulse">_</div>}
                    </div>
                  )}
               </div>
             ) : (
               <div className="text-center py-10 space-y-4">
                  <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800 w-fit mx-auto opacity-30">
                     <Rocket size={32} className="text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-500 italic max-w-[180px] mx-auto">Select a dApp template from the library to begin deployment.</p>
               </div>
             )}
          </div>

          {/* Ledger Stats Hub */}
          <div className="glass-card rounded-2xl p-6 bg-blue-600/5 border-blue-500/20">
             <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
               <Database className="text-blue-400 glow-text-blue" size={18} />
               Ledger Integration
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                   <span className="text-slate-500">Blocks Scanned</span>
                   <span className="text-blue-400 font-bold">{blocks.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                   <span className="text-slate-500">Active dApps</span>
                   <span className="text-purple-400 font-bold">14</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                   <span className="text-slate-500">Cross-Chain Sync</span>
                   <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                   <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">Last dApp Action</div>
                   <div className="text-[11px] font-mono text-slate-300 flex items-center gap-2">
                      <History size={12} className="text-slate-500" />
                      deploy_escrow_v1.2
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={className}
    >
      <Activity size={size} />
    </motion.div>
  );
}
