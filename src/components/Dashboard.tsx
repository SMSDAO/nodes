import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Shield, Activity, Zap, Cpu } from 'lucide-react';
import { MetricPoint, LogEvent, Block } from '../types';
import { AnimatedGyroscope } from './AnimatedGyroscope';

export function Dashboard({ metrics, logs, currentBlock }: { metrics: MetricPoint[], logs: LogEvent[], currentBlock: Block }) {
  const currentMetrics = metrics[metrics.length - 1];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ML Confidence" value={`${currentMetrics.confidence.toFixed(2)}%`} icon={<Cpu className="text-blue-400" />} change="+1.2%" trend="up" />
        <StatCard title="Self-Healing Rate" value={`${currentMetrics.selfHealingRate.toFixed(1)}%`} icon={<Activity className="text-emerald-400" />} change="+17%" trend="up" />
        <StatCard title="Risk Threshold" value={`${currentMetrics.riskScore.toFixed(1)}`} icon={<Shield className="text-purple-400" />} change="-4.2" trend="down" />
        <StatCard title="Latest Block" value={`#${currentBlock.index}`} icon={<Zap className="text-amber-400" />} sub={currentBlock.hash.substring(0, 8)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2 h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2 glow-text-blue">
              <Activity size={18} className="text-blue-400" />
              Dynamic Test Shifting & Confidence
            </h3>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-blue-400 glow-text-blue"><div className="w-2 h-2 rounded-full bg-blue-400 glow-border-blue"></div> Confidence</span>
              <span className="flex items-center gap-1 text-emerald-400 glow-text-green"><div className="w-2 h-2 rounded-full bg-emerald-400 glow-border-green"></div> Coverage</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="confidence" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConf)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} />
                <Area type="monotone" dataKey="testCoverage" stroke="#10b981" fillOpacity={1} fill="url(#colorCov)" strokeWidth={2} style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gyroscope */}
        <div className="lg:col-span-1 h-[380px]">
           <AnimatedGyroscope stabilityScore={currentMetrics.selfHealingRate} />
        </div>

        {/* Live Terminal / Logs */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[380px] lg:col-span-3">
          <div className="border-b border-slate-700/50 p-4 bg-slate-900/40 flex justify-between items-center backdrop-blur-md">
            <h3 className="font-display font-semibold flex items-center gap-2 glow-text-orange">
              <Zap size={16} className="text-amber-400" />
              Live Swarm Feed
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm shadow-inner bg-slate-950/30">
            {logs.map(log => (
              <div key={log.id} className="flex flex-col gap-1 border-l-2 pl-3 py-1 group hover:bg-slate-800/30 transition-colors rounded-r-md" style={{
                borderLeftColor: log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : log.type === 'error' ? '#ef4444' : '#3b82f6',
                boxShadow: `inset 2px 0 10px -5px ${log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : log.type === 'error' ? '#ef4444' : '#3b82f6'}`
              }}>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="opacity-75">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-purple-400 font-semibold glow-text-purple">{log.trigger}</span>
                </div>
                <div className="text-slate-200">{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, trend, sub }: any) {
  return (
    <div className="glass-card p-5 rounded-xl group hover:border-slate-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1 tracking-wide">{title}</p>
          <h4 className="text-2xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{value}</h4>
          {sub && <p className="text-xs font-mono text-slate-500 mt-1 uppercase glow-text-blue tracking-widest">{sub}</p>}
        </div>
        <div className="p-2 bg-slate-800/40 rounded-lg border border-slate-700/50 group-hover:border-slate-500/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {React.cloneElement(icon as React.ReactElement, { className: `${(icon as any).props.className} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]` })}
        </div>
      </div>
      {change && (
        <div className={`mt-3 text-xs font-medium flex items-center gap-1 ${trend === 'up' ? 'text-emerald-400 glow-text-green' : trend === 'down' ? 'text-emerald-400 glow-text-green' : 'text-slate-400'}`}>
          <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{change}</span> 
          <span className="text-slate-500 font-normal">vs last hour</span>
        </div>
      )}
    </div>
  );
}
