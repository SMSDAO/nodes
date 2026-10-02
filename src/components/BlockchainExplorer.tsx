import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { Database, Lock, ArrowRight, CheckCircle2, Cpu, Globe, Rocket, Terminal, Layers, Fuel, RefreshCw } from 'lucide-react';
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
    case 'Binance Smart Chain':
      return { cost: '3 gwei ($0.03)', congestion: 'Medium', time: '~ 3s' };
    default:
      return { cost: '0.005 TKN', congestion: 'Low', time: '~ 3s' };
  }
};

const GasEstimator = ({ network }: { network: string }) => {
  const estimate = getGasEstimate(network);
  return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30 glow-border-orange">
             <Fuel size={20} className="text-amber-500 glow-text-orange" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Est. Transaction Fee</div>
            <div className="font-mono text-slate-200 text-lg glow-text-orange">{estimate.cost}</div>
          </div>
       </div>
       <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-2 h-2 rounded-full ${estimate.congestion === 'Low' ? 'bg-emerald-400 glow-border-green' : estimate.congestion === 'High' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 'bg-amber-400 glow-border-orange'}`}></span>
            <span className="text-slate-300">{estimate.congestion} Congestion</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono tracking-tight">Est. Finality: {estimate.time}</div>
       </div>
    </div>
  );
};

const SyncStatusIndicator = ({ network }: { network: string }) => {
  const [progress, setProgress] = useState(0);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    setProgress(0);
    setSynced(false);
    let current = Math.floor(Math.random() * 30) + 10;
    setProgress(current);
    
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 100) {
        current = 100;
        setSynced(true);
        clearInterval(interval);
      }
      setProgress(current);
    }, 800);
    return () => clearInterval(interval);
  }, [network]);

  return (
    <div className="glass-card p-4 rounded-xl">
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-3">
            <RefreshCw size={18} className={`text-blue-400 glow-text-blue ${!synced ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-slate-300">
               {synced ? 'Synchronized with' : 'Syncing with'} <span className="text-white font-mono glow-text-blue">{network}</span>
            </span>
         </div>
         <span className={`text-xs font-mono font-bold ${synced ? 'text-emerald-400 glow-text-green' : 'text-blue-400 glow-text-blue'}`}>
            {synced ? '100%' : `${Math.floor(progress)}%`}
         </span>
       </div>
       <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <div 
             className={`h-full transition-all duration-300 ${synced ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-blue-500 relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.8)]'}`}
             style={{ width: `${progress}%` }}
          >
             {!synced && (
               <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
             )}
          </div>
       </div>
    </div>
  );
};

