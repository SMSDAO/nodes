import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Lock, Mail, Key, Loader2, ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';

export function SupabaseAuth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const isDemo = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder-url.supabase.co';

  useEffect(() => {
    if (isDemo) return;
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        onAuthSuccess();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onAuthSuccess();
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo, onAuthSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isDemo) {
      setTimeout(() => {
        onAuthSuccess();
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Sometimes signup requires email confirmation, handled automatically if enabled in Supabase
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
           initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           transition={{ duration: 0.5, ease: 'easeOut' }}
           className="w-full max-w-md"
        >
           <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-purple-600/20 border-2 border-purple-500/50 rounded-2xl flex items-center justify-center mb-6 glow-border-purple shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                 <Lock className="text-purple-400 glow-text-purple" size={32} />
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">ATOMIC SWARM</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Platform Authentication</p>
           </div>

           <div className="glass-card rounded-2xl p-8 border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
               {isDemo && (
                   <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-lg mb-6 text-xs text-center glow-text-orange shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]">
                      <span className="font-bold uppercase block mb-1">Demo Mode Active</span>
                      Supabase keys missing. Click login to bypass for preview purposes.
                   </div>
               )}

               <form onSubmit={handleAuth} className="space-y-5">
                   {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center">
                         {error}
                      </div>
                   )}
                   
                   <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Email</label>
                       <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input 
                             type="email" 
                             required
                             value={email}
                             onChange={e => setEmail(e.target.value)}
                             className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all duration-300 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                             placeholder="operator@atomic.net"
                          />
                       </div>
                   </div>

                   <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Access Key</label>
                       <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input 
                             type="password" 
                             required
                             value={password}
                             onChange={e => setPassword(e.target.value)}
                             className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all duration-300 focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                             placeholder="••••••••••••"
                          />
                       </div>
                   </div>

                   <button 
                       type="submit"
                       disabled={loading}
                       className="w-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-300 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 glow-border-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] mt-6"
                   >
                       {loading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'signin' ? 'Initiate Session' : 'Provision Identity')}
                       {!loading && <ArrowRight size={18} />}
                   </button>
               </form>

               <div className="mt-6 text-center">
                  <button 
                     onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                     className="text-slate-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                  >
                     {mode === 'signin' ? 'Create new identity' : 'Authenticate existing'}
                  </button>
               </div>
           </div>
        </motion.div>
    </div>
  );
}
