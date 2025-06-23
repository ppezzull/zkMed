'use client';

import { useState, useEffect } from 'react';

interface LiveStatsProps {
  initialTvl?: number;
  initialAPY?: number;
  initialClaims?: number;
}

export default function LiveStats({ 
  initialTvl = 12.7, 
  initialAPY = 4.2, 
  initialClaims = 15847 
}: LiveStatsProps) {
  const [currentAPY, setCurrentAPY] = useState(initialAPY);
  const [tvl, setTvl] = useState(initialTvl);
  const [claims, setClaims] = useState(initialClaims);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setTvl(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      setClaims(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-100 rounded-full px-4 py-2 flex items-center space-x-4 text-sm">
      <span className="text-slate-600">
        TVL: <span className="font-semibold text-slate-900">${tvl}M</span>
      </span>
      <span className="h-4 w-px bg-slate-300"></span>
      <span className="text-slate-600">
        APY: <span className="font-semibold text-emerald-600">{currentAPY}%</span>
      </span>
      <span className="h-4 w-px bg-slate-300"></span>
      <span className="text-slate-600">
        Claims: <span className="font-semibold text-indigo-600">{claims.toLocaleString()}</span>
      </span>
    </div>
  );
}
