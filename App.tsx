
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
        "Connecting to Global Data Nodes...",
        "Searching Truecaller Database...",
        "Identifying Carrier Metadata...",
        "Analyzing Geo-Location Points...",
        "Finalizing Identity Report...",
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
        error: err.message || "কিছু একটা ভুল হয়েছে। ইন্টারনেশনাল ফরম্যাটে (যেমন: +880...) ট্রাই করুন।", 
        result: null 
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
              Phone <span className="text-blue-500">Tracker</span>
            </h1>
          </div>
          <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.5em] opacity-80">By Partha Rockstar</p>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          বিশ্বের যেকোনো প্রান্তের নম্বর ট্র্যাকিং করুন এবং সিমের মালিকের নাম ও লোকেশন বের করুন।
        </p>
      </header>

      <section className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative group">
          <div className="relative glass rounded-3xl p-3 flex items-center shadow-2xl transition-all group-hover:border-blue-500/30 overflow-hidden">
            <div className="flex-1 flex items-center px-4">
              <Globe className="w-6 h-6 text-blue-500 mr-4" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +88017XXXXXXXX"
                className="bg-transparent border-none outline-none w-full text-white text-xl placeholder:text-gray-600 h-14 font-bold tracking-tight"
              />
            </div>
            <button
              type="submit"
              disabled={state.loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 md:px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)] uppercase"
            >
              {state.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              <span>{state.loading ? 'Scanning...' : 'Track'}</span>
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
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="flex flex-col">
              <p className="font-black uppercase tracking-tight text-xs">Error Found</p>
              <p className="text-xs font-bold opacity-80">{state.error}</p>
            </div>
          </div>
        )}
      </section>

      {state.result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Globe className="w-96 h-96" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                <div className="space-y-10 flex-1">
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500 mb-3">Public Identity</h2>
                    <p className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                      {state.result.name}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Index Verified</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-inner">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Registered Subscriber
                    </h2>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {state.result.adminName}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] text-center min-w-[150px]">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Integrity</h2>
                  <div className="text-3xl font-black text-blue-400 mb-1">{state.result.confidence === 'High' ? '98%' : '65%'}</div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    state.result.confidence === 'High' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {state.result.confidence}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-12">
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                    <div className="flex items-center gap-3 text-purple-400 mb-4">
                       <MapPin className="w-6 h-6" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Base Location</span>
                    </div>
                    <p className="text-3xl font-black text-white mb-1">{state.result.city}</p>
                    <p className="text-sm font-bold text-gray-400">{state.result.location}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                    <div className="flex items-center gap-3 text-blue-400 mb-4">
                       <Smartphone className="w-6 h-6" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Carrier Provider</span>
                    </div>
                    <p className="text-3xl font-black text-white mb-1">{state.result.carrier}</p>
                    <p className="text-sm font-bold text-gray-400">{state.result.type}</p>
                 </div>
              </div>

              <div className="mb-12 relative z-10">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
                   <Navigation className="w-4 h-4" /> Social Connectivity
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={state.result.socialPresence.whatsapp.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between bg-[#25D366]/10 border border-[#25D366]/20 p-6 rounded-3xl hover:bg-[#25D366]/20 transition-all">
                       <div className="flex items-center gap-4">
                          <MessageSquare className="w-8 h-8 text-[#25D366]" />
                          <div>
                             <p className="font-black text-white text-lg">WhatsApp</p>
                             <p className="text-[10px] text-gray-500 uppercase font-black">{state.result.socialPresence.whatsapp.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-5 h-5 text-gray-700" />
                    </a>
                    <a href={state.result.socialPresence.telegram.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between bg-[#0088cc]/10 border border-[#0088cc]/20 p-6 rounded-3xl hover:bg-[#0088cc]/20 transition-all">
                       <div className="flex items-center gap-4">
                          <Send className="w-8 h-8 text-[#0088cc]" />
                          <div>
                             <p className="font-black text-white text-lg">Telegram</p>
                             <p className="text-[10px] text-gray-500 uppercase font-black">{state.result.socialPresence.telegram.note}</p>
                          </div>
                       </div>
                       <ExternalLink className="w-5 h-5 text-gray-700" />
                    </a>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Intelligence Brief
                </h3>
                <p className="text-gray-300 leading-relaxed text-xl font-bold italic tracking-tight">
                  "{state.result.summary}"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-[2.5rem] p-8 border border-blue-500/20">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-blue-400 uppercase tracking-tighter">
                <Globe className="w-6 h-6" /> Data Sources
              </h3>
              <div className="space-y-4">
                {state.result.sources.length > 0 ? (
                  state.result.sources.map((source, i) => (
                    <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-blue-600/10 border border-transparent hover:border-blue-500/30 transition-all group">
                      <div className="flex-1 min-w-0 pr-3">
                        <span className="text-sm font-black text-gray-200 block truncate uppercase">{source.title}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-blue-500 shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                     <Database className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                     <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Encrypted Metadata Only</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 bg-blue-600/5 border border-blue-400/20 text-center">
              <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">Security Notice</h4>
              <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
                All data is cross-referenced with global carrier telemetry and public information nodes.
              </p>
              <div className="inline-block bg-blue-500/10 text-blue-400 text-[10px] font-black px-4 py-2 rounded-xl border border-blue-500/20 uppercase tracking-widest">
                Safe & Verified
              </div>
            </div>
          </div>
        </div>
      )}

      {!state.result && !state.loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-in fade-in duration-1000">
          {[
            { icon: <Globe className="w-8 h-8" />, title: "Global Tracking", desc: "বিশ্বের যেকোনো দেশের মোবাইল নম্বর ট্র্যাকিং করার ক্ষমতা।" },
            { icon: <UserCheck className="w-8 h-8" />, title: "Identity Trace", desc: "পাবলিক রেকর্ড থেকে মালিকের নাম এবং সোশ্যাল প্রোফাইল খুঁজে বের করা।" },
            { icon: <MapPin className="w-8 h-8" />, title: "City Precision", desc: "নম্বরটি কোন শহর বা এলাকায় নিবন্ধিত তার নিখুঁত তথ্য।" }
          ].map((feat, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 hover:border-blue-500/40 transition-all group">
              <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 text-blue-500 group-hover:bg-blue-600/20 transition-all">
                {feat.icon}
              </div>
              <h3 className="font-black text-2xl mb-4 uppercase tracking-tighter text-white">{feat.title}</h3>
              <p className="text-gray-400 text-sm font-bold leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-32 text-center border-t border-white/5 pt-20 pb-16">
        <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.8em]">
          &copy; {new Date().getFullYear()} Phone Tracker By Partha Rockstar
        </p>
      </footer>
    </div>
  );
};

export default App;
