import { useState } from 'react';
import { ViewState } from './types';
import { useSimulation } from './useSimulation';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { KubernetesOperator } from './components/KubernetesOperator';
import { ConfigExamples } from './components/ConfigExamples';
import { RepositoryScanner } from './components/RepositoryScanner';
import { EVMBridgeSecurity } from './components/EVMBridgeSecurity';
import { CapacityPlanner } from './components/CapacityPlanner';
import { RepairHistory } from './components/RepairHistory';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const { blocks, metrics, logs, pods, simulatePodFailure, addBlock, deployContract, executeContract, NETWORKS } = useSimulation();
  const [activeNetwork, setActiveNetwork] = useState(NETWORKS[0]);

  return (
    <Layout currentView={currentView} setView={setCurrentView} activeNetwork={activeNetwork}>
      {currentView === 'dashboard' && (
        <Dashboard metrics={metrics} logs={logs} currentBlock={blocks[blocks.length - 1]} />
      )}
      {currentView === 'scanner' && (
        <RepositoryScanner addBlock={addBlock} />
      )}
      {currentView === 'evmbridge' && (
        <EVMBridgeSecurity addBlock={addBlock} />
      )}
      {currentView === 'kubernetes' && (
        <KubernetesOperator pods={pods} onForceFailure={simulatePodFailure} />
      )}
      {currentView === 'planner' && (
        <CapacityPlanner />
      )}
      {currentView === 'history' && (
        <RepairHistory blocks={blocks} />
      )}
      {currentView === 'config' && (
        <ConfigExamples />
      )}
      {currentView === 'blockchain' && (
        <BlockchainExplorer 
          blocks={blocks} 
          deployContract={deployContract} 
          executeContract={executeContract} 
          NETWORKS={NETWORKS} 
          activeNetwork={activeNetwork}
          setActiveNetwork={setActiveNetwork}
        />
      )}
      {currentView === 'metrics' && (
        <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center p-20 text-center glass-panel rounded-xl">
           <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 mb-6">
             <span className="text-3xl">🤖</span>
           </div>
           <h2 className="text-2xl font-display font-bold mb-2">ML Oracle Memory</h2>
           <p className="text-slate-400 max-w-md">
             Advanced predictive capacity planning and zero-downtime upgrades are queued. Real-time anomaly detection is currently operating smoothly. 
           </p>
           <button onClick={() => setCurrentView('blockchain')} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-500 shadow-lg">
             View Audit Trail
           </button>
        </div>
      )}
    </Layout>
  );
}
