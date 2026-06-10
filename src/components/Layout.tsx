import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Hexagon, LayoutDashboard, Database, Activity, Github, Settings, Menu, Server, FileCode2, X, ScanSearch, CheckCircle2, Loader2, Wallet, History } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  setView: (v: ViewState) => void;
  children: React.ReactNode;
}

export function Layout({ currentView, setView, children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);

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
    }, 1500);
  };

  const navItems = [
    { id: 'dashboard', label: 'Surgery Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Repo Scanner', icon: ScanSearch },
    { id: 'evmbridge', label: 'EVM Bridge Audit', icon: Wallet },
    { id: 'kubernetes', label: 'K8s Operator', icon: Server },
    { id: 'planner', label: 'Capacity Planner', icon: Activity },
    { id: 'blockchain', label: 'ATOMIC LEDGER', icon: Database },
    { id: 'history', label: 'Repair History', icon: History },
    { id: 'metrics', label: 'ML Analytics', icon: Activity },
    { id: 'config', label: 'Multi-Lang Config', icon: FileCode2 },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-200">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 border-r border-slate-800 bg-slate-900/95 md:bg-slate-900/40 shrink-0 flex flex-col fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded relative overflow-hidden bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Hexagon size={20} className="text-white relative z-10" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-tight leading-tight">ATOMIC SWARM</h1>
              <h2 className="font-mono text-[10px] text-blue-400 font-semibold tracking-widest">GODS ELITE v1.7.0</h2>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_12px_rgba(37,99,235,0.1)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.id === 'blockchain' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-500 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            FIPS 140-2 Active
          </div>
          
          {!githubConnected ? (
            <div 
              onClick={handleGithubConnect}
              className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {connecting ? <Loader2 size={14} className="animate-spin" /> : <Github size={14} />} 
              {connecting ? 'Connecting...' : 'Sign in with GitHub'}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 cursor-default">
              <CheckCircle2 size={14} /> GitHub Connected
            </div>
          )}

          {!walletConnected ? (
            <div 
              onClick={handleWalletConnect}
              className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {walletConnecting ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />} 
              {walletConnecting ? 'Connecting...' : 'Connect Web3 Wallet'}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-blue-400 cursor-default">
              <CheckCircle2 size={14} /> Wallet 0x7a...4eF
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
            <Settings size={14} /> Pipeline Config
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <header className="md:hidden border-b border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hexagon size={24} className="text-blue-500" />
          <h1 className="font-display font-bold text-md">ATOMIC SWARM</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="text-slate-400" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="hidden md:flex h-16 border-b border-slate-800 bg-slate-900/20 items-center justify-between px-8 shrink-0">
          <h2 className="font-display font-semibold text-lg text-slate-100 capitalize">
            {navItems.find(i => i.id === currentView)?.label || currentView}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Activity size={14} className="text-blue-500" />
              <span>Node.js TS Enterprise Status:</span>
              <span className="text-emerald-400 font-bold">HEALTHY</span>
            </div>
            <div className="h-6 w-px bg-slate-700 mt-0.5"></div>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded transition-colors flex gap-2 items-center">
              Export Audit
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-[#020617] to-slate-950">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
