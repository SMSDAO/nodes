import { useState, useEffect, useCallback } from 'react';
import { Block, LogEvent, MetricPoint, K8sPod, Language } from './types';
import SHA256 from 'crypto-js/sha256';

const generateHash = (index: number, timestamp: string, action: string, previousHash: string): string => {
  return SHA256(`${index}${timestamp}${action}${previousHash}`).toString();
};

const INITIAL_BLOCKS: Block[] = [
  { index: 0, timestamp: new Date(Date.now() - 600000).toISOString(), action: 'Genesis Block - Swarm Init', hash: '', previousHash: '0000000000000000000000000000000000000000000000000000000000000000', status: 'verified' },
  { index: 1, timestamp: new Date(Date.now() - 300000).toISOString(), action: 'session_created (react)', hash: '', previousHash: '', status: 'verified' },
  { index: 2, timestamp: new Date(Date.now() - 150000).toISOString(), action: 'elite_audit_complete', hash: '', previousHash: '', status: 'verified' },
];

INITIAL_BLOCKS[0].hash = generateHash(0, INITIAL_BLOCKS[0].timestamp, INITIAL_BLOCKS[0].action, INITIAL_BLOCKS[0].previousHash);
INITIAL_BLOCKS[1].previousHash = INITIAL_BLOCKS[0].hash;
INITIAL_BLOCKS[1].hash = generateHash(1, INITIAL_BLOCKS[1].timestamp, INITIAL_BLOCKS[1].action, INITIAL_BLOCKS[1].previousHash);
INITIAL_BLOCKS[2].previousHash = INITIAL_BLOCKS[1].hash;
INITIAL_BLOCKS[2].hash = generateHash(2, INITIAL_BLOCKS[2].timestamp, INITIAL_BLOCKS[2].action, INITIAL_BLOCKS[2].previousHash);


const INITIAL_METRICS: MetricPoint[] = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (20 - i) * 5000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
  confidence: 90 + Math.random() * 9.97, // Targeting ~99.97%
  selfHealingRate: 85 + Math.random() * 10,
  riskScore: 20 + Math.random() * 15,
  testCoverage: 92 + Math.random() * 3,
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

const TRIGGERS = ['@repairFull', '@eliteAudit', '@dynamicShift', '@blockchainAudit', '@selfHeal', '@riskAssessment', '@operatorHeal'];
const MESSAGES = [
  'Applied self-healing routine to test engine',
  'Dynamic test redistribution (Chaos mode)',
  'ML confidence threshold met',
  'SHA-256 Block verified',
  'Risk profile updated',
  'FIPS 140-2 compliance check passed',
  'Multi-language routine injected (Rust/Python)',
  'Kubernetes Operator initiated pod restart'
];

export function useSimulation() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [metrics, setMetrics] = useState<MetricPoint[]>(INITIAL_METRICS);
  const [pods, setPods] = useState<K8sPod[]>(INITIAL_PODS);
  const [logs, setLogs] = useState<LogEvent[]>([
    { id: '1', timestamp: new Date().toISOString(), trigger: 'SYSTEM', message: 'ATOMIC LEDGER online. SHA-256 active. K8s Operator synced.', type: 'info' }
  ]);

  const simulatePodFailure = () => {
    setPods(prev => {
      const idx = Math.floor(Math.random() * prev.length);
      const newPods = [...prev];
      newPods[idx] = { ...newPods[idx], status: 'CrashLoopBackOff' };
      
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
            message: `K8s Operator self-healing initiated for ${newPods[idx].language} pod ${newPods[idx].name}`,
            type: 'warning'
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
            const action = `k8s_heal_${newPods[idx].language.toLowerCase()}`;
            const newBlock: Block = {
              index: last.index + 1,
              timestamp,
              action,
              hash: generateHash(last.index + 1, timestamp, action, last.hash),
              previousHash: last.hash,
              status: 'verified'
            };
            return [...prevBlocks, newBlock];
          });
          
          setLogs(prevLogs => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            trigger: '@blockchainAudit',
            message: `Pod ${newPods[idx].name} restored. Verified on ATOMIC LEDGER.`,
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
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          confidence: Math.min(99.99, 95 + Math.random() * 4.97),
          selfHealingRate: Math.min(100, 88 + Math.random() * 8),
          riskScore: Math.max(0, 10 + Math.random() * 15),
          testCoverage: Math.min(100, Math.max(90, prev[prev.length - 1].testCoverage + (Math.random() - 0.5) * 2)),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    const logInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const type = Math.random() > 0.8 ? 'warning' : 'success';
        const newLog: LogEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          trigger: TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)],
          message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
          type
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 4000);
    
    const blockInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlocks(prev => {
          const last = prev[prev.length - 1];
          const actions = ['auto_remediate_rust', 'test_shift_python', 'ml_predict_go', 'fips_validate_node', 'remediate_ts_types', 'patch_react_hooks', 'secure_shell_script', 'yaml_ci_cd_auth', 'html_csp_enforce'];
          const action = actions[Math.floor(Math.random() * actions.length)];
          const timestamp = new Date().toISOString();
          const newBlock: Block = {
            index: last.index + 1,
            timestamp,
            action,
            hash: generateHash(last.index + 1, timestamp, action, last.hash),
            previousHash: last.hash,
            status: 'verified'
          };
          
          setLogs(logPrev => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            trigger: '@blockchainAudit',
            message: `New block #${newBlock.index} mined & verified (${action})`,
            type: 'success'
          }, ...logPrev].slice(0, 50));

          return [...prev, newBlock];
        });
      }
    }, 12000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(logInterval);
      clearInterval(blockInterval);
    };
  }, []);

  const addBlock = useCallback((action: string) => {
    setBlocks(prev => {
      const last = prev[prev.length - 1];
      const timestamp = new Date().toISOString();
      const newBlock: Block = {
        index: last.index + 1,
        timestamp,
        action,
        hash: generateHash(last.index + 1, timestamp, action, last.hash),
        previousHash: last.hash,
        status: 'verified'
      };
      
      setLogs(logPrev => [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        trigger: '@blockchainAudit',
        message: `New block #${newBlock.index} mined & verified (${action})`,
        type: 'success'
      }, ...logPrev].slice(0, 50));

      return [...prev, newBlock];
    });
  }, []);

  return { blocks, metrics, logs, pods, simulatePodFailure, addBlock };
}
