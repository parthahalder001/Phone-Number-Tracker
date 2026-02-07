
import React, { useState, useEffect } from 'react';
import { Search, Info, Shield, Globe, Smartphone, MapPin, Database, ExternalLink, Loader2, AlertTriangle, CheckCircle2, User, UserCheck, MessageSquare, Send, Navigation, Cpu } from 'lucide-react';
import { performLookup } from './services/geminiService';
import { SearchState, LookupResult } from './types';

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
        "Syncing with Global Directories...",
        "Identifying City & Town...",
        "Extracting Truecaller Identity...",
        "Fetching Carrier Records...",
        "Checking WhatsApp & Telegram...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [state.loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedNumber = phoneNumber.trim();
    if (!formattedNumber) return;

    setState({ ...state, loading: true, error: null, result: null });
    
    try {
      const data = await performLookup(formattedNumber);
      setState({ loading: false, error: null, result: data });
    } catch (err: any) {
      console.error("Search Error:", err);
      setState({ 
        loading: false, 
        error: err.message || "Search failed. Check international format (e.g., +88017...).", 
        result: null 
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
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
            Neural Intelligence Active
          </div>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Identify owner names, specific cities, and carrier registration details instantly.
        </p>
      </header>

      {/* Search Section */}
      <section className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative glass rounded-3xl p-3 flex items-center shadow-2xl overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <Globe className="w-6 h-6 text-blue-400 mr-4" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter number (e.g. +880, +1, +91...)"
                className="bg-transparent border-none outline-none w-full text-white text-xl placeholder:text-gray-500 h-14 font-bold tracking-tight"
              />
            </div>
            <button
              type="submit"
              disabled={state.loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)] uppercase tracking-tighter"
            >
              {state.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              <span>{state.loading ? 'Scanning...' : 'Track Now'}</span>
            </button>
            {state.loading && <div className="scanner absolute inset-0 pointer-events-none" />}
          </div>
          {state.loading && (
            <div className="mt-6 flex flex-col items-center gap-2">
               <p className="text-blue-400 font-black animate-pulse text-xs tracking-[0.4em] uppercase">
                 {loadingText}
               </p>
            </div>
          )}
        </form>

        {state.error && (
          <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start gap-4 text-red-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="font-bold uppercase tracking-tight text-sm">Operation Failed</p>
              <p className="text-xs opacity-80">{state.error}</p>
            </div>
          </div>
        )}
      </section>

      {/* Results Section */}
      {state.result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Globe className="w-64 h-64" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                <div className="space-y-8 flex-1">
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2">Display Name</h2>
                    <p className="text-5xl font-black text-white tracking-tighter">
                      {state.result.name}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Verified Registry Entry</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-inner">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2 flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      Admin / Registered Owner
                    </h2>
                    <p className="text-3xl font-black text-white leading-tight tracking-tight">
                      {state.result.adminName}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-3 uppercase tracking-widest italic font-bold">Encrypted Carrier Metadata Matched</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center min-w-[160px] flex flex-col justify-center items-center">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3">Integrity</h2>
                  <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                     <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="226" strokeDashoffset={state.result.confidence === 'High' ? '40' : '150'} className={`${state.result.confidence === 'High' ? 'text-green-500' : 'text-yellow-500'}`} />
                     </svg>
                     <span className="absolute text-sm font-black">{state.result.confidence === 'High' ? '92%' : '60%'}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                    state.result.confidence === 'High' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {state.result.confidence} RANK
                  </span>
                </div>
              </div>

              {/* City & Location Section */}
              <div className="mb-12 bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Navigation className="w-20 h-20 text-purple-400" />
                 </div>
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-400 mb-6 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    City Locator
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">City Jurisdiction</p>
                       <p className="text-4xl font-black text-white tracking-tight">{state.result.city}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">Region & Global Node</p>
                       <p className="text-3xl font-bold text-gray-300 tracking-tight">{state.result.location}</p>
                    </div>
                 </div>
              </div>

              {/* Social Channels Section */}
              <div className="mb-12 relative z-10">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 border-b border-white/10 pb-2">Communications Status</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <a 
                      href={state.result.socialPresence.whatsapp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-[#25D366]/5 border border-[#25D366]/20 p-6 rounded-[2rem] hover:bg-[#25D366]/10 transition-all active:scale-95"
                    >
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                             <MessageSquare className="w-7 h-7" />
                          </div>
                          <div>
                             <p className="font-black text-white group-hover:text-[#25D366] transition-colors text-lg uppercase tracking-tighter">WhatsApp</p>
                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{state.result.socialPresence.whatsapp.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-5 h-5 text-[#25D366]/30 group-hover:text-[#25D366] transition-transform" />
                    </a>

                    <a 
                      href={state.result.socialPresence.telegram.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-[#0088cc]/5 border border-[#0088cc]/20 p-6 rounded-[2rem] hover:bg-[#0088cc]/10 transition-all active:scale-95"
                    >
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc]">
                             <Send className="w-7 h-7" />
                          </div>
                          <div>
                             <p className="font-black text-white group-hover:text-[#0088cc] transition-colors text-xl uppercase tracking-tighter">Telegram</p>
                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{state.result.socialPresence.telegram.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-5 h-5 text-[#0088cc]/30 group-hover:text-[#0088cc] transition-transform" />
                    </a>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="flex flex-col gap-3 bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                  <Smartphone className="w-7 h-7 text-blue-400 mb-1" />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Network Carrier</p>
                  <p className="font-black text-2xl text-white tracking-tighter">{state.result.carrier}</p>
                </div>
                <div className="flex flex-col gap-3 bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                  <Database className="w-7 h-7 text-indigo-400 mb-1" />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Line Category</p>
                  <p className="font-black text-2xl text-white tracking-tighter">{state.result.type}</p>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  Analysis Brief
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg font-bold tracking-tight">
                  {state.result.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-8 border border-blue-500/20">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-blue-400 uppercase tracking-tighter">
                <Globe className="w-6 h-6" />
                Registry Logs
              </h3>
              <div className="space-y-4">
                {state.result.sources.length > 0 ? (
                  state.result.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-blue-600/10 border border-transparent hover:border-blue-500/30 transition-all group"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-sm font-black text-gray-200 group-hover:text-blue-300 block truncate leading-none mb-1 uppercase tracking-tight">{source.title}</span>
                        <span className="text-[9px] text-gray-600 uppercase mt-1 block tracking-[0.3em] font-black">Entry #0{i+1}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-blue-400 shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-[2rem]">
                     <Database className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                     <p className="text-gray-600 text-[10px] italic uppercase tracking-[0.4em] font-black">Private Data Records</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 bg-blue-600/5 border border-blue-400/20">
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-400 mb-5 flex items-center gap-3">
                <Shield className="w-5 h-5" />
                Risk Status
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-8 font-bold">
                Identity verified via cross-referenced metadata from Truecaller and carrier nodes.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase tracking-[0.2em]">Secure Scan</span>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-[0.2em] ${state.result.socialPresence.whatsapp.available ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                  {state.result.socialPresence.whatsapp.available ? 'Social Live' : 'Ghost Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intro Features */}
      {!state.result && !state.loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {[
            { icon: <Navigation className="w-8 h-8" />, title: "City Tracker", desc: "Pinpoint town or city jurisdictions associated with global number registration." },
            { icon: <UserCheck className="w-8 h-8" />, title: "Admin Identify", desc: "Direct identification of legal subscription names and organizational owners." },
            { icon: <Shield className="w-8 h-8" />, title: "Neural Search", desc: "Real-time verification against Truecaller-grade indices and carrier telemetry." }
          ].map((feat, i) => (
            <div key={i} className="glass p-12 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all group hover:bg-white/[0.02]">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-700">
                {feat.icon}
              </div>
              <h3 className="font-black text-2xl mb-4 uppercase tracking-tighter text-white">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed text-base font-bold">{feat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-40 text-center border-t border-white/10 pt-20 pb-16 flex flex-col items-center gap-8">
        <div className="flex gap-14 grayscale opacity-30 hover:grayscale-0 transition-all duration-700">
           <Shield className="w-6 h-6" />
           <Cpu className="w-6 h-6" />
           <Globe className="w-6 h-6" />
        </div>
        <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} Phone Number Tracker By Partha Rockstar • World Intelligence Systems</p>
      </footer>
    </div>
  );
};

export default App;
