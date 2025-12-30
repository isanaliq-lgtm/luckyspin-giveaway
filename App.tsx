
import React, { useState, useCallback } from 'react';
import SpinWheel from './components/SpinWheel';
import PrizeManager from './components/PrizeManager';
import { Prize, SpinResult } from './types';
import { DEFAULT_PRIZES } from './constants';
import { Trophy, History, Trash2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Prize | null>(null);

  const handleSpinResult = useCallback((prize: Prize) => {
    setCurrentWinner(prize);
    setHistory(prev => [{ prize, timestamp: Date.now() }, ...prev]);
    setShowWinnerModal(true);
    
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.1 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.1 } });
    }, 250);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Hapus semua riwayat pemenang?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Gift className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase">
            Lucky<span className="text-indigo-400">Spin</span> AI
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <span className="text-xs font-bold px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
             Ready to Spin!
           </span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
        {/* Left Side: Prize Management */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <PrizeManager prizes={prizes} setPrizes={setPrizes} />
        </div>

        {/* Center: The Wheel */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center py-4 order-1 lg:order-2">
          <div className="bg-slate-900/40 p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <SpinWheel 
              prizes={prizes} 
              onResult={handleSpinResult} 
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>
          
          <div className="mt-8 text-center space-y-3">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Klik roda untuk memutar!</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Tentukan keberuntungan Anda hari ini dengan putaran keberuntungan.</p>
          </div>
        </div>

        {/* Right Side: History */}
        <div className="lg:col-span-3 order-3">
          <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700 flex flex-col gap-4 h-full shadow-2xl min-h-[300px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="text-indigo-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Riwayat</h2>
              </div>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 opacity-50 py-10">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                    <Trophy size={20} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold">Belum ada pemenang</p>
                </div>
              ) : (
                history.map((result, i) => (
                  <div 
                    key={result.timestamp} 
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between animate-in slide-in-from-right duration-300"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-8 rounded-full shadow-sm" 
                        style={{ backgroundColor: result.prize.color }} 
                      />
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">{result.prize.text}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{new Date(result.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-indigo-500/30 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/20 max-w-sm w-full text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            
            <div className="mb-6 relative inline-block">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto border-4 border-indigo-500/50">
                <Trophy size={48} className="text-yellow-400" />
              </div>
            </div>

            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-black mb-2">Selamat! Anda Menang!</h2>
            <div className="text-3xl font-black text-white mb-8 break-words uppercase italic leading-tight">
              {currentWinner?.text}
            </div>

            <button 
              onClick={() => setShowWinnerModal(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 transform hover:-translate-y-1"
            >
              AMBIL HADIAH!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2024 LuckySpin AI Undian. Dibuat untuk keseruan!</p>
        <div className="flex gap-6">
          <span className="text-indigo-500">GRATIS & OPEN SOURCE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
