
import React from 'react';
import { EditorSettings, AspectRatio } from '../types';
import { GRADIENTS } from '../constants';
import { Maximize2, Move, LayoutGrid, Palette, Eye, ZoomIn, Camera } from 'lucide-react';

interface EditorSidebarProps {
  settings: EditorSettings;
  onChange: (settings: EditorSettings) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ settings, onChange }) => {
  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <aside className="w-80 shrink-0 border-r border-white/5 bg-[#09090b] flex flex-col z-40 animate-in slide-in-from-left duration-300">
      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide">
        
        {/* Background Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <Palette size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Canvas Styling</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {GRADIENTS.map((g, idx) => (
              <button
                key={idx}
                onClick={() => updateSetting('backgroundValue', g)}
                className={`h-12 rounded-lg transition-all border-2 ${settings.backgroundValue === g ? 'border-white scale-95' : 'border-transparent hover:scale-105'}`}
                style={{ background: g }}
              />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Padding</span>
                <span>{settings.padding}px</span>
              </div>
              <input 
                type="range" min="0" max="200" step="10"
                value={settings.padding}
                onChange={(e) => updateSetting('padding', parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Border Radius</span>
                <span>{settings.borderRadius}px</span>
              </div>
              <input 
                type="range" min="0" max="48" step="4"
                value={settings.borderRadius}
                onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Cinematic Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <ZoomIn size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Cinematic Effects</span>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => updateSetting('autoZoom', !settings.autoZoom)}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Smart Auto-Zoom</span>
                <span className="text-[10px] text-white/40">Smoothly pan to cursor</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-all ${settings.autoZoom ? 'bg-indigo-600' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.autoZoom ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            {settings.autoZoom && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Zoom Multiplier</span>
                  <span>{settings.zoomAmount}x</span>
                </div>
                <input 
                  type="range" min="1" max="2" step="0.1"
                  value={settings.zoomAmount}
                  onChange={(e) => updateSetting('zoomAmount', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </section>

        {/* Cursor Settings */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <Eye size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Cursor Enhancements</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Cursor Size</span>
              <div className="flex gap-1">
                {[1, 1.5, 2].map(scale => (
                  <button
                    key={scale}
                    onClick={() => updateSetting('cursorScale', scale)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${settings.cursorScale === scale ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <LayoutGrid size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Output Layout</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {(['16:9', '9:16', '4:3', '1:1'] as AspectRatio[]).map(ratio => (
              <button
                key={ratio}
                onClick={() => updateSetting('aspectRatio', ratio)}
                className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-2 group ${settings.aspectRatio === ratio ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
              >
                <div className={`bg-white/20 rounded-sm border border-white/40 transition-all group-hover:bg-white/40 ${ratio === '16:9' ? 'w-8 h-4.5' : ratio === '9:16' ? 'w-4 h-7' : ratio === '4:3' ? 'w-7 h-5.5' : 'w-6 h-6'}`} />
                <span className="text-[10px] font-medium opacity-60">{ratio}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Webcam Section */}
        <section>
           <div className="flex items-center gap-2 mb-4 text-white/40">
            <Camera size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Face Cam</span>
          </div>

           <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer mb-4"
                  onClick={() => updateSetting('webcamEnabled', !settings.webcamEnabled)}>
              <span className="text-sm font-medium">Overlay Webcam</span>
              <div className={`w-10 h-5 rounded-full relative transition-all ${settings.webcamEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.webcamEnabled ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
        </section>

      </div>
    </aside>
  );
};

export default EditorSidebar;
