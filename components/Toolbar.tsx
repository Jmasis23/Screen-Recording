
import React from 'react';
import { MousePointer2, Scissors, Zap, Settings2, PanelLeftClose, PanelLeftOpen, Play, SkipBack, SkipForward } from 'lucide-react';

interface ToolbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className="flex items-center gap-1 p-1.5 rounded-2xl mica-effect shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onToggleSidebar}
        className={`p-2.5 rounded-xl transition-all ${isSidebarOpen ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        title="Toggle Settings Panel"
      >
        {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
      
      <div className="w-[1px] h-6 bg-white/10 mx-1" />

      <div className="flex items-center gap-1">
        <button className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all" title="Selection Tool">
          <MousePointer2 size={20} />
        </button>
        <button className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all" title="Split Clip">
          <Scissors size={20} />
        </button>
        <button className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all" title="Auto Speed">
          <Zap size={20} />
        </button>
      </div>

      <div className="w-[1px] h-6 bg-white/10 mx-1" />

      <div className="flex items-center gap-1 px-2">
        <button className="p-2 rounded-lg text-white/40 hover:text-white transition-all"><SkipBack size={18} /></button>
        <button className="p-2.5 rounded-full bg-white text-black hover:scale-105 transition-all shadow-lg active:scale-95"><Play size={20} fill="black" /></button>
        <button className="p-2 rounded-lg text-white/40 hover:text-white transition-all"><SkipForward size={18} /></button>
      </div>
    </div>
  );
};

export default Toolbar;
