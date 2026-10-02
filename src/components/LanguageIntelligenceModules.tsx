import React, { useState } from 'react';
import { Terminal, Cpu, ShieldCheck, Zap, Code2, AlertTriangle, CheckCircle2, FlaskConical, Binary, Layers } from 'lucide-react';
import * as motion from 'motion/react-client';

type Language = 'Python' | 'Rust' | 'Go';

interface AnalysisModule {
  name: string;
  status: 'active' | 'idle' | 'warning';
  lastAction: string;
  metrics: { label: string, value: string }[];
}

const LANGUAGE_DATA: Record<Language, {
  icon: typeof Code2,
  color: string,
  glow: string,
  description: string,
  modules: AnalysisModule[],
  repairLogic: string
}> = {
  Python: {
    icon: Code2,
    color: 'text-blue-400',
    glow: 'glow-text-blue',
    description: 'Autonomous AST-level remediation for Python ecosystems with Pytest & Bandit integration.',
    modules: [
      { name: 'AST Structural Analyzer', status: 'active', lastAction: 'Parsed requirements.txt for CVE-2024-X', metrics: [{ label: 'Node Depth', value: '142' }, { label: 'Complexity', value: 'Moderate' }] },
      { name: 'Pytest Dynamic Shifter', status: 'active', lastAction: 'Re-prioritized failing CI suites', metrics: [{ label: 'Test Coverage', value: '94.2%' }, { label: 'Fail Rate', value: '0.04%' }] },
      { name: 'Bandit Security Agent', status: 'warning', lastAction: 'Identified insecure pickling in legacy module', metrics: [{ label: 'Vulnerabilities', value: '1 High' }, { label: 'Safe Pass', value: '89%' }] },
    ],
    repairLogic: 'ELITE Oracle leverages Python Abstract Syntax Trees (AST) to rewrite vulnerable code blocks without changing runtime behavior, ensuring FIPS 140-2 compliance.'
  },
  Rust: {
    icon: Binary,
    color: 'text-orange-400',
    glow: 'glow-text-orange',
    description: 'Memory-safe auto-remediation leveraging Cargo-Audit and Clippy for Rust microservices.',
    modules: [
      { name: 'Cargo Audit Engine', status: 'active', lastAction: 'Upgraded tokio to v1.35.1 (Security)', metrics: [{ label: 'Crates Scanned', value: '254' }, { label: 'Vulnerabilities', value: '0' }] },
      { name: 'Clippy Auto-Fixer', status: 'active', lastAction: 'Resolved redundant clone allocations', metrics: [{ label: 'Lints Fixed', value: '12' }, { label: 'Perf Gain', value: '+3.2%' }] },
      { name: 'Borrow Check Auditor', status: 'active', lastAction: 'Verified thread safety in crypto-engine', metrics: [{ label: 'Safety Score', value: '99.9%' }, { label: 'Static Checks', value: 'Pass' }] },
    ],
    repairLogic: 'Remediation engine interfaces with rust-analyzer to suggest type-safe patches that satisfy the borrow checker and pass FIPS-validated signature checks.'
  },
  Go: {
    icon: Cpu,
    color: 'text-cyan-400',
    glow: 'glow-text-blue',
    description: 'Concurrency-aware repair system for Go modules focusing on goroutine safety and staticcheck.',
    modules: [
      { name: 'Go Staticcheck Agent', status: 'active', lastAction: 'Refactored deprecated net/http methods', metrics: [{ label: 'Checks Run', value: '1,200' }, { label: 'Efficiency', value: '98%' }] },
      { name: 'Goroutine Leak Detector', status: 'warning', lastAction: 'Patched unclosed channel in auth-service', metrics: [{ label: 'Leaks Fixed', value: '1' }, { label: 'Active Rntm', value: 'Pass' }] },
      { name: 'Interface Auditor', status: 'active', lastAction: 'Optimized interface implementation chains', metrics: [{ label: 'Binary Reduction', value: '-1.4MB' }, { label: 'Type Count', value: '42' }] },
    ],
    repairLogic: 'Utilizes Go meta-programming and AST transformations to resolve race conditions and optimize dependency trees for multi-chain ledger sync.'
  }
};

