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
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-16">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Irish Ancestry Surname Matcher</h1>
          <p className="text-slate-400 text-sm">
            Check surviving parish register density and match confidence scores instantly.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Enter an Irish surname (e.g., Murphy, Kelly)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedSurname(null);
              setSubmitted(false);
            }}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Autocomplete dropdown */}
          {filteredSurnames.length > 0 && !selectedSurname && (
            <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
              {filteredSurnames.map((item) => (
                <li
                  key={item.normalized}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center text-sm"
                >
                  <span className="font-semibold text-white">{item.surname}</span>
                  <span className="text-emerald-400 font-medium">{item.confidenceScore}% Match</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Results View */}
        {selectedSurname && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6 shadow-xl">
            
            {/* Top Score Summary */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedSurname.surname}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedSurname.historicalOverview}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-400">{selectedSurname.confidenceScore}%</span>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Confidence Score</p>
              </div>
            </div>

            {/* County Hotspots */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary County Concentrations</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSurname.primaryCounties.map((county: string) => (
                  <span key={county} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-md text-xs font-medium">
                    {county}
                  </span>
                ))}
              </div>
            </div>

            {/* Gated Deep Report Section */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Unlock Full Parish Archive & Valuation Breakdown</h3>
              <p className="text-xs text-slate-400">
                Get the complete primary source checklist, surviving records count ({selectedSurname.totalCivilRecords}), and distribution maps sent directly to your inbox.
              </p>

              {!submitted ? (
                <form onSubmit={handleLeadSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-md transition-colors"
                  >
                    Unlock Report
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-xs rounded-md text-center font-medium">
                  Success! Check your inbox for the complete historical breakdown.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}