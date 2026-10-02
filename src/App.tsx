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
import { SupabaseAuth } from './components/SupabaseAuth';
import { FipsCryptoValidation } from './components/FipsCryptoValidation';
import { SmartContractAccessControl } from './components/SmartContractAccessControl';
import { WalletPortfolioAI } from './components/WalletPortfolioAI';
import { EnterpriseUserGuide } from './components/EnterpriseUserGuide';
import { LanguageIntelligenceModules } from './components/LanguageIntelligenceModules';
import { SmartContractStudio } from './components/SmartContractStudio';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const { blocks, metrics, logs, pods, deployedContracts, simulatePodFailure, addBlock, deployContract, executeContract, NETWORKS } = useSimulation();
  const [activeNetwork, setActiveNetwork] = useState(NETWORKS[0]);

  if (!isAuthenticated) {
    return <SupabaseAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout currentView={currentView} setView={setCurrentView} activeNetwork={activeNetwork}>
      <AnimatePresence mode="wait">
        <motion.div
           key={currentView}
           initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
           transition={{ duration: 0.25 }}
           className="h-full flex-1 w-full"
        >
          {currentView === 'dashboard' && (
            <Dashboard metrics={metrics} logs={logs} currentBlock={blocks[blocks.length - 1]} />
          )}
          {currentView === 'fipscrypto' && (
            <FipsCryptoValidation />
          )}
          {currentView === 'smartcontracts' && (
            <SmartContractAccessControl 
              blocks={blocks}
              addBlock={addBlock}
              deployContract={deployContract}
              executeContract={executeContract}
              activeNetwork={activeNetwork}
            />
          )}
          {currentView === 'dappstudio' && (
            <SmartContractStudio 
              blocks={blocks}
              deployContract={deployContract}
              executeContract={executeContract}
              NETWORKS={NETWORKS}
              activeNetwork={activeNetwork}
              deployedContracts={deployedContracts}
            />
          )}
          {currentView === 'wallet' && (
            <WalletPortfolioAI />
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
          {currentView === 'langintel' && (
            <LanguageIntelligenceModules />
          )}
          {currentView === 'guide' && (
            <EnterpriseUserGuide />
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
            <div className="flex flex-col items-center justify-center p-12 md:p-20 text-center glass-card rounded-2xl">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50 mb-6 glow-border-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                 <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">🤖</span>
               </div>
               <h2 className="text-2xl font-display font-bold mb-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">ML Oracle Predictive Engine</h2>
               <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                 Autonomous capacity forecasting, proactive memory leak detection, and real-time FIPS 140-2 cryptographic verification are operating under optimal consensus.
               </p>
               <div className="mt-8 flex flex-wrap gap-3 justify-center">
                 <button onClick={() => setCurrentView('smartcontracts')} className="px-5 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-mono font-medium rounded-xl transition-all border border-purple-500/50 glow-border-purple">
                   Smart Contract ACL
                 </button>
                 <button onClick={() => setCurrentView('blockchain')} className="px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-mono font-medium rounded-xl transition-all border border-blue-500/50 glow-border-blue">
                   View ATOMIC LEDGER
                 </button>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
