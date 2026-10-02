import React, { useState } from 'react';
import { BookOpen, Shield, Cpu, Terminal, Layers, ArrowRight, CheckCircle2, Zap, Lock, Sparkles, KeyRound, Server, FileCode2 } from 'lucide-react';

export function EnterpriseUserGuide() {
  const [activeSection, setActiveSection] = useState<'architecture' | 'fipsGuide' | 'smartContracts' | 'multiLang' | 'cliReference'>('architecture');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 glow-border-blue">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl glow-border-blue">
                <BookOpen className="text-blue-400 glow-text-blue w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  <span>ATOMIC SWARM Enterprise User Manual</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">DOCS v2.4</span>
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Complete architectural specifications, cryptographic policies, smart contract integration workflows, and self-healing CI/CD operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'architecture'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 glow-border-blue'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Layers size={14} /> System Architecture
          </button>
          <button
            onClick={() => setActiveSection('fipsGuide')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'fipsGuide'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 glow-border-green'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Shield size={14} /> FIPS 140-2 Cryptography
          </button>
          <button
            onClick={() => setActiveSection('smartContracts')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'smartContracts'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 glow-border-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Cpu size={14} /> Smart Contract Bridge
          </button>
          <button
            onClick={() => setActiveSection('multiLang')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'multiLang'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 glow-border-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <FileCode2 size={14} /> Multi-Language Matrix
          </button>
          <button
            onClick={() => setActiveSection('cliReference')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'cliReference'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 glow-border-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Terminal size={14} /> CLI & SDK Cheatsheet
          </button>
        </div>
      </div>

      {/* Section: Architecture */}
      {activeSection === 'architecture' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Layers className="text-blue-400 glow-text-blue" />
            End-to-End Autonomous Self-Healing Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">1</span>
                Chaos Ingestion & ML Oracle
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Repository scanners inspect failing test suites across Python, Rust, Go, and Node.js. AI models synthesize candidate fixes with 99.97% target confidence.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">2</span>
                FIPS 140-2 Cryptographic Seal
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every patch bytecode payload is hashed via NIST CAVP-validated SHA-256 and signed with HMAC keying material to guarantee zero tamper vulnerability.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40">3</span>
                Smart Contract ACL & K8s Deploy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                AtomicAccessControl contracts evaluate on-chain access clearance, trigger automatic quarantines if anomaly score spikes, and release hotfixes to the K8s swarm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section: FIPS */}
      {activeSection === 'fipsGuide' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="text-emerald-400 glow-text-green" />
            FIPS 140-2 Compliance Guide
          </h3>
          <p className="text-xs text-slate-300">
            ATOMIC LEDGER conforms to NIST FIPS PUB 140-2 Level 3 standards. Key cryptographic mechanisms include:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-emerald-400">SHA-256 (FIPS PUB 180-4):</strong> Used for immutable block linking, merkle roots, and code artifact digest generation.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-blue-400">HMAC-SHA256 (FIPS PUB 198-1):</strong> Authenticates CI/CD runner execution credentials and cluster operator tokens.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-amber-400">NIST SP 800-90B:</strong> Non-deterministic hardware entropy pooling for BIP-39 mnemonic seed phrases.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-purple-400">Section 4.7.6 Key Zeroization:</strong> One-touch volatile memory destruction in event of detected intrusion.
            </div>
          </div>
        </div>
      )}

      {/* Section: Smart Contracts */}
      {activeSection === 'smartContracts' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Cpu className="text-purple-400 glow-text-purple" />
            Smart Contract Event Bridge Manual
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The <code className="text-purple-300">AtomicAccessControl</code> contract acts as an immutable on-chain gatekeeper. When test telemetry reports anomalies or FIPS self-tests fail, smart contracts execute automated quarantines and pause CI/CD rollouts across Kubernetes pods.
          </p>
        </div>
      )}

      {/* Section: MultiLang */}
      {activeSection === 'multiLang' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <FileCode2 className="text-amber-400 glow-text-orange" />
            Multi-Language Universal Auto-Repair Matrix
          </h3>
          <p className="text-xs text-slate-300">
            ATOMIC SWARM natively supports self-healing repair routines across all major enterprise ecosystems:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-orange-400 font-bold mb-1">Rust</div>
              <div className="text-[11px] text-slate-400">cargo test / ring-fips</div>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-yellow-400 font-bold mb-1">Python</div>
              <div className="text-[11px] text-slate-400">pytest / pycryptodome</div>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-cyan-400 font-bold mb-1">Go</div>
              <div className="text-[11px] text-slate-400">go test / boringcrypto</div>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-blue-400 font-bold mb-1">Node.js / TS</div>
              <div className="text-[11px] text-slate-400">vitest / OpenSSL FIPS</div>
            </div>
          </div>
        </div>
      )}

      {/* Section: CLI */}
      {activeSection === 'cliReference' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Terminal className="text-red-400 glow-text-orange" />
            Atomic CLI Developer Reference
          </h3>
          <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
{`# 1. Initialize Autonomous Swarm Daemon
atomic-cli swarm init --fips-compliance=level3 --multi-lang="rust,go,python,node"

# 2. Run NIST CAVP Known Answer Tests
atomic-cli crypto test-cavp --standard=FIPS-180-4

# 3. Deploy Access Control Smart Contract
atomic-cli contracts deploy AtomicAccessControl.sol --network "Polygon PoS"

# 4. Trigger Instant Repository Self-Healing
atomic-cli heal --repo="owner/service" --confidence-threshold=0.9997

# 5. Broadcast Emergency Memory Zeroization
atomic-cli crypto zeroize --confirm-fips-erase`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
