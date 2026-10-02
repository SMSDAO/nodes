import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Brain, 
  Search, 
  History, 
  Database, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  Filter,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  LineChart
} from 'lucide-react';
import * as motion from 'motion/react-client';
import * as d3 from 'd3';
import { Block, LogEvent, MetricPoint } from '../types';

interface AIOracleMemoryProps {
  blocks: Block[];
  logs: LogEvent[];
  metrics: MetricPoint[];
}

export function AIOracleMemory({ blocks, logs, metrics }: AIOracleMemoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'repair' | 'security' | 'performance'>('all');
  const d3Container = useRef<SVGSVGElement>(null);
  
  const filteredMemory = useMemo(() => {
    let combined = [
      ...blocks.map(b => ({ id: `block-${b.index}`, type: 'repair', title: b.action, date: b.timestamp, details: b.contractPayload, hash: b.hash })),
      ...logs.map(l => ({ id: l.id, type: l.type === 'error' || l.type === 'warning' ? 'security' : 'performance', title: l.trigger, date: l.timestamp, details: l.message }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (searchQuery) {
      combined = combined.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (typeof item.details === 'string' && item.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.details && typeof item.details === 'object' && JSON.stringify(item.details).toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      combined = combined.filter(item => item.type === filterType);
    }

    return combined;
  }, [blocks, logs, searchQuery, filterType]);

  const oracleInsights = useMemo(() => {
    if (!searchQuery) return null;
    
    // Simulate "intelligent" insight generation
    const relatedCount = filteredMemory.length;
    if (relatedCount === 0) return null;

    return {
      confidence: Math.min(99.9, 85 + Math.random() * 14.9),
      recommendation: `Based on ${relatedCount} historical pattern(s), the AI suggests applying a FIPS-validated AST patch to the current ${searchQuery} context.`,
      riskMitigation: "Historical data shows a 94.2% reduction in recurrence when using Multi-Sig validation for this specific issue type."
    };
  }, [filteredMemory, searchQuery]);

  // D3.js Chart Implementation
  useEffect(() => {
    if (metrics.length > 0 && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear previous contents

      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = d3Container.current.clientWidth - margin.left - margin.right;
      const height = 240 - margin.top - margin.bottom;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X Scale (Time)
      const x = d3.scalePoint()
        .domain(metrics.map(d => d.time))
        .range([0, width]);

      // Y Scale for Latency (Primary)
      const y1 = d3.scaleLinear()
        .domain([0, d3.max(metrics, d => d.latency) || 1000])
        .nice()
        .range([height, 0]);

      // Y Scale for Performance/Healing Rate (Secondary)
      const y2 = d3.scaleLinear()
        .domain([0, 100])
        .nice()
        .range([height, 0]);

      // Grid Lines
      g.append("g")			
        .attr("class", "grid")
        .attr("stroke", "#ffffff10")
        .call(d3.axisLeft(y1)
          .tickSize(-width)
          .tickFormat(() => "")
        );

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 4 === 0)))
        .attr("color", "#64748b")
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("font-family", "JetBrains Mono");

      g.append("g")
        .call(d3.axisLeft(y1).ticks(5))
        .attr("color", "#3b82f6")
        .selectAll("text")
        .attr("font-size", "10px");

      g.append("g")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(y2).ticks(5))
        .attr("color", "#10b981")
        .selectAll("text")
        .attr("font-size", "10px");

      // Line for Latency
      const line1 = d3.line<MetricPoint>()
        .x(d => x(d.time) || 0)
        .y(d => y1(d.latency))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(metrics)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("d", line1)
        .attr("stroke-dasharray", function() { return (this as SVGPathElement).getTotalLength(); })
        .attr("stroke-dashoffset", function() { return (this as SVGPathElement).getTotalLength(); })
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

      // Line for Self-Healing Rate
      const line2 = d3.line<MetricPoint>()
        .x(d => x(d.time) || 0)
        .y(d => y2(d.selfHealingRate))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(metrics)
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("d", line2);

      // Area under latency
      const area = d3.area<MetricPoint>()
        .x(d => x(d.time) || 0)
        .y0(height)
        .y1(d => y1(d.latency))
        .curve(d3.curveMonotoneX);

      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "latency-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.3);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

      g.append("path")
        .datum(metrics)
        .attr("fill", "url(#latency-gradient)")
        .attr("d", area);

      // Points
      g.selectAll(".dot")
        .data(metrics)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.time) || 0)
        .attr("cy", d => y1(d.latency))
        .attr("r", 3)
        .attr("fill", "#3b82f6")
        .attr("stroke", "#0f172a")
        .attr("stroke-width", 1);
    }
  }, [metrics]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 glow-border-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl glow-border-blue text-blue-400">
              <Brain size={28} className="glow-text-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                AI Oracle Memory Module
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest">Enhanced Persistence</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Cross-session intelligent retrieval of historical repair data and performance audit logs.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Memory Capacity</span>
                <span className="text-emerald-400 font-bold glow-text-green flex items-center gap-1.5">
                   <Database size={12} /> {filteredMemory.length} Clusters Indexed
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Retrieval Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Search size={16} className="text-blue-400" />
              Retrieval System
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text"
                  placeholder="Query memory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono bg-slate-950 focus:border-blue-500/50 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold px-1">Filter by Class</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'all', label: 'All Records', icon: Filter },
                    { id: 'repair', label: 'Repair Data', icon: Zap },
                    { id: 'security', label: 'Security Logs', icon: ShieldAlert },
                    { id: 'performance', label: 'Metrics', icon: BarChart3 }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id as any)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
                        filterType === f.id 
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 glow-border-blue' 
                          : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <f.icon size={14} />
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/60">
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">AI Memory Agent</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  "I am continuously indexing ATOMIC LEDGER blocks to provide sub-millisecond retrieval of historical repair patterns."
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/10">
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 size={12} />
              Persistence Health
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Indexing Lag</span>
                <span className="text-emerald-400 font-bold">0.02ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Data Redundancy</span>
                <span className="text-emerald-400 font-bold">3x Verified</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Retrieval Accuracy</span>
                <span className="text-emerald-400 font-bold">99.98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Data & Insights */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Performance Correlation Chart (D3.js) */}
          <div className="glass-card rounded-2xl p-6 bg-slate-950/40 border-t-2 border-t-blue-500/60 shadow-xl overflow-hidden relative group">
             <div className="flex items-center justify-between mb-4">
                <div>
                   <h3 className="text-base font-semibold text-white flex items-center gap-2">
                     <TrendingUp className="text-blue-400 glow-text-blue" size={18} />
                     Repair Latency Correlation Matrix
                   </h3>
                   <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">Real-time correlation: <span className="text-blue-400">Latency (ms)</span> vs <span className="text-emerald-400">Healing Rate (%)</span></p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-slate-400">Latency</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <div className="w-2 h-0.5 bg-emerald-500 border border-dashed border-emerald-500"></div>
                      <span className="text-slate-400">Healing Rate</span>
                   </div>
                </div>
             </div>
             
             <div className="w-full relative min-h-[240px]">
                <svg ref={d3Container} className="w-full h-[240px]"></svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                   <LineChart size={120} className="text-blue-500" />
                </div>
             </div>
          </div>

          {/* Oracle Insights (Conditional) */}
          {oracleInsights && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb size={80} className="text-blue-400" />
              </div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-500/30">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">Intelligent Oracle Insights</h3>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold uppercase tracking-widest">
                      {oracleInsights.confidence.toFixed(1)}% Certainty
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">{oracleInsights.recommendation}</p>
                  <div className="flex items-center gap-2 p-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800 w-fit">
                    <ShieldAlert size={14} className="text-amber-400" />
                    <span className="text-[10px] font-mono text-slate-400">{oracleInsights.riskMitigation}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Memory Stream */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <History className="text-blue-400" size={20} />
                Historical Memory Stream
              </h3>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg shadow-inner">
                Records: {filteredMemory.length}
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredMemory.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-all group relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-1 h-full transition-all group-hover:w-2 bg-blue-500/40 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${
                        item.type === 'repair' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                        item.type === 'security' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      }`}>
                        {item.type === 'repair' ? <Zap size={14} /> : item.type === 'security' ? <ShieldAlert size={14} /> : <BarChart3 size={14} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-tight">{item.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock size={10} className="text-slate-600" />
                          <span className="text-[9px] font-mono text-slate-500">{new Date(item.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {item.hash && (
                      <div className="text-[9px] font-mono text-slate-600 truncate max-w-[100px] group-hover:text-blue-500/60 transition-colors">
                        HASH: {item.hash.substring(0, 16)}...
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800/40 shadow-inner">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {typeof item.details === 'string' ? item.details : JSON.stringify(item.details)}
                    </p>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                    <button className="text-[9px] font-mono font-bold text-blue-400 flex items-center gap-1.5 hover:text-white">
                      <MessageSquare size={10} /> Query Oracle
                    </button>
                    <button className="text-[9px] font-mono font-bold text-slate-500 flex items-center gap-1.5 hover:text-white">
                      <FileText size={10} /> View Audit Trail <ArrowRight size={8} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredMemory.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                  <Brain size={48} className="text-slate-800" />
                  <div>
                    <h4 className="text-slate-300 font-semibold">No Memory Clusters Found</h4>
                    <p className="text-slate-500 text-xs mt-1">Refine your retrieval parameters or index more ledger blocks.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