export function BlockchainExplorer({ blocks, deployContract, executeContract, NETWORKS, activeNetwork, setActiveNetwork }: ExplorerProps) {
  // Ordered descending
  const sortedBlocks = [...blocks].sort((a, b) => b.index - a.index);
  
  const [activeTab, setActiveTab] = useState<'explorer' | 'dapps' | 'contracts'>('explorer');
  const [deployName, setDeployName] = useState('');
  const [contractLanguage, setContractLanguage] = useState<'Solidity' | 'WASM'>('Solidity');
  const [wasmTarget, setWasmTarget] = useState<'Rust' | 'Go' | 'Python'>('Rust');
  const [dappAction, setDappAction] = useState('Transfer Ownership');
  const [dappAddress, setDappAddress] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execLogs, setExecLogs] = useState<string[]>([]);

  const handleDeploy = () => {
    if (!deployName) return;
    const addr = deployContract(activeNetwork, deployName, { type: 'smart_contract', standard: 'ERC-20/Equivalent', language: contractLanguage, runtime: contractLanguage === 'WASM' ? wasmTarget : 'EVM' });
    setDappAddress(addr);
    setDeployName('');
  };

  const handleExecute = () => {
    if (!dappAddress || isExecuting) return;
    setIsExecuting(true);
    setExecLogs([]);
    
    // Virtual Machine Execution Simulation
    let logs = [`[VM] Bootstrapping ${contractLanguage === 'WASM' ? `WASM (${wasmTarget})` : 'EVM'} runtime environment...`];
    setExecLogs([...logs]);
    
    setTimeout(() => {
       logs.push(`[VM] Loading contract bytecode at ${dappAddress.slice(0,10)}...`);
       setExecLogs([...logs]);
       
       setTimeout(() => {
          if (contractLanguage === 'WASM') {
            logs.push(`[WASM] Initializing ${wasmTarget} memory linear instance...`);
            if (wasmTarget === 'Python') logs.push(`[WASM-Py] Loading standard library bindings...`);
            if (wasmTarget === 'Rust') logs.push(`[WASM-Rs] Allocating cosmwasm_std instance...`);
            if (wasmTarget === 'Go') logs.push(`[WASM-Go] Initiating tinygo runtime scheduler...`);
          } else {
            logs.push(`[EVM] Allocating stack memory and gas counter...`);
          }
          setExecLogs([...logs]);
          
          setTimeout(() => {
             logs.push(`[TX] Executing payload: ${dappAction}`);
             setExecLogs([...logs]);
             
             setTimeout(() => {
                logs.push(`[LEDGER] Execution successful. Gas used: ${Math.floor(Math.random() * 50000) + 21000}`);
                logs.push(`[LEDGER] Submitting block to consensus layer...`);
                setExecLogs([...logs]);
                
                setTimeout(() => {
                   executeContract(activeNetwork, dappAddress, dappAction, { executedBy: 'user-ui', timestamp: new Date().toISOString(), runtime: contractLanguage === 'WASM' ? wasmTarget : 'EVM' });
                   setDappAddress('');
                   setIsExecuting(false);
                }, 1000);
             }, 800);
          }, 800);
       }, 800);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Metrics Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
              <Database className="text-blue-400 glow-text-blue" />
              <span className="glow-text-blue">ATOMIC LEDGER</span>
            </h2>
            <p className="text-slate-300 mt-2">Immutable multi-chain audit trail with FIPS 140-2 compliance & dApp execution.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/30 px-4 py-3 rounded-lg border border-slate-700/50 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
            <div className="text-center">
              <div className="text-xs text-emerald-400 uppercase tracking-widest mb-1 font-bold border border-emerald-500/30 px-2 rounded bg-emerald-500/10 glow-border-green glow-text-green">FIPS 140-2</div>
              <div className="font-mono text-[10px] text-slate-400">COMPLIANT</div>
            </div>
            <div className="w-px h-8 bg-slate-700/50"></div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Blocks</div>
              <div className="font-mono text-lg font-bold text-blue-400 glow-text-blue">{blocks.length}</div>
            </div>
            <div className="w-px h-8 bg-slate-700/50"></div>
            <div className="text-center">
               <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Chains</div>
               <div className="font-mono text-lg font-bold text-purple-400 glow-text-purple">{NETWORKS.length}</div>
            </div>
            <div className="w-px h-8 bg-slate-700/50"></div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Chain Integrity</div>
              <div className="flex items-center gap-1 text-emerald-400 font-medium glow-text-green">
                <CheckCircle2 size={16} /> Verified
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <SyncStatusIndicator network={activeNetwork} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-8 border-b border-slate-700/50 pb-px">
          <button 
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-all duration-300 ${activeTab === 'explorer' ? 'border-blue-400 text-blue-300 glass-tab-active glow-border-blue' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
          >
            <div className="flex items-center gap-2"><Layers size={16}/> Ledger Explorer</div>
          </button>
          <button 
            onClick={() => setActiveTab('dapps')}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-all duration-300 ${activeTab === 'dapps' ? 'border-purple-400 text-purple-300 glass-tab-active glow-border-purple' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
          >
             <div className="flex items-center gap-2"><Rocket size={16}/> Deploy & Execute</div>
          </button>
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-all duration-300 ${activeTab === 'contracts' ? 'border-emerald-400 text-emerald-300 glass-tab-active glow-border-green' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
          >
             <div className="flex items-center gap-2"><Cpu size={16}/> Smart Contracts</div>
          </button>
        </div>
      </div>

      {activeTab === 'dapps' && (
        <div className="space-y-6">
          <GasEstimator network={activeNetwork} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smart Contract Deployer */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-400 glow-text-purple">
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
                     className="w-full glass-input rounded-lg pl-9 pr-4 py-2.5 text-slate-200 focus:outline-none appearance-none font-mono text-sm"
                   >
                     {NETWORKS.map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
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
                   className="w-full glass-input rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none font-mono text-sm"
                 />
              </div>
              <div>
                 <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Contract Environment</label>
                 <div className="flex flex-col gap-3">
                   <div className="flex gap-4">
                     <label className="flex items-center gap-2 text-sm text-slate-300 font-mono cursor-pointer">
                       <input type="radio" name="lang" value="Solidity" checked={contractLanguage === 'Solidity'} onChange={() => setContractLanguage('Solidity')} className="text-purple-500 focus:ring-purple-500" />
                       <span className={contractLanguage === 'Solidity' ? 'glow-text-purple text-purple-300' : ''}>Solidity (EVM)</span>
                     </label>
                     <label className="flex items-center gap-2 text-sm text-slate-300 font-mono cursor-pointer">
                       <input type="radio" name="lang" value="WASM" checked={contractLanguage === 'WASM'} onChange={() => setContractLanguage('WASM')} className="text-blue-500 focus:ring-blue-500" />
                       <span className={contractLanguage === 'WASM' ? 'glow-text-blue text-blue-300' : ''}>WASM (Multi-Lang)</span>
                     </label>
                   </div>
                   
                   {contractLanguage === 'WASM' && (
                     <div className="flex gap-3 pl-6 mt-1 border-l-2 border-slate-700/50">
                       {['Rust', 'Go', 'Python'].map(lang => (
                         <label key={lang} className="flex items-center gap-2 text-xs text-slate-400 font-mono cursor-pointer">
                           <input 
                             type="radio" 
                             name="wasmTarget" 
                             value={lang} 
                             checked={wasmTarget === lang} 
                             onChange={() => setWasmTarget(lang as 'Rust' | 'Go' | 'Python')} 
                             className="text-blue-400 focus:ring-blue-400" 
                           />
                           <span className={wasmTarget === lang ? 'text-blue-300' : ''}>{lang}</span>
                         </label>
                       ))}
                     </div>
                   )}
                 </div>
              </div>
              <button 
                onClick={handleDeploy}
                className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/50 rounded-lg px-4 py-2.5 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 glow-border-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              >
                <Cpu size={18} /> Initialize Contract
              </button>
            </div>
          </div>

          {/* DApp Execution */}
          <div className="glass-card rounded-xl p-6">
             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400 glow-text-blue">
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
                   className="w-full glass-input rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none font-mono text-sm"
                 />
               </div>
               <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Action</label>
                  <select 
                     value={dappAction}
                     onChange={(e) => setDappAction(e.target.value)}
                     className="w-full glass-input rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none appearance-none font-mono text-sm"
                   >
                     <option className="bg-slate-900">Transfer Ownership</option>
                     <option className="bg-slate-900">Automated Escrow Execute</option>
                     <option className="bg-slate-900">Decentralized Governance Vote</option>
                     <option className="bg-slate-900">Mint Tokenized Asset</option>
                     <option className="bg-slate-900">Authorize Auto-Repair</option>
                   </select>
               </div>
               <button 
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full bg-blue-600/20 hover:bg-blue-600/40 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 text-blue-300 border border-blue-500/50 rounded-lg px-4 py-2.5 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 glow-border-blue hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <Database size={18} /> {isExecuting ? 'Executing Payload...' : 'Broadcast Transaction'}
              </button>
              
              {execLogs.length > 0 && (
                <div className="mt-4 bg-[#0d1117] rounded-lg p-3 border border-slate-700/50 min-h-[120px] font-mono text-[10px] text-slate-300 overflow-y-auto max-h-[160px] shadow-inner">
                  {execLogs.map((log, idx) => (
                     <div key={idx} className="mb-1">
                       <span className={log.startsWith('[VM]') || log.startsWith('[WASM') || log.startsWith('[EVM]') ? 'text-amber-400' : log.startsWith('[TX]') ? 'text-purple-400' : 'text-emerald-400'}>
                         {log}
                       </span>
                     </div>
                  ))}
                  {isExecuting && (
                     <div className="animate-pulse text-blue-400">_</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-purple-400 glow-text-purple" />
                 <h3 className="font-mono text-sm text-purple-300">Solidity (EVM) Contract</h3>
               </div>
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">ATOMIC_AUDIT.SOL</span>
            </div>
            <div className="p-4 bg-[#0d1117] flex-1 overflow-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AtomicLedgerAudit {
    struct AuditEvent {
        uint256 timestamp;
        string action;
        bytes32 fipsHash;
    }
    
    mapping(uint256 => AuditEvent) public events;
    uint256 public eventCount;

    event AuditRecorded(uint256 indexed id, bytes32 indexed fipsHash);

    function recordAudit(string memory _action, bytes32 _fipsHash) public {
        events[eventCount] = AuditEvent(block.timestamp, _action, _fipsHash);
        emit AuditRecorded(eventCount, _fipsHash);
        eventCount++;
    }
}`}
              </pre>
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-blue-400 glow-text-blue" />
                 <h3 className="font-mono text-sm text-blue-300">Rust (WASM) Contract</h3>
               </div>
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">LIB.RS</span>
            </div>
            <div className="p-4 bg-[#0d1117] flex-1 overflow-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
{`use cosmwasm_std::{
    entry_point, DepsMut, Env, MessageInfo, Response, StdResult,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AuditEvent {
    pub action: String,
    pub fips_hash: String,
    pub timestamp: u64,
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: AuditEvent,
) -> StdResult<Response> {
    // Record FIPS 140-2 Hash to ATOMIC LEDGER WASM Storage
    let key = format!("audit_{}", env.block.height);
    deps.storage.set(key.as_bytes(), msg.fips_hash.as_bytes());
    
    Ok(Response::new()
        .add_attribute("action", "record_audit")
        .add_attribute("fips_hash", msg.fips_hash))
}`}
              </pre>
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-emerald-400 glow-text-green" />
                 <h3 className="font-mono text-sm text-emerald-300">Go (WASM) Contract</h3>
               </div>
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">MAIN.GO</span>
            </div>
            <div className="p-4 bg-[#0d1117] flex-1 overflow-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
{`package main

import (
	"encoding/json"
	"github.com/atomicledger/wasm-sdk-go/std"
)

type AuditEvent struct {
	Action    string \`json:"action"\`
	FipsHash  string \`json:"fips_hash"\`
	Timestamp uint64 \`json:"timestamp"\`
}

//export execute
func execute(env std.Env, info std.MessageInfo, msgBytes []byte) std.Response {
	var msg AuditEvent
	json.Unmarshal(msgBytes, &msg)

	key := "audit_" + std.Uint64ToString(env.Block.Height)
	std.StorageSet([]byte(key), []byte(msg.FipsHash))

	return std.Response{
		Attributes: []std.Attribute{
			{Key: "action", Value: "record_audit"},
			{Key: "fips_hash", Value: msg.FipsHash},
		},
	}
}`}
              </pre>
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-amber-400 glow-text-orange" />
                 <h3 className="font-mono text-sm text-amber-300">Python (WASM) Contract</h3>
               </div>
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">CONTRACT.PY</span>
            </div>
            <div className="p-4 bg-[#0d1117] flex-1 overflow-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
{`from atomic_std import entry_point, Env, MessageInfo, Response, Storage

class AuditEvent:
    def __init__(self, action: str, fips_hash: str, timestamp: int):
        self.action = action
        self.fips_hash = fips_hash
        self.timestamp = timestamp

@entry_point
def execute(env: Env, info: MessageInfo, msg: dict) -> Response:
    event = AuditEvent(**msg)
    
    # Record FIPS 140-2 Hash to ATOMIC LEDGER WASM Storage
    key = f"audit_{env.block.height}"
    Storage.set(key.encode('utf-8'), event.fips_hash.encode('utf-8'))
    
    res = Response()
    res.add_attribute("action", "record_audit")
    res.add_attribute("fips_hash", event.fips_hash)
    
    return res`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div className="glass-card rounded-xl p-6">
          <div className="space-y-4 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700/50 hidden md:block shadow-[0_0_10px_rgba(148,163,184,0.3)]"></div>
            
            {sortedBlocks.map((block, i) => (
              <motion.div 
                key={block.hash + block.index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-900/40 p-5 rounded-lg border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-slate-800/60 backdrop-blur-md"
              >
                <div className="hidden md:flex flex-col items-center justify-start py-2">
                  <div className="w-16 h-16 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700 font-mono text-lg font-bold text-slate-300 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] shrink-0 glow-text-blue">
                    {block.index}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="md:hidden inline-block bg-slate-900/60 px-2 py-0.5 rounded-md font-mono text-xs border border-slate-700/50">Block #{block.index}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg text-emerald-400 capitalize glow-text-green">{block.action.replace(/_/g, ' ')}</h4>
                          {block.contractAddress && <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/40 rounded text-xs font-mono font-bold glow-border-purple">SMART CONTRACT{block.contractPayload?.language ? ` (${block.contractPayload.language})` : ''}</span>}
                        </div>
                        {block.network && (
                           <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                             <Globe size={12} className="text-blue-400" /> Network: <span className="font-mono text-slate-300 glow-text-blue">{block.network}</span>
                           </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{new Date(block.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 overflow-x-auto shadow-inner">
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
                       <div className="flex items-center gap-2 border-t border-slate-800/60 pt-2 mt-1">
                          <Cpu size={14} className="text-purple-400 shrink-0 glow-text-purple" />
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
