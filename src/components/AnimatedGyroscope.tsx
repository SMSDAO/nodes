import React, { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';

export function AnimatedGyroscope({ stabilityScore }: { stabilityScore: number }) {
  // Translate score (0-100) to rotation speed (fast when unstable, slow when stable)
  // 100 = 20s (slow), 0 = 1s (fast chaos)
  const rotationDuration = Math.max(1, 20 - (stabilityScore / 100) * 19);
  
  // Outer rings
  const rings = [
    { size: 140, color: '#3b82f6', border: 'rgba(59,130,246,0.6)', reverse: false, x: 1, y: 0 },
    { size: 110, color: '#10b981', border: 'rgba(16,185,129,0.5)', reverse: true, x: 0, y: 1 },
    { size: 80, color: '#a855f7', border: 'rgba(168,85,247,0.7)', reverse: false, x: 1, y: 1 },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-xl border border-slate-700/50 relative overflow-hidden h-full">
       <div className="absolute top-4 left-4">
          <h3 className="font-display font-semibold text-sm text-slate-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Stabilator Core</h3>
          <p className="text-[10px] uppercase font-mono text-slate-500 tracking-widest mt-1">Gyro-Kinetic State</p>
       </div>
       
       <div className="absolute top-4 right-4 text-right">
          <div className={`font-mono text-xl font-bold ${stabilityScore > 85 ? 'text-emerald-400 glow-text-green' : stabilityScore > 50 ? 'text-blue-400 glow-text-blue' : 'text-red-400 glow-text-red'}`}>
             {stabilityScore.toFixed(1)}%
          </div>
       </div>

       <div className="relative w-48 h-48 flex items-center justify-center mt-6 z-10" style={{ perspective: '800px' }}>
          {rings.map((ring, i) => (
             <motion.div
               key={i}
               style={{
                  width: ring.size,
                  height: ring.size,
                  border: `2px solid ${ring.color}`,
                  boxShadow: `0 0 15px ${ring.border}, inset 0 0 10px ${ring.border}`,
                  position: 'absolute',
               }}
               className="rounded-full flex items-center justify-center"
               animate={{
                 rotateX: ring.x ? [0, 360] : 0,
                 rotateY: ring.y ? [0, ring.reverse ? -360 : 360] : 0,
                 rotateZ: [0, ring.reverse ? -360 : 360]
               }}
               transition={{
                 duration: rotationDuration + i,
                 ease: 'linear',
                 repeat: Infinity
               }}
             >
                <div className="w-2 h-2 rounded-full absolute -top-1" style={{ backgroundColor: ring.color, boxShadow: `0 0 10px ${ring.color}` }}></div>
                <div className="w-2 h-2 rounded-full absolute -bottom-1" style={{ backgroundColor: ring.color, boxShadow: `0 0 10px ${ring.color}` }}></div>
             </motion.div>
          ))}
          
          {/* Core Core */}
          <motion.div 
             className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center z-20"
             animate={{ 
                boxShadow: [`0 0 10px ${stabilityScore > 85 ? '#10b981' : '#3b82f6'}`, `0 0 30px ${stabilityScore > 85 ? '#10b981' : '#3b82f6'}`, `0 0 10px ${stabilityScore > 85 ? '#10b981' : '#3b82f6'}`]
             }}
             transition={{ duration: 2, repeat: Infinity }}
          >
             <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md"></div>
          </motion.div>
       </div>
       
       <div className="mt-8 w-full">
           <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">
              <span>System Entropy</span>
              <span>{Math.max(0, 100 - stabilityScore).toFixed(1)}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                 className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                 style={{ width: `${Math.max(0, 100 - stabilityScore)}%` }}
              ></div>
           </div>
       </div>
    </div>
  );
}
