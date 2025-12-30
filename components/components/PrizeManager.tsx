import React, { useState } from 'react';
import { Prize } from '../types';

interface PrizeManagerProps {
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
];

const PrizeManager: React.FC<PrizeManagerProps> = ({ prizes, setPrizes }) => {
  const [newPrize, setNewPrize] = useState('');

  const addPrize = () => {
    if (!newPrize.trim()) return;
    const color = COLORS[prizes.length % COLORS.length];
    setPrizes([...prizes, { text: newPrize.trim(), color }]);
    setNewPrize('');
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4">🎁 Manage Prizes</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPrize}
          onChange={(e) => setNewPrize(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPrize()}
          placeholder="Enter prize name..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
        />
        <button
          onClick={addPrize}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {prizes.map((prize, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: prize.color + '33' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: prize.color }}
              />
              <span className="text-white font-medium">{prize.text}</span>
            </div>
            <button
              onClick={() => removePrize(index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {prizes.length === 0 && (
        <p className="text-white/50 text-center py-4">No prizes yet. Add some above!</p>
      )}
    </div>
  );
};

export default PrizeManager;
