export interface Block {
  index: number;
  timestamp: string;
  action: string;
  hash: string;
  previousHash: string;
  status: 'verified' | 'pending';
  network?: string;
  contractAddress?: string;
  contractPayload?: any;
}

export interface MetricPoint {
  time: string;
  confidence: number;
  selfHealingRate: number;
  riskScore: number;
  testCoverage: number;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  trigger: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type ViewState = 'dashboard' | 'scanner' | 'evmbridge' | 'blockchain' | 'metrics' | 'kubernetes' | 'config' | 'planner' | 'history';

export type Language = 'Node.js' | 'Python' | 'Rust' | 'Go' | 'Solidity' | 'Vyper' | 'TypeScript' | 'React' | 'JavaScript' | 'Shell' | 'PowerShell' | 'HTML' | 'Workflows' | 'Git' | 'YAML';

export interface K8sPod {
  id: string;
  name: string;
  status: 'Running' | 'CrashLoopBackOff' | 'Healing' | 'Pending';
  language: Language;
  uptime: string;
  restarts: number;
}
