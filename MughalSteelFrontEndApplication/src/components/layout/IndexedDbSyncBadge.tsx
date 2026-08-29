import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Database, RefreshCw, CheckCircle2, Cloud, CloudOff, Download, HardDrive } from 'lucide-react';

export const IndexedDbSyncBadge: React.FC = () => {
  const { dbStats, isOnline, isSyncing, refreshFromApi, exportDatabase } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    try {
      const json = await exportDatabase();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mughal_steel_indexeddb_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Backup failed:', e);
    }
  };

  const totalRecords = dbStats 
    ? (dbStats.products + dbStats.reviews + dbStats.blogs + dbStats.testimonials)
    : 0;

  return (
    <div className="relative inline-block text-xs font-mono">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="IndexedDB Local Cache & Live Backend Sync"
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 ${
          isOnline 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60' 
            : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
        }`}
      >
        <Database className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
        <span className="font-semibold tracking-wide">IndexedDB</span>
        <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] text-stone-300">
          {totalRecords} recs
        </span>
        {isSyncing ? (
          <RefreshCw className="w-3 h-3 animate-spin text-brand-gold" />
        ) : isOnline ? (
          <Cloud className="w-3 h-3 text-emerald-400" />
        ) : (
          <CloudOff className="w-3 h-3 text-amber-400" />
        )}
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-brand-charcoal/95 border border-brand-gold/30 rounded-xl shadow-2xl backdrop-blur-xl p-4 text-stone-200 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20 mb-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-brand-gold" />
              <h4 className="font-serif font-bold text-sm text-stone-100">IndexedDB Storage</h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-100 text-xs px-1"
            >
              ✕
            </button>
          </div>

          {/* Backend Status */}
          <div className="bg-brand-dark/80 rounded-lg p-2.5 mb-3 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">API Endpoint:</span>
              <span className="text-brand-gold truncate max-w-[150px] font-semibold">https://localhost:7102</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Database Name:</span>
              <span className="text-emerald-400 font-semibold">{dbStats?.dbName || 'MughalSteelDB'} (v{dbStats?.version || 1})</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Connection:</span>
              <span className={`flex items-center space-x-1 font-semibold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOnline ? <CheckCircle2 className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
                <span>{isOnline ? 'Active & Live' : 'Offline (Local Only)'}</span>
              </span>
            </div>
          </div>

          {/* Records Breakdown */}
          <div className="mb-3">
            <div className="text-[11px] text-stone-400 font-sans font-semibold uppercase tracking-wider mb-1.5">
              Cached Local Records
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex justify-between bg-black/30 px-2 py-1 rounded">
                <span className="text-stone-400">Products:</span>
                <span className="font-bold text-brand-gold">{dbStats?.products ?? 0}</span>
              </div>


              <div className="flex justify-between bg-black/30 px-2 py-1 rounded">
                <span className="text-stone-400">Blogs:</span>
                <span className="font-bold text-brand-gold">{dbStats?.blogs ?? 0}</span>
              </div>
              <div className="flex justify-between bg-black/30 px-2 py-1 rounded">
                <span className="text-stone-400">Reviews:</span>
                <span className="font-bold text-brand-gold">{dbStats?.reviews ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => refreshFromApi()}
              disabled={isSyncing}
              className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-brand-gold text-brand-dark rounded font-semibold text-xs hover:bg-amber-400 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-semibold text-xs border border-stone-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-brand-gold" />
              <span>{copied ? 'Exported!' : 'Export DB'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
