import React, { useState } from 'react';
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
  Layers,
  X,
  Trash2,
  Play,
  Monitor,
  Binary,
  ShieldAlert,
  Pause,
  Power,
  RotateCcw,
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { Block, WorkflowAction } from '../types';

interface DAppTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Automation' | 'Governance' | 'Finance';
  icon: typeof Workflow;
  status: 'production' | 'beta';
  version: string;
  language: 'Solidity' | 'Rust (WASM)';
  code: string;
}

const DAPP_TEMPLATES: DAppTemplate[] = [
  {
    id: 'repair-escrow',
    name: 'Automated Repair Escrow',
    description: 'Locks repair funds in a smart contract. Funds are released automatically only when the ELITE Oracle verifies a successful self-healing cycle.',
    category: 'Finance',
    icon: Coins,
    status: 'production',
    version: '1.2.0',
    language: 'Solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RepairEscrow {
    address public oracle;
    mapping(bytes32 => uint256) public taskFunds;
    
    constructor(address _oracle) {
        oracle = _oracle;
    }

    function lockFunds(bytes32 taskId) external payable {
        taskFunds[taskId] = msg.value;
    }

    function releaseFunds(bytes32 taskId) external {
        require(msg.sender == oracle, "Only Oracle can release");
        payable(msg.sender).transfer(taskFunds[taskId]);
    }
}`
  },
  {
    id: 'swarm-dao',
    name: 'Elite Swarm DAO',
    description: 'Decentralized governance for prioritizing repair swarms and resource allocation across Kubernetes clusters.',
    category: 'Governance',
    icon: Scale,
    status: 'production',
    version: '2.1.4',
    language: 'Rust (WASM)',
    code: `use cosmwasm_std::{deps, env, MessageInfo, Response};

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::ProposeRepair { swarm_id } => propose(deps, swarm_id),
        ExecuteMsg::Vote { proposal_id } => vote(deps, info, proposal_id),
    }
}`
  },
  {
    id: 'fips-multisig',
    name: 'FIPS Multi-Sig Auditor',
    description: 'Requires M-of-N FIPS-certified auditors to sign off on cryptographic seals before blockchain commitment.',
    category: 'Automation',
    icon: ShieldCheck,
    status: 'production',
    version: '1.0.5',
    language: 'Solidity',
    code: `contract FIPSMultiSig {
    uint public required;
    mapping(bytes32 => mapping(address => bool)) public signatures;
    
    function signBlock(bytes32 blockHash) external {
        require(isAuditor[msg.sender], "Not authorized");
        signatures[blockHash][msg.sender] = true;
        if (countSignatures(blockHash) >= required) {
            commitBlock(blockHash);
        }
    }
}`
  }
];

interface SmartContractStudioProps {
  blocks: Block[];
  deployContract: (network: string, contractName: string, payload: any) => string;
  executeContract: (network: string, contractAddress: string, action: string, payload: any) => void;
  NETWORKS: string[];
  activeNetwork: string;
  deployedContracts: {address: string, name: string, network: string, template: string, status: 'Active' | 'Paused' | 'Terminated'}[];
  workflows: WorkflowAction[];
  addWorkflow: (workflow: Omit<WorkflowAction, 'id'>) => string;
  removeWorkflow: (id: string) => void;
  updateContractStatus: (address: string, status: 'Active' | 'Paused' | 'Terminated') => void;
}

export function SmartContractStudio({ 
  blocks, 
  deployContract, 
  executeContract, 
  NETWORKS, 
  activeNetwork, 
  deployedContracts,
  workflows,
  addWorkflow,
  removeWorkflow,
  updateContractStatus
}: SmartContractStudioProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'workflows' | 'deploy' | 'monitor' | 'interact' | 'manage'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<DAppTemplate | null>(null);
  const [selectedContract, setSelectedContract] = useState<{address: string, name: string, network: string, template: string, status: 'Active' | 'Paused' | 'Terminated'} | null>(null);
  const [interactionAction, setInteractionAction] = useState('');
  const [interactionPayload, setInteractionActionPayload] = useState('');
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Deployment IDE state
  const [selectedLang, setSelectedLang] = useState<'Solidity' | 'Rust (WASM)'>('Solidity');
  const [customCode, setCustomCode] = useState(DAPP_TEMPLATES[0].code);
  const [contractName, setContractName] = useState('MyCustomContract');

  // Workflow builder state
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    trigger: '@selfHeal Success',
    action: 'Release Escrow'
  });

  const handleDeploy = (name: string, lang: string, code: string, templateId: string = 'custom') => {
    setIsDeploying(true);
    setDeploymentLogs([`[STUDIO] Initializing deployment for ${name}...`]);
    
    setTimeout(() => {
      setDeploymentLogs(prev => [...prev, `[VM] Compiling ${lang} logic into optimized ${lang === 'Solidity' ? 'EVM Bytecode' : 'WASM Binary'}...`]);
      setTimeout(() => {
        setDeploymentLogs(prev => [...prev, `[VM] Validating FIPS-140-2 cryptographic signatures...`]);
        setTimeout(() => {
          const addr = deployContract(activeNetwork, name, { 
            template: templateId, 
            language: lang,
            fipsValidated: true 
          });
          setDeploymentLogs(prev => [...prev, `[LEDGER] Contract deployed at ${addr}`, `[STUDIO] dApp activated on ${activeNetwork}!`]);
          setIsDeploying(false);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name) return;
    addWorkflow({
      ...newWorkflow,
      status: 'Armed'
    });
    setShowWorkflowModal(false);
    setNewWorkflow({ name: '', trigger: '@selfHeal Success', action: 'Release Escrow' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 glow-border-purple relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl glow-border-purple">
              <Rocket className="text-purple-400 glow-text-purple w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                ATOMIC dApp Studio
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">V3.5</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Full lifecycle management: Deploy, execute, and monitor smart contracts on the ATOMIC LEDGER.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs shadow-inner">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Active Target</span>
                <span className="text-blue-400 font-bold glow-text-blue flex items-center gap-1.5">
                   <Globe size={12} /> {activeNetwork}
                </span>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/50">
          {[
            { id: 'templates', label: 'dApp Templates', icon: Layers, color: 'purple' },
            { id: 'workflows', label: 'Automations', icon: Workflow, color: 'blue' },
            { id: 'deploy', label: 'Contract IDE', icon: Terminal, color: 'emerald' },
            { id: 'manage', label: 'Manage & Registry', icon: ShieldCheck, color: 'purple' },
            { id: 'monitor', label: 'Live Monitor', icon: Monitor, color: 'amber' },
            { id: 'interact', label: 'Execution', icon: Play, color: 'blue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 border ${
                activeTab === tab.id
                  ? `bg-${tab.color}-500/20 text-${tab.color}-300 border-${tab.color}-500/40 glow-border-${tab.color === 'emerald' ? 'green' : tab.color}`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
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
                    className={`glass-card p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col group ${
                      selectedTemplate?.id === template.id ? 'border-purple-500/60 bg-purple-500/5' : 'border-slate-800 hover:border-slate-700'
                    }`}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
                         template.category === 'Finance' ? 'bg-amber-500/10 text-amber-400' :
                         template.category === 'Governance' ? 'bg-blue-500/10 text-blue-400' :
                         'bg-purple-500/10 text-purple-400'
                       }`}>
                          <template.icon size={20} />
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{template.language}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">{template.version}</span>
                       </div>
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

          {activeTab === 'manage' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="text-purple-400 glow-text-purple" size={20} />
                    On-Chain Contract Registry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Manage state and access policies for all active dApp instances.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
                   <Search size={14} className="text-slate-500" />
                   <input type="text" placeholder="Filter registry..." className="bg-transparent border-none text-[10px] font-mono text-slate-300 focus:ring-0 w-32" />
                </div>
              </div>

              <div className="space-y-3">
                {deployedContracts.map((c) => (
                  <div key={c.address} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 group hover:border-purple-500/30 transition-all">
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-white">{c.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            c.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' :
                            c.status === 'Paused' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' :
                            'text-red-400 bg-red-500/10 border border-red-500/30'
                          }`}>
                             {c.status}
                          </span>
                       </div>
                       <div className="text-[10px] font-mono text-slate-500 truncate flex items-center gap-2">
                          {c.address}
                          <span className="text-slate-700">|</span>
                          <span className="text-blue-500/80">{c.network}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => updateContractStatus(c.address, c.status === 'Active' ? 'Paused' : 'Active')}
                        title={c.status === 'Active' ? 'Pause Contract' : 'Resume Contract'}
                        className={`p-2 rounded-lg border transition-all ${
                          c.status === 'Active' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                       >
                          {c.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                       </button>
                       <button 
                        onClick={() => updateContractStatus(c.address, 'Terminated')}
                        title="Terminate Contract"
                        className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                       >
                          <Power size={14} />
                       </button>
                       <div className="w-px h-6 bg-slate-800 mx-1"></div>
                       <button 
                        onClick={() => { setSelectedContract(c); setActiveTab('interact'); }}
                        className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                       >
                          <Terminal size={14} />
                       </button>
                    </div>
                  </div>
                ))}
                
                {deployedContracts.length === 0 && (
                  <div className="p-16 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-slate-950/20">
                    <Database size={40} className="text-slate-700" />
                    <div>
                       <p className="text-slate-300 font-bold text-sm">Empty Registry</p>
                       <p className="text-slate-500 text-xs mt-1">Initialize your first smart contract from the Templates tab.</p>
                    </div>
                    <button onClick={() => setActiveTab('templates')} className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors">
                       View Available Templates →
                    </button>
                  </div>
                )}
              </div>

              {deployedContracts.length > 0 && (
                <div className="p-5 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                         <ShieldAlert size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">Governance Intelligence</h4>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed">
                      All registry actions are recorded on the **ATOMIC LEDGER** with FIPS 140-2 compliance. Terminating a contract is permanent and requires Multi-Sig consensus in a production environment.
                   </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Workflow className="text-blue-400 glow-text-blue" size={20} />
                    Autonomous Workflow Engine
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Connect on-chain repair events to automated contract executions.</p>
                </div>
                <button 
                  onClick={() => setShowWorkflowModal(true)}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/10"
                >
                  <Plus size={14} /> New Workflow
                </button>
              </div>

              <div className="space-y-3">
                {workflows.map((wf) => (
                  <div key={wf.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 group">
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                       <div className="text-xs font-bold text-white min-w-[120px]">{wf.name}</div>
                       <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-[10px] text-blue-300 shadow-inner">
                          IF <span className="text-white font-bold">{wf.trigger}</span>
                       </div>
                       <ArrowRight size={14} className="text-slate-700" />
                       <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-[10px] text-emerald-300 shadow-inner">
                          THEN <span className="text-white font-bold">{wf.action}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <div className={`w-1.5 h-1.5 rounded-full ${wf.status === 'Armed' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></div>
                          {wf.status.toUpperCase()}
                       </span>
                       <button 
                        onClick={() => removeWorkflow(wf.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                ))}
                
                {workflows.length === 0 && (
                  <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-slate-950/20">
                    <Workflow size={32} className="text-slate-700" />
                    <p className="text-slate-500 text-sm italic">No automated workflows active. Create one to begin monitoring repairs.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                   <Binary className="text-emerald-400 glow-text-green" size={20} />
                   Blockchain Contract IDE
                 </h3>
                 <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 shadow-inner">
                    <button 
                      onClick={() => setSelectedLang('Solidity')}
                      className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md transition-all ${selectedLang === 'Solidity' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      SOLIDITY
                    </button>
                    <button 
                      onClick={() => setSelectedLang('Rust (WASM)')}
                      className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md transition-all ${selectedLang === 'Rust (WASM)' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      RUST (WASM)
                    </button>
                 </div>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Contract Name</label>
                      <input 
                        type="text"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-mono bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Compiler Optimization</label>
                      <select className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-mono bg-slate-950 appearance-none">
                        <option>Default (200 runs)</option>
                        <option>Aggressive (999 runs)</option>
                        <option>Size Optimized (WASM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative group">
                     <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-700 text-slate-500">READ-ONLY SIM</span>
                     </div>
                     <textarea 
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        className="w-full bg-[#050810] p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 min-h-[300px] shadow-inner outline-none focus:border-emerald-500/50 transition-all resize-none"
                     />
                     <div className="absolute bottom-6 left-6 text-[10px] font-mono text-slate-600 flex items-center gap-3">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Syntax OK</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> FIPS Ready</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <button 
                        onClick={() => handleDeploy(contractName, selectedLang, customCode)}
                        disabled={isDeploying}
                        className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 py-3.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-green shadow-lg disabled:opacity-50"
                     >
                        {isDeploying ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                        {isDeploying ? 'Compiling & Validating...' : `Validate & Deploy ${selectedLang}`}
                     </button>
                     <button className="px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
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
                 Contract Interaction Console
              </h3>

              {deployedContracts.length === 0 ? (
                <div className="text-center py-20 space-y-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                   <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800 w-fit mx-auto opacity-30">
                      <Terminal size={32} className="text-slate-500" />
                   </div>
                   <p className="text-sm text-slate-500 italic max-w-[280px] mx-auto">No active deployments detected. Deploy a Solidity or WASM contract to enable interaction hooks.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">Target Instance</label>
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                           {deployedContracts.map((c) => (
                             <div 
                                key={c.address}
                                onClick={() => setSelectedContract(c)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                                  selectedContract?.address === c.address ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                                }`}
                             >
                                <div className="flex justify-between items-center mb-1.5">
                                   <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{c.name}</span>
                                   <span className="text-[9px] font-mono text-blue-500 uppercase bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">L2</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate mb-2">{c.address}</div>
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                   <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{c.status} on {c.network}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-5">
                      {selectedContract ? (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                           <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/60 shadow-inner">
                              <div className="text-[9px] font-mono text-slate-600 uppercase font-bold mb-2">Contract Interface (ABI)</div>
                              <div className="space-y-2">
                                 {['authorizeRepair(taskId)', 'getOracleStatus()', 'lockCollateral()'].map(fn => (
                                    <div key={fn} className="text-[10px] font-mono text-blue-400/80 flex items-center gap-2">
                                       <Code2 size={10} /> {fn}
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Function Payload</label>
                              <input 
                                 type="text" 
                                 placeholder="e.g., authorizeRepair(0x92...)"
                                 value={interactionAction}
                                 onChange={e => setInteractionAction(e.target.value)}
                                 className="w-full glass-input rounded-xl px-4 py-3 text-sm font-mono bg-slate-950 shadow-inner"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Arguments (JSON)</label>
                              <textarea 
                                 placeholder='{"reason": "test_failure"}'
                                 value={interactionPayload}
                                 onChange={e => setInteractionActionPayload(e.target.value)}
                                 className="w-full glass-input rounded-xl px-4 py-3 text-xs font-mono min-h-[100px] bg-slate-950 resize-none shadow-inner"
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
                              disabled={isInteracting || !interactionAction || selectedContract.status !== 'Active'}
                              className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 py-3.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-blue shadow-lg disabled:opacity-50"
                           >
                              {isInteracting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                              {isInteracting ? 'Broadcasting TX...' : selectedContract.status === 'Active' ? 'Execute Transaction' : 'Contract Paused'}
                           </button>
                        </div>
                      ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-950/20">
                           <p className="text-xs text-slate-500 italic">Select a deployed contract to load its interactive execution module.</p>
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
                 <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Escrow TVL</span>
                       <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">SYNCED</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-white glow-text-blue">48,250.00 <span className="text-xs font-mono text-slate-600">AL</span></div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Locked Assets</span>
                          <span className="text-amber-400">12,400 AL</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-amber-500 w-[25%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">DAO Voting Power</span>
                       <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-display font-bold text-white glow-text-purple">1,284 <span className="text-xs font-mono text-slate-600">ELITE VOTERS</span></div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Quorum reached</span>
                          <span className="text-emerald-400">78.4%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-emerald-500 w-[78%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-1">Recent Ledger Events</h4>
                 <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                    {blocks.filter(b => b.contractAddress).slice(-6).reverse().map((b, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3 bg-slate-900/40 rounded-lg border border-slate-800/60 hover:border-slate-700 transition-colors">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500">{new Date(b.timestamp).toLocaleTimeString()}</span>
                            <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded shadow-inner">BLOCK #{b.index}</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="text-emerald-400 font-bold">{b.action}</span>
                            <span className="text-slate-600">at</span>
                            <span className="text-slate-400 truncate max-w-[120px]">{b.contractAddress}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Deployment Control */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="glass-card rounded-2xl p-6 space-y-6 border-t-4 border-t-blue-500 glow-border-blue shadow-xl">
             <h3 className="text-base font-semibold text-white flex items-center gap-2">
               <Zap className="text-amber-400 glow-text-orange" size={18} />
               Deployment Control
             </h3>

             {selectedTemplate ? (
               <div className="space-y-5">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 shadow-inner">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-600 font-bold uppercase">Template</span>
                        <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded shadow-inner">READY</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                           <selectedTemplate.icon size={18} className="text-purple-400" />
                        </div>
                        <div>
                           <div className="font-display font-bold text-sm text-white leading-none">{selectedTemplate.name}</div>
                           <div className="text-[10px] font-mono text-slate-600 mt-1">{selectedTemplate.language} • v{selectedTemplate.version}</div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold px-1">Active Network</label>
                     <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                        <div className="w-full glass-input rounded-xl pl-10 pr-3 py-2.5 text-xs font-mono bg-slate-950 border-slate-800 text-blue-400 font-bold shadow-inner">
                           {activeNetwork}
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleDeploy(selectedTemplate.name, selectedTemplate.language, selectedTemplate.code, selectedTemplate.id)}
                    disabled={isDeploying}
                    className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/50 py-3.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-purple shadow-lg disabled:opacity-50"
                  >
                    {isDeploying ? <Loader2 className="animate-spin" size={16} /> : <Rocket size={16} />}
                    {isDeploying ? 'Transmitting to Ledger...' : 'Initiate Deployment'}
                  </button>

                  {deploymentLogs.length > 0 && (
                    <div className="bg-[#03060c] p-4 rounded-xl border border-slate-800/80 font-mono text-[10px] text-slate-500 space-y-1.5 shadow-inner max-h-[180px] overflow-y-auto custom-scrollbar">
                       {deploymentLogs.map((log, i) => (
                         <div key={i} className={log.includes('[LEDGER]') ? 'text-emerald-400' : log.includes('[VM]') ? 'text-blue-400' : ''}>
                           <span className="opacity-40 pr-2">{i+1}</span> {log}
                         </div>
                       ))}
                       {isDeploying && <div className="animate-pulse text-blue-400 ml-5">_</div>}
                    </div>
                  )}
               </div>
             ) : (
               <div className="text-center py-12 space-y-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/20 shadow-inner">
                  <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800 w-fit mx-auto opacity-20">
                     <Rocket size={32} className="text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-600 italic max-w-[200px] mx-auto">Select a dApp template from the library to begin ledger deployment.</p>
               </div>
             )}
          </div>

          {/* Audit & Registry Summary */}
          <div className="glass-card rounded-2xl p-6 bg-slate-950/40 border border-slate-800/60 shadow-xl">
             <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={16} />
                  Contract Registry
                </h3>
                <button onClick={() => setActiveTab('manage')} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                   <Eye size={16} className="text-slate-500 hover:text-white" />
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-mono">
                   <span className="text-slate-600">Active Instances</span>
                   <span className="text-emerald-400 font-bold">{deployedContracts.filter(c => c.status === 'Active').length}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                   <span className="text-slate-600">Paused/Terminated</span>
                   <span className="text-amber-400 font-bold">{deployedContracts.filter(c => c.status !== 'Active').length}</span>
                </div>
                
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                   <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle size={12} className="text-red-400" />
                      <span className="text-[10px] font-bold text-white uppercase">Critical Alerts</span>
                   </div>
                   <p className="text-[9px] text-slate-500 font-mono italic leading-tight">
                      No high-risk dApp states detected by AI Oracle.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Workflow Modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowWorkflowModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative glass-card rounded-2xl p-8 max-w-md w-full border-t-4 border-t-blue-500 glow-border-blue shadow-2xl"
          >
            <button 
              onClick={() => setShowWorkflowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="text-blue-400" />
              Configure Automation
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Workflow Name</label>
                <input 
                  type="text" 
                  value={newWorkflow.name}
                  onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  className="w-full glass-input rounded-xl px-4 py-3 bg-slate-950 border-slate-800 text-white shadow-inner"
                  placeholder="e.g. Memory Leak Auto-Fix"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Trigger (On Event)</label>
                  <select 
                    value={newWorkflow.trigger}
                    onChange={e => setNewWorkflow({...newWorkflow, trigger: e.target.value})}
                    className="w-full glass-input rounded-xl px-4 py-3 bg-slate-950 border-slate-800 text-sm text-blue-400 appearance-none shadow-inner"
                  >
                    <option>@selfHeal Success</option>
                    <option>FIPS Violation</option>
                    <option>High Risk Detected</option>
                    <option>Block Verified</option>
                    <option>DAO Vote Passed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Action (Execute)</label>
                  <select 
                    value={newWorkflow.action}
                    onChange={e => setNewWorkflow({...newWorkflow, action: e.target.value})}
                    className="w-full glass-input rounded-xl px-4 py-3 bg-slate-950 border-slate-800 text-sm text-emerald-400 appearance-none shadow-inner"
                  >
                    <option>Release Escrow</option>
                    <option>Quarantine Node</option>
                    <option>Log FIPS Signature</option>
                    <option>Notify Swarm</option>
                    <option>Execute Patch</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleCreateWorkflow}
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 py-4 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all glow-border-blue shadow-lg mt-4"
              >
                <Zap size={16} /> Arm Automation Workflow
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