export function LanguageIntelligenceModules() {
  const [selectedLang, setSelectedLang] = useState<Language>('Python');

  const data = LANGUAGE_DATA[selectedLang];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <Zap className="text-blue-400 glow-text-blue" />
            Universal Multi-Lang Intelligence
          </h2>
          <p className="text-slate-400 mt-1">Deep-tier analysis, repair, and testing modules for high-reliability enterprise codebases.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
          {(Object.keys(LANGUAGE_DATA) as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedLang === lang 
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 glow-border-blue' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Language Details Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 glow-border-blue h-full">
            <div className="flex items-center gap-4 mb-4">
               <div className={`p-3 bg-slate-900/50 rounded-xl border border-slate-800 ${data.color} ${data.glow}`}>
                  <data.icon size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-display font-bold text-white">{selectedLang} Elite Engine</h3>
                  <p className="text-xs text-slate-400 font-mono">v2.4.0 Stabilized</p>
               </div>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {data.description}
            </p>
            
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                <ShieldCheck size={14} /> HEALING STRATEGY
              </div>
              <p className="text-xs text-slate-400 italic leading-relaxed">
                "{data.repairLogic}"
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800/80">
               <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-slate-500">Autonomous Reliability</span>
                  <span className="text-emerald-400 glow-text-green">99.98%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[99.98%] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 font-bold px-1">
             Active Intelligence Modules
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.modules.map((module, i) => (
              <motion.div 
                key={module.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        module.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                        module.status === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' : 
                        'bg-slate-600'
                      }`}></div>
                      <span className="font-display font-semibold text-white">{module.name}</span>
                   </div>
                   <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      MOD-0{i+1}
                   </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                     <FlaskConical size={14} className="text-blue-400" />
                     <span className="truncate">{module.lastAction}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {module.metrics.map(m => (
                      <div key={m.label} className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                         <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{m.label}</div>
                         <div className="text-xs font-mono text-white mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* CI/CD Integration Module */}
            <div className="glass-card rounded-2xl p-5 bg-blue-600/5 border-blue-500/20 flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-3 mb-3">
                     <Layers className="text-blue-400" size={20} />
                     <span className="font-display font-semibold text-white">CI/CD Verifier Bridge</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                     Seamlessly injects FIPS-validated SHA-256 signatures into GitHub Workflows and K8s Operators after repair confirmation.
                  </p>
               </div>
               <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> SECURE BRIDGE ACTIVE
                  </span>
                  <button className="text-[10px] font-mono text-blue-400 hover:text-white transition-colors">
                    VIEW PIPELINE
                  </button>
               </div>
            </div>
          </div>

          {/* Interactive Shell / Terminal for Analysis */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                   <Terminal size={14} className="text-blue-400" />
                   {selectedLang.toUpperCase()} REPAIR AGENT RUNTIME
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                   <span className="text-[10px] font-mono text-slate-500">LISTENING</span>
                </div>
             </div>
             
             <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1.5 shadow-inner min-h-[120px]">
                <div>[SYSTEM] Initiating {selectedLang} language environment...</div>
                <div>[DOCKER] Spawning secure sandbox container [fips-140-2-verified]</div>
                {selectedLang === 'Python' && (
                  <>
                    <div className="text-blue-300">[PYTHON] Running Bandit security scanner... (Found 1 issue)</div>
                    <div className="text-blue-300">[PYTHON] Analysis: CWE-502 (Deserialization of Untrusted Data) detected in api.py:42</div>
                    <div className="text-emerald-400">[HEAL] Oracle: Applying secure AST-based pickling patch... Done.</div>
                  </>
                )}
                {selectedLang === 'Rust' && (
                  <>
                    <div className="text-orange-300">[RUST] Cargo-audit: Identifying vulnerable crates... (Found 0)</div>
                    <div className="text-orange-300">[RUST] Clippy: Checking for redundant heap allocations... (Found 12)</div>
                    <div className="text-emerald-400">[HEAL] Oracle: Applying zero-cost abstraction optimizations... Done.</div>
                  </>
                )}
                {selectedLang === 'Go' && (
                  <>
                    <div className="text-cyan-300">[GO] Staticcheck: Verifying interface satisfaction... (Pass)</div>
                    <div className="text-cyan-300">[GO] Runtime: Scanning for goroutine leaks... (Leak detected in net.listen)</div>
                    <div className="text-emerald-400">[HEAL] Oracle: Injecting context-aware cancellation logic... Done.</div>
                  </>
                )}
                <div className="animate-pulse">_</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
