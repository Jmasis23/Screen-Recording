
import React, { useState, useRef, useEffect } from 'react';

interface TimelineProps {
  trimRange: [number, number];
  onTrimChange: (range: [number, number]) => void;
}

const Timeline: React.FC<TimelineProps> = ({ trimRange, onTrimChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(type);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);

      if (isDragging === 'start') {
        onTrimChange([Math.min(pos, trimRange[1] - 5), trimRange[1]]);
      } else {
        onTrimChange([trimRange[0], Math.max(pos, trimRange[0] + 5)]);
      }
    };

    const handleMouseUp = () => setIsDragging(null);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, trimRange, onTrimChange]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4">
          <span className="text-[10px] text-white/40 font-mono">00:{(trimRange[0] * 0.45).toFixed(2).replace('.', ':')}</span>
          <span className="text-[10px] text-white/40 font-mono">/ 00:{(trimRange[1] * 0.45).toFixed(2).replace('.', ':')}</span>
        </div>
        <div className="flex gap-2">
           <div className={`w-2 h-2 rounded-full transition-colors ${isDragging ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`} />
           <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">
            {isDragging ? 'Adjusting Clip...' : 'Trim Active'}
           </span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 relative bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-center group"
      >
        {/* Background Waveform Track */}
        <div className="absolute inset-0 flex items-center px-4 opacity-30">
          <div className="flex-1 h-8 flex gap-0.5 items-center">
            {Array.from({ length: 120 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 rounded-full bg-white/20 h-[20%] group-hover:h-[40%] transition-all duration-700"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
        </div>

        {/* Selected Clip Area */}
        <div 
          className="absolute inset-y-0 bg-indigo-500/10 border-x-2 border-indigo-500 flex items-center justify-between backdrop-blur-[2px]"
          style={{ left: `${trimRange[0]}%`, right: `${100 - trimRange[1]}%` }}
        >
          {/* Handle Start */}
          <div 
            onMouseDown={handleMouseDown('start')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-10 cursor-ew-resize flex items-center justify-center z-20 group/handle"
          >
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full group-hover/handle:scale-y-125 group-hover/handle:bg-white transition-all shadow-lg" />
            <div className="absolute -top-6 bg-indigo-600 text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-opacity">START</div>
          </div>

          {/* Active Visualizer inside Selection */}
          <div className="flex-1 h-12 flex gap-0.5 items-center px-2">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 rounded-full bg-indigo-400/40"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>

          {/* Handle End */}
          <div 
            onMouseDown={handleMouseDown('end')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-10 cursor-ew-resize flex items-center justify-center z-20 group/handle"
          >
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full group-hover/handle:scale-y-125 group-hover/handle:bg-white transition-all shadow-lg" />
            <div className="absolute -top-6 bg-indigo-600 text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-opacity">END</div>
          </div>
        </div>

        {/* Playhead (Static preview) */}
        <div className="absolute top-0 bottom-0 left-[45%] w-px bg-white/50 z-10">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
