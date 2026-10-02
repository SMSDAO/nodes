import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { 
  Hexagon, 
  LayoutDashboard, 
  Database, 
  Activity, 
  Github, 
  Menu, 
  Server, 
  FileCode2, 
  X, 
  ScanSearch, 
  CheckCircle2, 
  Loader2, 
  Wallet, 
  History, 
  ShieldCheck, 
  Key, 
  Coins, 
  BookOpen,
  Zap,
  Rocket,
  Workflow
} from 'lucide-react';

interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  pulse?: boolean;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

interface LayoutProps {
  currentView: ViewState;
  setView: (v: ViewState) => void;
  children: React.ReactNode;
  activeNetwork: string;
}

export function Layout({ currentView, setView, children, activeNetwork }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkLatency(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(12, Math.min(120, prev + change));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [activeNetwork]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setGithubConnected(true);
        setConnecting(false);
      }
    };
    window.addEventListener('message', handleMessage);
    
    fetch('/api/auth/status')
      .then(res => res.json())
      .then(data => {
        if (data.connected) setGithubConnected(true);
      })
      .catch(console.error);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGithubConnect = async () => {
    try {
      setConnecting(true);
      const response = await fetch('/api/auth/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      if (!authWindow) alert('Please allow popups to connect GitHub.');
    } catch (e) {
      console.error(e);
      setConnecting(false);
    }
  };

  const handleWalletConnect = () => {
    setWalletConnecting(true);
    setTimeout(() => {
      setWalletConnected(true);
      setWalletConnecting(false);
    }, 1200);
  };

  const navCategories: NavCategory[] = [
    {
      category: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Surgery Dashboard', icon: LayoutDashboard, badge: 'Live' },
        { id: 'dappstudio', label: 'dApp & Automation Studio', icon: Rocket, badge: 'New' },
        { id: 'fipscrypto', label: 'FIPS 140-2 Crypto', icon: ShieldCheck, badge: 'NIST Level 3' },
        { id: 'smartcontracts', label: 'Smart Contract ACL', icon: Key, badge: 'Auto Bridge' },
        { id: 'wallet', label: 'Web3 Wallet & AI', icon: Wallet, badge: 'HD Vault' },
      ]
    },
    {
      category: 'Consensus & Infrastructure',
      items: [
        { id: 'blockchain', label: 'ATOMIC LEDGER', icon: Database, pulse: true },
        { id: 'scanner', label: 'Repo Scanner', icon: ScanSearch },
        { id: 'evmbridge', label: 'EVM Bridge Audit', icon: Coins },
        { id: 'kubernetes', label: 'K8s Operator Swarm', icon: Server },
        { id: 'planner', label: 'Capacity Planner', icon: Activity },
      ]
    },
    {
      category: 'Telemetry & Documentation',
      items: [
        { id: 'langintel', label: 'Universal Auto-Repair', icon: Zap, badge: 'Elite' },
        { id: 'history', label: 'Repair History', icon: History },
        { id: 'config', label: 'Multi-Lang Matrix', icon: FileCode2 },
        { id: 'guide', label: 'Enterprise User Guide', icon: BookOpen, badge: 'Docs' },
      ]
    }
  ];

  const allItems: NavItem[] = navCategories.flatMap(c => c.items);
  const activeItem = allItems.find(i => i.id === currentView);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row bg-transparent text-slate-200 overflow-hidden relative font-sans">
      
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-lg transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Optimized with Touch Scroll */}
      <aside className={`w-72 border-r border-slate-700/40 glass-panel shrink-0 flex flex-col fixed md:relative z-50 h-[100dvh] transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl relative overflow-hidden bg-purple-600/20 border border-purple-500/50 flex items-center justify-center glow-border-purple">
              <Hexagon size={22} className="text-purple-300 relative z-10 glow-text-purple animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-tight leading-tight text-white glow-text-purple">ATOMIC SWARM</h1>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-blue-400 font-bold tracking-widest glow-text-blue">GODS ELITE v2.4</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-border-green"></span>
              </div>
            </div>
          </div>
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation - iPhone 13 Pro Max viewport scroll fix */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto ios-scroll-fix pb-16">
          {navCategories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-3 py-1">
                {cat.category}
              </div>
              {cat.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    currentView === item.id 
                      ? 'glass-tab-active border border-blue-500/40 glow-border-blue text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <item.icon size={16} className={currentView === item.id ? 'glow-text-blue text-blue-400' : 'text-slate-400'} />
                  <span className="font-medium text-left flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      currentView === item.id ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.pulse && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer HUD & Auth */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-emerald-400 glow-text-green font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              FIPS 140-2 SEAL ACTIVE
            </span>
            <span className="text-slate-500">AES-256</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {!githubConnected ? (
              <button
                onClick={handleGithubConnect}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                {connecting ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
                GitHub
              </button>
            ) : (
              <div className="py-1.5 px-2 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={12} /> Sync OK
              </div>
            )}

            {!walletConnected ? (
              <button
                onClick={handleWalletConnect}
                className="py-1.5 px-2 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/40 rounded-lg text-[11px] font-mono text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                {walletConnecting ? <Loader2 size={12} className="animate-spin" /> : <Wallet size={12} />}
                Connect
              </button>
            ) : (
              <div className="py-1.5 px-2 bg-blue-950/30 border border-blue-800/40 rounded-lg text-[11px] font-mono text-blue-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={12} /> 0x7a...4eF
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-transparent">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 glass-panel flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-display font-bold text-base md:text-lg text-white capitalize flex items-center gap-2">
                <span className="glow-text-blue">
                  {activeItem?.label || currentView}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
              <div className="flex items-center gap-1.5">
                <Database size={13} className="text-purple-400 glow-text-purple" />
                <span className="text-slate-400">Chain:</span>
                <span className="text-white font-bold glow-text-blue">{activeNetwork}</span>
              </div>
              <div className="w-px h-3 bg-slate-800"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="w-px h-3 bg-slate-800"></div>
              <div className="flex items-center gap-1">
                <Activity size={13} className={networkLatency < 50 ? "text-emerald-400" : "text-amber-400"} />
                <span className="text-slate-300">{networkLatency}ms</span>
              </div>
            </div>

            <button 
              onClick={() => setView('wallet')}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all glow-border-blue"
            >
              <Wallet size={13} />
              <span className="hidden sm:inline">Web3 Vault</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Children Container - Optimized for Mobile */}
        <div className="flex-1 overflow-y-auto p-3.5 md:p-8 bg-transparent ios-scroll-fix">
          <div className="max-w-7xl mx-auto w-full pb-10">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
