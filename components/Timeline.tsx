
import React from 'react';

const Timeline: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4">
          <span className="text-[10px] text-white/40 font-mono">00:12:04</span>
          <span className="text-[10px] text-white/40 font-mono">/ 00:45:00</span>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500" />
           <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Smart Trim Active</span>
        </div>
      </div>
      
      <div className="flex-1 relative bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-center">
        {/* Seek Track */}
        <div className="absolute inset-0 flex items-center px-4">
          <div className="w-full h-[1px] bg-white/10" />
        </div>

        {/* Fake Waveform / Clips */}
        <div className="flex-1 h-12 mx-4 relative flex gap-0.5 items-center">
          {Array.from({ length: 80 }).map((_, i) => {
            const height = Math.random() * 80 + 20;
            const isSilent = Math.random() > 0.9;
            return (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all ${isSilent ? 'bg-white/5 h-2' : 'bg-white/20'}`}
                style={{ height: isSilent ? '4px' : `${height}%` }}
              />
            );
          })}

          {/* Active Clip Highlighting */}
          <div className="absolute inset-y-0 left-[20%] right-[30%] bg-indigo-500/10 border-x-2 border-indigo-500 flex items-center justify-between">
             <div className="w-1 h-4 bg-indigo-500 rounded-full ml-1" />
             <div className="w-1 h-4 bg-indigo-500 rounded-full mr-1" />
          </div>

          {/* Playhead */}
          <div className="absolute top-0 bottom-0 left-[45%] w-0.5 bg-white z-10 shadow-[0_0_10px_white]">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
