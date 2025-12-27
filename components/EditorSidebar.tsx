
import React, { useState } from 'react';
import { EditorSettings, AspectRatio } from '../types';
import { GRADIENTS } from '../constants';
import { Maximize2, Move, LayoutGrid, Palette, Eye, ZoomIn, Camera, Sparkles, Loader2, Send } from 'lucide-react';

interface EditorSidebarProps {
  settings: EditorSettings;
  onChange: (settings: EditorSettings) => void;
  onAiAction: (prompt: string) => Promise<void>;
  isAiProcessing: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ settings, onChange, onAiAction, isAiProcessing }) => {
  const [aiPrompt, setAiPrompt] = useState('');

  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiProcessing) return;
    await onAiAction(aiPrompt);
    setAiPrompt('');
  };

  return (
    <aside className="w-80 h-full rounded-[2rem] border border-white/10 mica-effect flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-left duration-500">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        
        {/* AI Studio Section */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[1.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative p-5 rounded-[1.5rem] bg-black/40 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold">AI Design Engine</span>
            </div>
            
            <form onSubmit={handleAiSubmit} className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Style this like a luxury Apple commercial..."
                className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none h-24 transition-all"
                disabled={isAiProcessing}
              />
              <button
                type="submit"
                disabled={isAiProcessing || !aiPrompt.trim()}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-xl shadow-indigo-500/20"
              >
                {isAiProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Style with Gemini
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Background Section */}
        <section>
          <div className="flex items-center gap-2 mb-5 text-white/40">
            <Palette size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Canvas Palette</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-5">
            {GRADIENTS.map((g, idx) => (
              <button
                key={idx}
                onClick={() => updateSetting('backgroundValue', g)}
                className={`h-14 rounded-xl transition-all border-2 ${settings.backgroundValue === g ? 'border-indigo-500 scale-95 shadow-lg shadow-indigo-500/20' : 'border-transparent hover:scale-105'}`}
                style={{ background: g }}
              />
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] text-white/40 mb-3 uppercase tracking-tighter">
                <span>Canvas Padding</span>
                <span>{settings.padding}px</span>
              </div>
              <input 
                type="range" min="0" max="200" step="10"
                value={settings.padding}
                onChange={(e) => updateSetting('padding', parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] text-white/40 mb-3 uppercase tracking-tighter">
                <span>Corner Radius</span>
                <span>{settings.borderRadius}px</span>
              </div>
              <input 
                type="range" min="0" max="48" step="4"
                value={settings.borderRadius}
                onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Cinematic Section */}
        <section>
          <div className="flex items-center gap-2 mb-5 text-white/40">
            <ZoomIn size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Cinematic Pan</span>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group border border-white/5"
                  onClick={() => updateSetting('autoZoom', !settings.autoZoom)}>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Smart Auto-Zoom</span>
                <span className="text-[10px] text-white/30">Auto-pans to user focus</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.autoZoom ? 'bg-indigo-600' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${settings.autoZoom ? 'right-1 shadow-lg' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </section>

        {/* Zoom Controls Section - Conditional */}
        {settings.autoZoom && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-5 text-white/40">
              <Maximize2 size={14} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Zoom Depth</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-3 uppercase tracking-tighter">
                  <span>Intensity</span>
                  <span>{settings.zoomAmount}x</span>
                </div>
                <input 
                  type="range" min="1" max="2.5" step="0.1"
                  value={settings.zoomAmount}
                  onChange={(e) => updateSetting('zoomAmount', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </section>
        )}

        {/* Cursor Settings */}
        <section>
          <div className="flex items-center gap-2 mb-5 text-white/40">
            <Eye size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Lumina Cursor</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-medium text-white/60">Size Scale</span>
              <div className="flex gap-2">
                {[1, 1.5, 2].map(scale => (
                  <button
                    key={scale}
                    onClick={() => updateSetting('cursorScale', scale)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center ${settings.cursorScale === scale ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-white/40 mb-3 uppercase tracking-tighter">
                <span>Smoothing Intensity</span>
                <span>{settings.cursorSmoothing}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5"
                value={settings.cursorSmoothing}
                onChange={(e) => updateSetting('cursorSmoothing', parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section>
          <div className="flex items-center gap-2 mb-5 text-white/40">
            <LayoutGrid size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Canvas Format</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {(['16:9', '9:16', '4:3', '1:1'] as AspectRatio[]).map(ratio => (
              <button
                key={ratio}
                onClick={() => updateSetting('aspectRatio', ratio)}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-3 group ${settings.aspectRatio === ratio ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-black/20 hover:border-white/20'}`}
              >
                <div className={`bg-white/10 rounded-lg border border-white/20 transition-all group-hover:bg-white/20 ${ratio === '16:9' ? 'w-10 h-6' : ratio === '9:16' ? 'w-6 h-10' : ratio === '4:3' ? 'w-9 h-7' : 'w-8 h-8'}`} />
                <span className="text-[10px] font-bold opacity-60 tracking-wider">{ratio}</span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </aside>
  );
};

export default EditorSidebar;
