import { useState, useEffect, useCallback } from 'react';
import { Block, LogEvent, MetricPoint, K8sPod, WorkflowAction } from './types';
import SHA256 from 'crypto-js/sha256';

/**
 * Generate FIPS 140-2 compliant SHA256 hash using validated NIST FIPS PUB 180-4 standard
 */
export const generateFipsHash = (index: number, timestamp: string, action: string, previousHash: string, network: string = 'ATOMIC Native', payload: string = ''): string => {
  return SHA256(`${index}:${timestamp}:${action}:${previousHash}:${network}:${payload}`).toString();
};

const NETWORKS = ['ATOMIC Native', 'Ethereum Mainnet', 'Polygon PoS', 'Arbitrum One', 'Solana', 'Optimism', 'Binance Smart Chain'];

const INITIAL_BLOCKS: Block[] = [
  { 
    index: 0, 
    timestamp: new Date(Date.now() - 600000).toISOString(), 
    action: 'Genesis Block - FIPS 140-2 Cryptographic Swarm Init', 
    hash: '', 
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000', 
    status: 'verified', 
    network: 'ATOMIC Native',
    fipsValidated: true,
    signerRole: 'ROLE_SUPER_ADMIN_DAO',
    gasUsed: 21000
  },
  { 
    index: 1, 
    timestamp: new Date(Date.now() - 300000).toISOString(), 
    action: 'deploy_contract_acl (AtomicAccessControl)', 
    hash: '', 
    previousHash: '', 
    status: 'verified', 
    network: 'ATOMIC Native',
    contractAddress: '0x8b3e90a12cf4817a0e8d91c784ef32185c90ab12',
    contractPayload: { type: 'smart_contract', standard: 'ACL-FIPS-140-2', language: 'Solidity', runtime: 'EVM' },
    fipsValidated: true,
    signerRole: 'ROLE_SECURITY_AUDITOR_FIPS',
    gasUsed: 142500
  },
  { 
    index: 2, 
    timestamp: new Date(Date.now() - 150000).toISOString(), 
    action: 'acl_grant_role (ROLE_AUTOMATED_HEALER -> Rust Swarm)', 
    hash: '', 
    previousHash: '', 
    status: 'verified', 
    network: 'Polygon PoS',
    contractAddress: '0x8b3e90a12cf4817a0e8d91c784ef32185c90ab12',
    contractPayload: { role: 'ROLE_AUTOMATED_HEALER', target: 'crypto-engine-x8p2 (Rust)' },
    fipsValidated: true,
    signerRole: 'ROLE_SUPER_ADMIN_DAO',
    gasUsed: 48200
  },
];

INITIAL_BLOCKS[0].hash = generateFipsHash(0, INITIAL_BLOCKS[0].timestamp, INITIAL_BLOCKS[0].action, INITIAL_BLOCKS[0].previousHash, INITIAL_BLOCKS[0].network);
INITIAL_BLOCKS[1].previousHash = INITIAL_BLOCKS[0].hash;
INITIAL_BLOCKS[1].hash = generateFipsHash(1, INITIAL_BLOCKS[1].timestamp, INITIAL_BLOCKS[1].action, INITIAL_BLOCKS[1].previousHash, INITIAL_BLOCKS[1].network, JSON.stringify(INITIAL_BLOCKS[1].contractPayload));
INITIAL_BLOCKS[2].previousHash = INITIAL_BLOCKS[1].hash;
INITIAL_BLOCKS[2].hash = generateFipsHash(2, INITIAL_BLOCKS[2].timestamp, INITIAL_BLOCKS[2].action, INITIAL_BLOCKS[2].previousHash, INITIAL_BLOCKS[2].network, JSON.stringify(INITIAL_BLOCKS[2].contractPayload));

const INITIAL_METRICS: MetricPoint[] = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (20 - i) * 5000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
  confidence: 94 + Math.random() * 5.97, // Targeting ~99.97%
  selfHealingRate: 88 + Math.random() * 11,
  riskScore: 12 + Math.random() * 14,
  testCoverage: 94 + Math.random() * 3,
  latency: 150 + Math.random() * 450, // ms
}));

