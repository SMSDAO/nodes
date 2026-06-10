import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Server, Cpu, Database } from 'lucide-react';
import * as motion from 'motion/react-client';

export function CapacityPlanner() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const parseDate = d3.timeParse("%Y-%m-%d");
    
    // Generate data
    const data = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: parseDate(dateStr) as Date,
        cpu: Math.max(10, Math.min(100, 30 + i * 1.5 + Math.random() * 20 - 10)),
        memory: Math.max(20, Math.min(100, 40 + i * 1 + Math.random() * 15 - 7.5))
      };
    });

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ""))
      .attr("color", "#1e293b")
      .attr("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.5);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#64748b")
      .attr("font-family", "monospace")
      .attr("font-size", "10px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#64748b")
      .attr("font-family", "monospace")
      .attr("font-size", "10px");

    // Gradients
    const defs = svg.append("defs");
    
    const gradientCpu = defs.append("linearGradient")
      .attr("id", "cpu-grad")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    gradientCpu.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.4);
    gradientCpu.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

    const gradientMemory = defs.append("linearGradient")
      .attr("id", "mem-grad")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    gradientMemory.append("stop").attr("offset", "0%").attr("stop-color", "#8b5cf6").attr("stop-opacity", 0.4);
    gradientMemory.append("stop").attr("offset", "100%").attr("stop-color", "#8b5cf6").attr("stop-opacity", 0);

    // Area functions
    const areaCpu = d3.area<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y0(innerHeight)
      .y1(d => y(d.cpu));

    const areaMemory = d3.area<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y0(innerHeight)
      .y1(d => y(d.memory));

    // Lines
    const lineCpu = d3.line<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y(d => y(d.cpu));

    const lineMemory = d3.line<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y(d => y(d.memory));

    // Append areas
    g.append("path")
      .datum(data)
      .attr("fill", "url(#mem-grad)")
      .attr("d", areaMemory);

    g.append("path")
      .datum(data)
      .attr("fill", "url(#cpu-grad)")
      .attr("d", areaCpu);

    // Append lines
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 2)
      .attr("d", lineMemory);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", lineCpu);

  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: Math.min(400, wrapperRef.current.clientWidth * 0.5)
        });
      }
    };
    
    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (wrapperRef.current) {
      ro.observe(wrapperRef.current);
    }
    return () => ro.disconnect();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
            <Activity className="text-blue-500" />
            Predictive Capacity Planner
          </h2>
          <p className="text-slate-400 mt-2">D3.js visualization profiling future CPU and memory demand for Kubernetes clusters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel p-6 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-300 font-semibold font-display">
              <Server size={18} className="text-slate-400" /> K8s Resource Forecast (30 Days)
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-sm bg-blue-500"></span> CPU Demand (%)
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-sm bg-purple-500"></span> Memory Demand (%)
              </div>
            </div>
          </div>
          
          <div ref={wrapperRef} className="w-full h-[400px]">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full h-full text-slate-200"
              style={{ overflow: 'visible' }}
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
             <div className="flex items-center gap-3 mb-3 text-slate-300">
               <Cpu className="text-blue-400" size={18} />
               <h3 className="font-semibold text-sm">Peak CPU Target</h3>
             </div>
             <p className="text-3xl font-display font-bold text-white mb-1">82%</p>
             <p className="text-xs text-slate-500">Expected in 14 days</p>
             <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-xs text-blue-400 font-mono">Recommendation: Scale compute pods by +3 ahead of Day 12.</p>
             </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
             <div className="flex items-center gap-3 mb-3 text-slate-300">
               <Database className="text-purple-400" size={18} />
               <h3 className="font-semibold text-sm">Memory Threshold</h3>
             </div>
             <p className="text-3xl font-display font-bold text-white mb-1">94%</p>
             <p className="text-xs text-slate-500">Expected in 28 days</p>
             <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-xs text-purple-400 font-mono">Alert: Sustained OOM risk detected. Pre-provision nodes.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
