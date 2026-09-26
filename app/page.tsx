'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import surnamesData from '../data/surnames.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurname, setSelectedSurname] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredSurnames = searchTerm.trim() === '' 
    ? [] 
    : surnamesData.filter(item => 
        item.surname.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSelect = (item: any) => {
    setSelectedSurname(item);
    setSearchTerm(item.surname);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedSurname) {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          { email: email, surname: selectedSurname.surname }
        ]);

      if (error) {
        console.error('Error saving lead:', error.message);
      } else {
        setSubmitted(true);
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Ambient background glow matching an emerald Irish landscape aesthetic */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Irish Heritage Registry
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Trace Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Irish Ancestry</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Discover surviving parish register density, historical clan territories, and match confidence scores instantly.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Enter an Irish surname (e.g., Murphy, O'Connor)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedSurname(null);
                setSubmitted(false);
              }}
              className="w-full px-5 py-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-2xl text-base"
            />
          </div>

          {/* Autocomplete dropdown */}
          {filteredSurnames.length > 0 && !selectedSurname && (
            <ul className="absolute z-20 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800/60">
              {filteredSurnames.map((item) => (
                <li
                  key={item.normalized}
                  onClick={() => handleSelect(item)}
                  className="px-5 py-3.5 hover:bg-emerald-950/30 cursor-pointer flex justify-between items-center transition-colors group"
                >
                  <span className="font-semibold text-slate-200 group-hover:text-emerald-300">{item.surname}</span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-medium">{item.confidenceScore}% Match</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Results View */}
        {selectedSurname && (
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-emerald-900/40 rounded-2xl p-7 space-y-6 shadow-2xl shadow-emerald-950/20 animate-in fade-in duration-300">
            
            {/* Top Score Summary */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Clan Record Verified</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">{selectedSurname.surname}</h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-2">{selectedSurname.historicalOverview}</p>
              </div>
              <div className="text-right bg-slate-950/60 border border-slate-800/80 px-4 py-3 rounded-xl">
                <span className="text-3xl font-black text-amber-400">{selectedSurname.confidenceScore}%</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">Confidence</p>
              </div>
            </div>

            {/* County Hotspots */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Primary County Concentrations
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSurname.primaryCounties.map((county: string) => (
                  <span key={county} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-lg text-xs font-medium tracking-wide">
                    {county}
                  </span>
                ))}
              </div>
            </div>

            {/* Gated Deep Report Section */}
            <div className="bg-gradient-to-br from-slate-950/80 to-emerald-950/30 border border-emerald-900/50 rounded-xl p-6 space-y-4 shadow-inner">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Unlock Full Parish Archive & Valuation Dossier
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access primary source checklists, surviving records count ({selectedSurname.totalCivilRecords} records), and territorial distribution maps delivered straight to your inbox.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Unlock Report
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-xl text-center font-medium animate-in fade-in">
                  ✨ Dossier dispatched! Check your inbox for your complete historical breakdown.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}