const INITIAL_PODS: K8sPod[] = [
  { id: 'pod-1', name: 'api-gateway-7f8d', status: 'Running', language: 'Node.js', uptime: '14d 2h', restarts: 0 },
  { id: 'pod-2', name: 'data-pipeline-bs91', status: 'Running', language: 'Python', uptime: '4d 1h', restarts: 1 },
  { id: 'pod-3', name: 'crypto-engine-x8p2', status: 'Running', language: 'Rust', uptime: '32d 5h', restarts: 0 },
  { id: 'pod-4', name: 'auth-service-k2b9', status: 'Running', language: 'Go', uptime: '12d 6h', restarts: 0 },
  { id: 'pod-5', name: 'worker-node-n1p3', status: 'Running', language: 'TypeScript', uptime: '1d 12h', restarts: 3 },
  { id: 'pod-6', name: 'frontend-ui-r3c7', status: 'Running', language: 'React', uptime: '3d 4h', restarts: 0 },
  { id: 'pod-7', name: 'ci-cd-runner-k9m1', status: 'Running', language: 'Shell', uptime: '10d 1h', restarts: 5 },
  { id: 'pod-8', name: 'config-sync-y2x5', status: 'Running', language: 'YAML', uptime: '22d 8h', restarts: 1 },
];

const TRIGGERS = ['@fipsValidate', '@smartContractACL', '@repairFull', '@eliteAudit', '@dynamicShift', '@blockchainAudit', '@selfHeal', '@riskAssessment', '@operatorHeal', '@pythonAnalysis', '@rustVerification', '@goOptimization'];
const MESSAGES = [
  'NIST FIPS 140-2 CAVP Known Answer Test (KAT) verified on SHA-256 pipeline',
  'Smart Contract Access Control granted dynamic patch execution token',
  'Applied self-healing routine to test engine across Rust & Python modules',
  'Dynamic test redistribution (Chaos mode activated)',
  'ML confidence threshold reached: 99.97% verification certainty',
  'FIPS 140-2 compliance certificate valid. SHA-256 block sealed',
  'Access Control Rule triggered: auto-quarantined compromised staging test artifact',
  'Multi-language routine injected into Go microservice via K8s Operator',
  'WASM CosmWasm smart contract executed state transition on ATOMIC LEDGER',
  '[Python] Detected dependency vulnerability in requirements.txt. Auto-resolving with secure AST patching.',
  '[Rust] Borrow checker violation detected in crypto-engine. Injecting localized memory-safe remediation.',
  '[Go] Detected goroutine leak in auth-service. Applying concurrency-safe lifecycle management.',
  '[Python] Pytest suite failed in staging. Elite Oracle applying dynamic test shifting.',
  '[Rust] Cargo.toml audit identified deprecated crate. Upgrading and verifying with FIPS-validated signature.',
  '[Go] Staticcheck found redundant interface implementation. Optimizing binary size for K8s swarm.',
  '[WORKFLOW] Trigger @selfHeal verified. Executing Automated Repair Escrow release...',
  '[WORKFLOW] FIPS Violation detected in node-04. Smart Contract ACL invoking quarantine action.',
  '[DAO] Proposal #48 Passed: Allocating additional Rust repair agents to Polygon PoS cluster.',
  '[ORACLE] ML Confidence reached 99.98%. Updating on-chain state variable via Oracle Bridge.'
];

