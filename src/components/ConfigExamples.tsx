import React, { useState } from 'react';
import { Database, FileCode2, Terminal, Shield } from 'lucide-react';
import { Language } from '../types';

export function ConfigExamples() {
  const [activeTab, setActiveTab] = useState<Language | 'K8s Base' | 'CI/CD'>('Rust');

  const configs: Record<string, string> = {
    'Node.js': `import { AtomicRepair } from '@atomic-gods/elite';

const repair = new AtomicRepair({
  nodeVersion: process.version,
  eliteMode: true,
  dynamicShifting: true,
  blockchainAudit: true, // Enables ATOMIC LEDGER
  auditConfidence: 0.9997,
  enableSelfHealing: true,
  riskThreshold: 0.7
});

await repair.repair();
// Every action recorded on blockchain!`,
    'Rust': `use atomic_gods_elite::{AtomicRepair, EliteConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = EliteConfig::builder()
        .elite_mode(true)
        .dynamic_shifting(true)
        .blockchain_audit(true) // Native SHA-256 bindings
        .audit_confidence(0.9997)
        .risk_threshold(0.7)
        .build();

    let repair = AtomicRepair::new(config);
    repair.execute_repair().await?;
    
    Ok(())
}`,
    'Python': `from atomic_gods_elite import EliteController, Config

def start_repair():
    config = Config(
        elite_mode=True,
        dynamic_shifting=True,
        blockchain_audit=True,
        audit_confidence=0.9997,
        enable_self_healing=True
    )
    
    controller = EliteController(config)
    controller.repair()
    print("Repair logged to ATOMIC LEDGER")

if __name__ == "__main__":
    start_repair()`,
    'Go': `package main

import (
	"log"
	"github.com/atomic-gods/elite"
)

func main() {
	config := elite.Config{
		EliteMode:         true,
		DynamicShifting:   true,
		BlockchainAudit:   true, // ATOMIC LEDGER verification
		AuditConfidence:   0.9997,
		EnableSelfHealing: true,
		RiskThreshold:     0.7,
	}

	repair := elite.NewRepairSystem(config)
	if err := repair.Execute(); err != nil {
		log.Fatalf("Self-healing failed: %v", err)
	}
}`,
    'K8s Base': `apiVersion: atomicgods.io/v1alpha1
kind: EliteRepairOperator
metadata:
  name: global-swarm-operator
spec:
  blockchainVerification: true
  fipsCompliance: true
  ledgerEndpoint: "http://atomic-ledger.internal:3001"
  healingPolicies:
    - languageMatch: "rust|go"
      strategy: Predictive
      severity: High
    - languageMatch: "python|node"
      strategy: Adaptive
      severity: Medium`,
    'CI/CD': `name: Elite Auto-Repair + Blockchain

on:
  issue_comment:
    types: [created]

jobs:
  elite-repair:
    if: contains(github.event.comment.body, '@eliteAudit')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start ATOMIC LEDGER Daemon
        run: curl -sL https://atomic.sh | bash
        
      - name: Multi-Language Repair Matrix
        uses: atomic-gods/elite-action@v2
        with:
          languages: "node, rust, python, go"
          blockchain-audit: true
          
      - name: Export Blockchain Audit
        run: curl http://localhost:3001/api/blockchain > audit.json
        
      - uses: actions/upload-artifact@v4
        with:
          name: atomic-ledger-audit
          path: audit.json`
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-display font-semibold flex items-center gap-3 mb-2">
          <FileCode2 className="text-blue-400" />
          Multi-Language & CI/CD Integration
        </h2>
        <p className="text-slate-400 mb-6 max-w-2xl">
          Universal Auto-Repair System configurations. Every integration supports real-time bridging to the ATOMIC LEDGER blockchain.
        </p>

        <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-800 pb-4">
          {(Object.keys(configs) as (Language | 'K8s Base' | 'CI/CD')[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative rounded-lg overflow-hidden bg-[#0d1117] border border-slate-700 font-mono text-sm shadow-2xl">
          <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800 gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 text-xs text-slate-500">
              {activeTab === 'CI/CD' ? 'github-actions.yml' : activeTab === 'K8s Base' ? 'operator-crd.yaml' : `main.${activeTab === 'Rust' ? 'rs' : activeTab === 'Python' ? 'py' : activeTab === 'Go' ? 'go' : 'ts'}`}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-slate-300">
             <code>{configs[activeTab]}</code>
          </pre>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
           <Shield className="text-emerald-500 shrink-0 mt-1" />
           <div>
             <h4 className="text-emerald-400 font-semibold mb-1">FIPS 140-2 Native Bindings Active</h4>
             <p className="text-slate-400 text-sm">
               The multi-language wrappers automatically leverage platform-native crypto libraries to ensure compliance while validating SHA-256 blocks.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
