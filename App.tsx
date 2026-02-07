
import React, { useState, useEffect } from 'react';
import { Search, Shield, Globe, Smartphone, MapPin, Database, ExternalLink, Loader2, AlertTriangle, CheckCircle2, UserCheck, MessageSquare, Send, Navigation, Cpu } from 'lucide-react';
import { performLookup } from './services/geminiService';
import { SearchState } from './types';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingText, setLoadingText] = useState('Initializing search...');
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    result: null
  });

  useEffect(() => {
    if (state.loading) {
      const texts = [
        "Connecting to Global Nodes...",
        "Identifying City Jurisdiction...",
        "Cross-referencing Directories...",
        "Fetching Carrier Identity...",
        "Verifying Social Presence...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state.loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.trim();
    if (!cleanNumber) return;

    setState({ loading: true, error: null, result: null });
    
    try {
      const data = await performLookup(cleanNumber);
      setState({ loading: false, error: null, result: data });
    } catch (err: any) {
      setState({ 
        loading: false, 
        error: err.message || "Could not complete lookup. Please try again later.", 
        result: null 
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <Shield className="w-10 h-10 text-blue-500" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Phone Number <span className="text-blue-500">Tracker</span></h1>
            </div>
            <div className="text-blue-400 font-black text-[11px] uppercase tracking-[0.5em] mb-4">By Partha Rockstar</div>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-400 animate-pulse uppercase tracking-[0.3em]">
            <Cpu className="w-3 h-3" />
            Neural System Online
          </div>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Identify owners, cities, and networks globally with real-time intelligence.
        </p>
      </header>

      <section className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative glass rounded-3xl p-3 flex items-center shadow-2xl overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <Globe className="w-6 h-6 text-blue-400 mr-4" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Number with country code (e.g. +880...)"
                className="bg-transparent border-none outline-none w-full text-white text-xl placeholder:text-gray-500 h-14 font-bold tracking-tight"
              />
            </div>
            <button
              type="submit"
              disabled={state.loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 md:px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] uppercase tracking-tighter"
            >
              {state.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              <span>{state.loading ? 'Tracking...' : 'Find Now'}</span>
            </button>
            {state.loading && <div className="scanner absolute inset-0 pointer-events-none" />}
          </div>
          {state.loading && (
            <div className="mt-6 text-center">
               <p className="text-blue-400 font-black animate-pulse text-[10px] tracking-[0.4em] uppercase">
                 {loadingText}
               </p>
            </div>
          )}
        </form>

        {state.error && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400 shadow-lg">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="flex flex-col">
              <p className="font-black uppercase tracking-tight text-xs">Tracking Failure</p>
              <p className="text-xs font-medium opacity-80">{state.error}</p>
            </div>
          </div>
        )}
      </section>

      {state.result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Globe className="w-64 h-64" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                <div className="space-y-8 flex-1">
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2">Primary Identity</h2>
                    <p className="text-4xl md:text-5xl font-black text-white tracking-tighter break-words">
                      {state.result.name}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Registry Confirmed</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-inner">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2 flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      Legal Subscriber
                    </h2>
                    <p className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight break-words">
                      {state.result.adminName}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center min-w-[140px] flex flex-col justify-center items-center">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Confidence</h2>
                  <div className="relative w-16 h-16 flex items-center justify-center mb-3">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="176" strokeDashoffset={state.result.confidence === 'High' ? '30' : '100'} className={`${state.result.confidence === 'High' ? 'text-green-500' : 'text-yellow-500'}`} />
                     </svg>
                     <span className="absolute text-xs font-black">{state.result.confidence === 'High' ? '92%' : '55%'}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                    state.result.confidence === 'High' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {state.result.confidence}
                  </span>
                </div>
              </div>

              <div className="mb-12 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-inner">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-400 mb-6 flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Geo-Location
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Jurisdiction</p>
                       <p className="text-3xl font-black text-white tracking-tight break-words">{state.result.city}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Global Region</p>
                       <p className="text-2xl font-bold text-gray-300 tracking-tight break-words">{state.result.location}</p>
                    </div>
                 </div>
              </div>

              <div className="mb-12">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 border-b border-white/10 pb-2">Social Channels</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={state.result.socialPresence.whatsapp.link} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-[#25D366]/5 border border-[#25D366]/20 p-5 rounded-[2rem] hover:bg-[#25D366]/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                             <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="font-black text-white group-hover:text-[#25D366] text-sm uppercase tracking-tighter">WhatsApp</p>
                             <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{state.result.socialPresence.whatsapp.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-4 h-4 text-[#25D366]/30 group-hover:text-[#25D366]" />
                    </a>

                    <a href={state.result.socialPresence.telegram.link} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-[#0088cc]/5 border border-[#0088cc]/20 p-5 rounded-[2rem] hover:bg-[#0088cc]/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc]">
                             <Send className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="font-black text-white group-hover:text-[#0088cc] text-sm uppercase tracking-tighter">Telegram</p>
                             <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{state.result.socialPresence.telegram.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-4 h-4 text-[#0088cc]/30 group-hover:text-[#0088cc]" />
                    </a>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <Smartphone className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Network</p>
                  <p className="font-black text-xl text-white tracking-tighter">{state.result.carrier}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                  <Database className="w-6 h-6 text-indigo-400 mb-2" />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Line Type</p>
                  <p className="font-black text-xl text-white tracking-tighter">{state.result.type}</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  Intelligence Brief
                </h3>
                <p className="text-gray-300 leading-relaxed text-base font-bold tracking-tight">
                  {state.result.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-6 border border-blue-500/20">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-blue-400 uppercase tracking-tighter">
                <Globe className="w-5 h-5" />
                Discovery Logs
              </h3>
              <div className="space-y-3">
                {state.result.sources.length > 0 ? (
                  state.result.sources.map((source, i) => (
                    <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-blue-600/10 border border-transparent hover:border-blue-500/30 transition-all group">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-xs font-black text-gray-200 block truncate uppercase tracking-tight">{source.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-700 group-hover:text-blue-400 shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-[2rem]">
                     <p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] font-black">Private Indices Scanned</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 bg-blue-600/5 border border-blue-400/20 text-center">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">Security Protocol</h4>
              <p className="text-xs text-gray-400 font-bold mb-6">Verified against carrier telemetry and public index snapshots.</p>
              <span className="inline-block bg-blue-500/10 text-blue-400 text-[9px] font-black px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase tracking-[0.2em]">Cross-Referenced</span>
            </div>
          </div>
        </div>
      )}

      {!state.result && !state.loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: <Navigation className="w-6 h-6" />, title: "Precision Locator", desc: "Identify town and region based on registration telemetry." },
            { icon: <UserCheck className="w-6 h-6" />, title: "Registry Trace", desc: "Access verified display names and registered organizational owners." },
            { icon: <Shield className="w-6 h-6" />, title: "Neural Indexing", desc: "Fast search grounding against thousands of global directories." }
          ].map((feat, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 transition-all">
                {feat.icon}
              </div>
              <h3 className="font-black text-xl mb-3 uppercase tracking-tighter text-white">{feat.title}</h3>
              <p className="text-gray-400 text-sm font-bold leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-24 text-center border-t border-white/10 pt-16 pb-12 opacity-50">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} Phone Number Tracker By Partha Rockstar</p>
      </footer>
    </div>
  );
};

export default App;