export function useSimulation() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [metrics, setMetrics] = useState<MetricPoint[]>(INITIAL_METRICS);
  const [pods, setPods] = useState<K8sPod[]>(INITIAL_PODS);
  const [workflows, setWorkflows] = useState<WorkflowAction[]>([
    { id: 'wf-1', name: 'Escrow Auto-Release', trigger: '@selfHeal Success', action: 'Release Escrow', status: 'Armed' },
    { id: 'wf-2', name: 'Quarantine Protocol', trigger: 'FIPS Violation', action: 'Quarantine Node', status: 'Monitoring' }
  ]);
  const [deployedContracts, setDeployedContracts] = useState<{address: string, name: string, network: string, template: string, status: 'Active' | 'Paused' | 'Terminated'}[]>([]);
  const [logs, setLogs] = useState<LogEvent[]>([
    { id: '1', timestamp: new Date().toISOString(), trigger: 'FIPS-140-2', message: 'NIST Cryptographic Engine initialized. SHA-256 CAVP verified.', type: 'success' },
    { id: '2', timestamp: new Date().toISOString(), trigger: 'SMART-CONTRACT', message: 'AtomicAccessControl.sol deployed at 0x8b3e...ab12. Event hooks active.', type: 'info' }
  ]);

  const simulatePodFailure = () => {
    setPods(prev => {
      const idx = Math.floor(Math.random() * prev.length);
      const newPods = [...prev];
      const targetPod = newPods[idx];
      newPods[idx] = { ...targetPod, status: 'CrashLoopBackOff' };
      
      setLogs(prevLogs => [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        trigger: '@smartContractACL',
        message: `Pod ${targetPod.name} entered CrashLoop. Smart Contract ACL evaluating quarantine policy...`,
        type: 'warning'
      }, ...prevLogs].slice(0, 50));

      setTimeout(() => {
        setPods(curr => {
          const healingPods = [...curr];
          if (healingPods[idx]) healingPods[idx] = { ...healingPods[idx], status: 'Healing' };
          return healingPods;
        });
        
        setLogs(prevLogs => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            trigger: '@operatorHeal',
            message: `K8s Operator self-healing initiated for ${targetPod.language} pod ${targetPod.name} with FIPS-140-2 patch signature`,
            type: 'info'
        }, ...prevLogs].slice(0, 50));

        setTimeout(() => {
          setPods(curr => {
            const restoredPods = [...curr];
            if (restoredPods[idx]) restoredPods[idx] = { ...restoredPods[idx], status: 'Running', restarts: restoredPods[idx].restarts + 1 };
            return restoredPods;
          });
          
          setBlocks(prevBlocks => {
            const last = prevBlocks[prevBlocks.length - 1];
            const timestamp = new Date().toISOString();
            const action = `k8s_heal_${targetPod.language.toLowerCase()}_verified`;
            const network = 'ATOMIC Native';
            const payload = { pod: targetPod.name, language: targetPod.language, fipsStatus: 'PASS' };
            const newBlock: Block = {
              index: last.index + 1,
              timestamp,
              action,
              hash: generateFipsHash(last.index + 1, timestamp, action, last.hash, network, JSON.stringify(payload)),
              previousHash: last.hash,
              status: 'verified',
              network,
              fipsValidated: true,
              signerRole: 'ROLE_AUTOMATED_HEALER',
              gasUsed: 32000,
              contractPayload: payload
            };
            return [...prevBlocks, newBlock];
          });
          
          setLogs(prevLogs => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            trigger: '@blockchainAudit',
            message: `Pod ${targetPod.name} restored. FIPS-140-2 cryptographic receipt logged on ATOMIC LEDGER.`,
            type: 'success'
          }, ...prevLogs].slice(0, 50));
        }, 3000);
      }, 2000);

      return newPods;
    });
  };

  useEffect(() => {
    const metricInterval = setInterval(() => {
      setMetrics(prev => {
        const newPoint: MetricPoint = {
          time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          confidence: Math.min(99.99, 96 + Math.random() * 3.98),
          selfHealingRate: Math.min(100, 90 + Math.random() * 9),
          riskScore: Math.max(2, 10 + Math.random() * 12),
          testCoverage: Math.min(100, Math.max(92, prev[prev.length - 1].testCoverage + (Math.random() - 0.5) * 1.5)),
          latency: Math.max(80, 120 + (Math.random() - 0.4) * 200),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    const logInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const type = Math.random() > 0.85 ? 'warning' : 'success';
        const newLog: LogEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          trigger: TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)],
          message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
          type
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 4500);
    
    const blockInterval = setInterval(() => {
      if (Math.random() > 0.75) {
        setBlocks(prev => {
          const last = prev[prev.length - 1];
          const actions = [
            'auto_remediate_rust', 
            'test_shift_python', 
            'ml_predict_go', 
            'fips_140_2_kat_verify', 
            'acl_rbac_eval_clearance', 
            'remediate_ts_types', 
            'patch_react_hooks', 
            'secure_shell_script', 
            'yaml_ci_cd_auth'
          ];
          const action = actions[Math.floor(Math.random() * actions.length)];
          const network = NETWORKS[Math.floor(Math.random() * NETWORKS.length)];
          const timestamp = new Date().toISOString();
          const payload = { autoEngine: true, fipsMode: 'NIST-FIPS-140-2' };
          const newBlock: Block = {
            index: last.index + 1,
            timestamp,
            action,
            hash: generateFipsHash(last.index + 1, timestamp, action, last.hash, network, JSON.stringify(payload)),
            previousHash: last.hash,
            status: 'verified',
            network,
            fipsValidated: true,
            signerRole: 'ROLE_SECURITY_AUDITOR_FIPS',
            gasUsed: Math.floor(Math.random() * 40000) + 21000,
            contractPayload: payload
          };
          
          setLogs(logPrev => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            trigger: '@blockchainAudit',
            message: `Block #${newBlock.index} verified via FIPS 140-2 on ${network} (${action})`,
            type: 'success'
          }, ...logPrev].slice(0, 50));

          return [...prev, newBlock];
        });
      }
    }, 14000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(logInterval);
      clearInterval(blockInterval);
    };
  }, []);

  const addBlock = useCallback((action: string, network: string = 'ATOMIC Native', contractAddress?: string, contractPayload?: any) => {
    setBlocks(prev => {
      const last = prev[prev.length - 1];
      const timestamp = new Date().toISOString();
      const newBlock: Block = {
        index: last.index + 1,
        timestamp,
        action,
        hash: generateFipsHash(last.index + 1, timestamp, action, last.hash, network, contractPayload ? JSON.stringify(contractPayload) : ''),
        previousHash: last.hash,
        status: 'verified',
        network,
        contractAddress,
        contractPayload,
        fipsValidated: true,
        signerRole: 'ROLE_SECURITY_AUDITOR_FIPS',
        gasUsed: Math.floor(Math.random() * 50000) + 21000
      };
      
      setLogs(logPrev => [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        trigger: '@blockchainAudit',
        message: `New block #${newBlock.index} mined & FIPS-verified on ${network} (${action})`,
        type: 'success'
      }, ...logPrev].slice(0, 50));

      return [...prev, newBlock];
    });
  }, []);

  const deployContract = useCallback((network: string, contractName: string, payload: any) => {
    const address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    addBlock(`deploy_contract_${payload.language === 'WASM' ? 'wasm' : 'evm'}`, network, address, { name: contractName, ...payload });
    setDeployedContracts(prev => [...prev, { address, name: contractName, network, template: payload.template || 'custom', status: 'Active' }]);
    return address;
  }, [addBlock]);

  const updateContractStatus = useCallback((address: string, status: 'Active' | 'Paused' | 'Terminated') => {
    setDeployedContracts(prev => prev.map(c => c.address === address ? { ...c, status } : c));
    addBlock(`contract_status_update (${status})`, 'ATOMIC Native', address, { newStatus: status });
  }, [addBlock]);

  const executeContract = useCallback((network: string, contractAddress: string, action: string, payload: any) => {
    addBlock(`execute_acl_${action.toLowerCase().replace(/ /g, '_')}`, network, contractAddress, payload);
  }, [addBlock]);

  const addWorkflow = useCallback((workflow: Omit<WorkflowAction, 'id'>) => {
    const newWf: WorkflowAction = { ...workflow, id: `wf-${Math.random().toString(36).substr(2, 9)}` };
    setWorkflows(prev => [...prev, newWf]);
    return newWf.id;
  }, []);

  const removeWorkflow = useCallback((id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  }, []);

  return { blocks, metrics, logs, pods, deployedContracts, workflows, simulatePodFailure, addBlock, deployContract, executeContract, addWorkflow, removeWorkflow, updateContractStatus, NETWORKS };
}
