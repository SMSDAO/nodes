import React, { useState } from 'react';
import { Shield, Key, Terminal, Cpu, Play, CheckCircle2, AlertOctagon, UserCheck, UserX, Rocket, Database, Layers, ArrowRight, Lock, Code2, Copy, Check } from 'lucide-react';
import { SmartContractRole, AccessRule, Block } from '../types';

interface SmartContractProps {
  blocks: Block[];
  addBlock: (action: string, network?: string, contractAddress?: string, contractPayload?: any) => void;
  deployContract: (network: string, contractName: string, payload: any) => string;
  executeContract: (network: string, contractAddress: string, action: string, payload: any) => void;
  activeNetwork: string;
}

const DEFAULT_ROLES: SmartContractRole[] = [
  {
    roleName: 'ROLE_SUPER_ADMIN_DAO',
    roleHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    description: 'Root decentralized governance governance multi-sig council.',
    members: ['0x71C...4eF9', '0xA3B...89D1'],
    requiresMultisig: true,
  },
  {
    roleName: 'ROLE_SECURITY_AUDITOR_FIPS',
    roleHash: '0x9f8b...32a1',
    description: 'Cryptographic compliance officer with FIPS 140-2 signature powers.',
    members: ['0x8b3...ab12', '0x2C4...55E2'],
    requiresMultisig: false,
  },
  {
    roleName: 'ROLE_AUTOMATED_HEALER',
    roleHash: '0x4c2e...8899',
    description: 'Swarm CI/CD repair bots with atomic patching execution clearance.',
    members: ['0x51E...09B7', '0x18F...77A4'],
    requiresMultisig: false,
  },
  {
    roleName: 'ROLE_QUARANTINED_NODE',
    roleHash: '0xee11...ffff',
    description: 'Restricted actor state triggered automatically upon anomaly detection.',
    members: ['0x99A...12D8'],
    requiresMultisig: false,
  },
];

const DEFAULT_RULES: AccessRule[] = [
  {
    id: 'rule-1',
    triggerEvent: '@riskAssessment (Score > 75)',
    condition: 'Anomaly score exceeds safety threshold',
    action: 'REVOKE_REPAIR_PRIVILEGES -> QUARANTINE_NODE',
    targetRole: 'ROLE_QUARANTINED_NODE',
    active: true,
  },
  {
    id: 'rule-2',
    triggerEvent: 'FIPS 140-2 KAT Integrity Check',
    condition: 'Known-Answer-Test fails or mismatch',
    action: 'EMERGENCY_LOCKDOWN_BLOCKCHAIN_BROADCAST',
    targetRole: 'ROLE_SECURITY_AUDITOR_FIPS',
    active: true,
  },
  {
    id: 'rule-3',
    triggerEvent: 'Self-Healing Verified (Confidence > 99.97%)',
    condition: 'ML Swarm verifies patch with zero regression',
    action: 'GRANT_DEPLOYMENT_CLEARANCE',
    targetRole: 'ROLE_AUTOMATED_HEALER',
    active: true,
  },
];

