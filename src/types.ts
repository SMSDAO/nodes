/**
 * Block data structure representing an immutable entry in the ATOMIC LEDGER.
 * Fully FIPS 140-2 Compliant via SHA-256 standard validation and NIST SP 800-131A guidelines.
 * Supports cross-chain synchronization via external networks and smart contract state machine hooks.
 */
export interface Block {
  index: number;
  timestamp: string;
  action: string;
  /** FIPS 140-2 Compliant SHA-256 Hash */
  hash: string;
  /** FIPS 140-2 Compliant previous block hash reference */
  previousHash: string;
  status: 'verified' | 'pending' | 'quarantined';
  network?: string;
  contractAddress?: string;
  contractPayload?: any;
  fipsValidated?: boolean;
  signerRole?: string;
  gasUsed?: number;
}

export interface MetricPoint {
  time: string;
  confidence: number;
  selfHealingRate: number;
  riskScore: number;
  testCoverage: number;
  latency: number;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  trigger: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface WorkflowAction {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'Armed' | 'Monitoring' | 'Executing' | 'Completed';
  lastRun?: string;
  contractAddress?: string;
}

export type ViewState = 
  | 'dashboard' 
  | 'scanner' 
  | 'evmbridge' 
  | 'smartcontracts' 
  | 'fipscrypto' 
  | 'wallet' 
  | 'blockchain' 
  | 'metrics' 
  | 'kubernetes' 
  | 'config' 
  | 'langintel'
  | 'dappstudio'
  | 'oraclememory'
  | 'planner' 
  | 'history' 
  | 'guide';

export type Language = 'Node.js' | 'Python' | 'Rust' | 'Go' | 'Solidity' | 'Vyper' | 'TypeScript' | 'React' | 'JavaScript' | 'Shell' | 'PowerShell' | 'HTML' | 'Workflows' | 'Git' | 'YAML';

export interface K8sPod {
  id: string;
  name: string;
  status: 'Running' | 'CrashLoopBackOff' | 'Healing' | 'Pending' | 'Quarantined';
  language: Language;
  uptime: string;
  restarts: number;
}

export interface FipsKatTestResult {
  algorithm: string;
  standard: string;
  cavpId: string;
  input: string;
  expectedDigest: string;
  actualDigest: string;
  status: 'PASS' | 'FAIL' | 'RUNNING';
  durationMs: number;
}

export interface SmartContractRole {
  roleName: string;
  roleHash: string;
  description: string;
  members: string[];
  requiresMultisig: boolean;
}

export interface AccessRule {
  id: string;
  triggerEvent: string;
  condition: string;
  action: string;
  targetRole: string;
  active: boolean;
}