export function SmartContractAccessControl({ blocks, addBlock, deployContract, executeContract, activeNetwork }: SmartContractProps) {
  const [activeTab, setActiveTab] = useState<'governance' | 'contractCode' | 'eventHooks' | 'simulator'>('governance');
  const [roles, setRoles] = useState<SmartContractRole[]>(DEFAULT_ROLES);
  const [rules, setRules] = useState<AccessRule[]>(DEFAULT_RULES);
  const [selectedLanguage, setSelectedLanguage] = useState<'Solidity' | 'Rust' | 'Go' | 'Python'>('Solidity');
  const [targetAddress, setTargetAddress] = useState('0x9a4f7831cd892b1156e09abcf1839218901289fe');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('ROLE_AUTOMATED_HEALER');
  const [isExecuting, setIsExecuting] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const contractAddress = '0x8b3e90a12cf4817a0e8d91c784ef32185c90ab12';

  const handleGrantRole = () => {
    setIsExecuting(true);
    const log: string[] = [];
    log.push(`[TX] Initiating grantRole(${selectedRoleToAssign}, ${targetAddress.slice(0, 10)}...)`);
    log.push(`[CONTRACT] Checking caller permissions with FIPS 140-2 signature verification...`);
    
    setTimeout(() => {
      log.push(`[EVM/WASM] Caller holds ROLE_SUPER_ADMIN_DAO clearance.`);
      log.push(`[STATE] Updating mapping(bytes32 => mapping(address => bool))...`);
      log.push(`[EVENT] Emitting RoleGranted(${selectedRoleToAssign}, ${targetAddress.slice(0, 10)}..., msg.sender)`);
      
      setRoles(prev => prev.map(r => {
        if (r.roleName === selectedRoleToAssign) {
          const short = targetAddress.slice(0, 5) + '...' + targetAddress.slice(-4);
          if (!r.members.includes(short)) {
            return { ...r, members: [...r.members, short] };
          }
        }
        return r;
      }));

      addBlock(`acl_grant_role (${selectedRoleToAssign})`, activeNetwork, contractAddress, {
        role: selectedRoleToAssign,
        account: targetAddress,
        adminCaller: '0x71C...4eF9',
        fipsVerified: true
      });

      log.push(`[LEDGER] Transaction confirmed in Block #${blocks.length}. Receipt indexed.`);
      setSimulationLogs([...log]);
      setIsExecuting(false);
    }, 1200);
  };

  const handleTriggerQuarantine = () => {
    setIsExecuting(true);
    const log: string[] = [];
    log.push(`[EVENT_HOOK] Blockchain detected high anomaly score (@riskAssessment > 80)`);
    log.push(`[ACL_CONTRACT] Evaluating Automated Access Rule #rule-1...`);
    
    setTimeout(() => {
      log.push(`[ACL_CONTRACT] Condition met: REVOKING repair clearance for ${targetAddress.slice(0, 10)}...`);
      log.push(`[ACL_CONTRACT] Assigning ROLE_QUARANTINED_NODE and locking staging sandbox.`);
      
      setRoles(prev => prev.map(r => {
        const short = targetAddress.slice(0, 5) + '...' + targetAddress.slice(-4);
        if (r.roleName === 'ROLE_QUARANTINED_NODE' && !r.members.includes(short)) {
          return { ...r, members: [...r.members, short] };
        }
        if (r.roleName === 'ROLE_AUTOMATED_HEALER') {
          return { ...r, members: r.members.filter(m => m !== short) };
        }
        return r;
      }));

      addBlock('acl_auto_quarantine_node', activeNetwork, contractAddress, {
        target: targetAddress,
        reason: 'Automated ML Anomaly Threshold Exceeded',
        action: 'QUARANTINE_NODE',
        fipsSecurityHash: '0x3a9f...e102'
      });

      log.push(`[LEDGER] Quarantine Block written to ATOMIC LEDGER with FIPS-140-2 cryptographic seal.`);
      setSimulationLogs([...log]);
      setIsExecuting(false);
    }, 1200);
  };

  const handleEmergencyLockdown = () => {
    setIsExecuting(true);
    const log: string[] = [];
    log.push(`[EMERGENCY] SuperAdmin initiated multi-sig emergency circuit breaker.`);
    log.push(`[CONTRACT] atomicAccessControl.pauseAllOperations() executed.`);
    
    setTimeout(() => {
      log.push(`[STATE] All autonomous self-healing deployment gates FROZEN.`);
      log.push(`[LEDGER] Emergency Lockdown logged to consensus.`);

      addBlock('acl_emergency_circuit_breaker_active', activeNetwork, contractAddress, {
        triggeredBy: 'ROLE_SUPER_ADMIN_DAO',
        status: 'PAUSED',
        auditStandard: 'FIPS 140-2 Level 3'
      });

      setSimulationLogs([...log]);
      setIsExecuting(false);
    }, 1000);
  };

  const contractCodes = {
    Solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AtomicAccessControl
 * @dev FIPS 140-2 Compliant Role-Based Access Control (RBAC)
 * Integrated with ATOMIC LEDGER Self-Healing Event Bridge
 */
contract AtomicAccessControl {
    bytes32 public constant SUPER_ADMIN_ROLE = 0x00;
    bytes32 public constant FIPS_AUDITOR_ROLE = keccak256("ROLE_SECURITY_AUDITOR_FIPS");
    bytes32 public constant AUTOMATED_HEALER_ROLE = keccak256("ROLE_AUTOMATED_HEALER");
    bytes32 public constant QUARANTINED_NODE_ROLE = keccak256("ROLE_QUARANTINED_NODE");

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;
    bool public circuitBreakerPaused;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event AnomalyQuarantineTriggered(address indexed node, bytes32 fipsHash, string reason);
    event EmergencyCircuitBreaker(bool indexed paused, address indexed admin);

    modifier onlyRole(bytes32 role) {
        require(_roles[role].members[msg.sender], "AtomicACL: unauthorized access");
        _;
    }

    modifier whenNotPaused() {
        require(!circuitBreakerPaused, "AtomicACL: circuit breaker active");
        _;
    }

    constructor(address initialAdmin) {
        _roles[SUPER_ADMIN_ROLE].members[initialAdmin] = true;
        emit RoleGranted(SUPER_ADMIN_ROLE, initialAdmin, msg.sender);
    }

    function grantRole(bytes32 role, address account) public onlyRole(SUPER_ADMIN_ROLE) {
        _roles[role].members[account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    /**
     * @notice Automated event hook triggered by ATOMIC LEDGER anomaly detector
     */
    function quarantineNode(address node, bytes32 fipsHash, string calldata reason) external onlyRole(FIPS_AUDITOR_ROLE) {
        _roles[AUTOMATED_HEALER_ROLE].members[node] = false;
        _roles[QUARANTINED_NODE_ROLE].members[node] = true;
        emit AnomalyQuarantineTriggered(node, fipsHash, reason);
    }

    function emergencyCircuitBreaker(bool paused) external onlyRole(SUPER_ADMIN_ROLE) {
        circuitBreakerPaused = paused;
        emit EmergencyCircuitBreaker(paused, msg.sender);
    }
}`,
    Rust: `// Rust CosmWasm / Substrate Implementation
use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Response, StdResult, StdError};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum Role {
    SuperAdmin,
    FipsAuditor,
    AutomatedHealer,
    QuarantinedNode,
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::QuarantineNode { node, fips_hash, reason } => {
            // Verify caller is FIPS Auditor
            let caller_role = deps.storage.get(info.sender.as_bytes())
                .ok_or_else(|| StdError::generic_err("Unauthorized caller"))?;
                
            deps.storage.set(node.as_bytes(), b"QUARANTINED");
            
            Ok(Response::new()
                .add_attribute("action", "quarantine_node")
                .add_attribute("fips_hash", fips_hash)
                .add_attribute("reason", reason))
        }
    }
}`,
    Go: `// Go Cosmos SDK / TinyGo WASM Implementation
package main

import (
	"encoding/json"
	"github.com/atomicledger/wasm-sdk-go/std"
)

type AccessControlMsg struct {
	Action   string \`json:"action"\`
	Target   string \`json:"target"\`
	FipsHash string \`json:"fips_hash"\`
	Role     string \`json:"role"\`
}

//export execute
func execute(env std.Env, info std.MessageInfo, msgBytes []byte) std.Response {
	var msg AccessControlMsg
	json.Unmarshal(msgBytes, &msg)

	if msg.Action == "quarantine_node" {
		std.StorageSet([]byte("role_"+msg.Target), []byte("ROLE_QUARANTINED"))
		return std.Response{
			Attributes: []std.Attribute{
				{Key: "status", Value: "quarantined"},
				{Key: "fips_hash", Value: msg.FipsHash},
			},
		}
	}
	return std.Response{}
}`,
    Python: `# Python WASM Smart Contract Integration
from atomic_std import entry_point, Env, MessageInfo, Response, Storage

@entry_point
def execute(env: Env, info: MessageInfo, msg: dict) -> Response:
    action = msg.get("action")
    target = msg.get("target")
    fips_hash = msg.get("fips_hash")
    
    if action == "quarantine_node":
        Storage.set(f"role:{target}".encode('utf-8'), b"ROLE_QUARANTINED")
        res = Response()
        res.add_attribute("action", "quarantine_node")
        res.add_attribute("fips_hash", fips_hash)
        return res
        
    return Response()`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(contractCodes[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 glow-border-purple">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl glow-border-purple">
                <Shield className="text-purple-400 glow-text-purple w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  <span>ATOMIC Smart Contract Access Control</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">EVENT BRIDGE</span>
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  On-chain automated access control and quarantine enforcement triggered by ATOMIC LEDGER blockchain events and self-healing telemetry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Contract</span>
              <span className="text-purple-300 font-bold glow-text-purple flex items-center gap-1.5">
                <Lock size={12} /> {contractAddress.slice(0, 8)}...{contractAddress.slice(-4)}
              </span>
            </div>

            <button
              onClick={handleEmergencyLockdown}
              disabled={isExecuting}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/50 rounded-xl font-medium text-xs font-mono flex items-center gap-2 transition-all glow-border-orange hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50"
            >
              <AlertOctagon size={14} /> Emergency Circuit Breaker
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => setActiveTab('governance')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'governance'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-border-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Key size={14} /> RBAC Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('eventHooks')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'eventHooks'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 glow-border-blue'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Cpu size={14} /> Automated Blockchain Event Rules
          </button>
          <button
            onClick={() => setActiveTab('contractCode')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'contractCode'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-border-green'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Code2 size={14} /> Smart Contract Source
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 glow-border-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Terminal size={14} /> Interactive Execution Simulator
          </button>
        </div>
      </div>

      {/* Tab: Governance / Roles */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Key className="text-purple-400 glow-text-purple" size={18} />
                Smart Contract Access Control Roles
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {roles.map((role, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-purple-500/40 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          role.roleName.includes('SUPER') ? 'bg-amber-400' :
                          role.roleName.includes('AUDITOR') ? 'bg-emerald-400' :
                          role.roleName.includes('QUARANTINED') ? 'bg-red-400' : 'bg-blue-400'
                        }`}></span>
                        <span className="font-mono text-sm font-bold text-white">{role.roleName}</span>
                      </div>
                      {role.requiresMultisig && (
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                          MULTI-SIG REQUIRED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">{role.description}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-mono text-slate-500">Authorized Members ({role.members.length}):</span>
                      {role.members.map((m, mIdx) => (
                        <span key={mIdx} className="text-[11px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Grant Panel */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserCheck className="text-blue-400 glow-text-blue" size={18} />
                Grant Access Role
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Target Address / Pod</label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Select Role</label>
                  <select
                    value={selectedRoleToAssign}
                    onChange={(e) => setSelectedRoleToAssign(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none bg-slate-900"
                  >
                    {roles.map(r => (
                      <option key={r.roleName} value={r.roleName}>{r.roleName}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGrantRole}
                  disabled={isExecuting}
                  className="w-full mt-2 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 rounded-xl font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all glow-border-blue hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50"
                >
                  <Play size={14} /> Broadcast grantRole() Tx
                </button>

                <button
                  onClick={handleTriggerQuarantine}
                  disabled={isExecuting}
                  className="w-full py-2.5 bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 border border-orange-500/50 rounded-xl font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all glow-border-orange hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50"
                >
                  <UserX size={14} /> Trigger Auto-Quarantine Hook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Event Hooks */}
      {activeTab === 'eventHooks' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-700/60 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Cpu className="text-blue-400 glow-text-blue" />
                Automated Blockchain Event Hooks
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Smart contract triggers automatically executed when specific ATOMIC LEDGER events or ML confidence thresholds occur.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono text-xs font-bold">
              3 ACTIVE RULES
            </span>
          </div>

          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold">
                      {rule.triggerEvent}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Condition: {rule.condition}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
                    <ArrowRight size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{rule.action}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-purple-300 font-bold">{rule.targetRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 size={12} /> ON-CHAIN HOOK ARMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Smart Contract Source */}
      {activeTab === 'contractCode' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
            <div className="flex items-center gap-2">
              {['Solidity', 'Rust', 'Go', 'Python'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedLanguage === lang
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-border-purple'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              className="text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied Contract' : 'Copy Code'}
            </button>
          </div>

          <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{contractCodes[selectedLanguage]}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Interactive Simulator */}
      {activeTab === 'simulator' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="text-amber-400 glow-text-orange" size={20} />
            Smart Contract Virtual Machine Execution Stream
          </h3>

          <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 min-h-[220px] font-mono text-xs space-y-2 max-h-[300px] overflow-y-auto shadow-inner">
            {simulationLogs.length === 0 ? (
              <div className="text-slate-500 italic">
                Ready to execute. Use the "Grant Access Role" or "Trigger Auto-Quarantine Hook" actions in the RBAC tab to simulate live on-chain state machine executions.
              </div>
            ) : (
              simulationLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className={
                    log.includes('[TX]') ? 'text-blue-400' :
                    log.includes('[EVENT]') ? 'text-purple-400' :
                    log.includes('[LEDGER]') ? 'text-emerald-400 font-bold' :
                    log.includes('[EMERGENCY]') ? 'text-red-400 font-bold' :
                    'text-amber-300'
                  }>
                    {log}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
