
import React, { useState, useEffect, useRef } from 'react';
import { EditorSettings } from '../types';
// Import Play and Sparkles icons from lucide-react
import { Play, Sparkles } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string | null;
  settings: EditorSettings;
  isExporting: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, settings, isExporting }) => {
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [currentPos, setCurrentPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth lerp for the zoom position - driven by smoothing setting
  useEffect(() => {
    let animationFrame: number;
    
    // Map smoothing 0-100 to a lerp factor. 
    // 0 = 0.3 (fast), 100 = 0.015 (very smooth/heavy)
    const smoothingFactor = Math.max(0.015, 0.3 * (1 - settings.cursorSmoothing / 110));

    const lerp = () => {
      setCurrentPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * smoothingFactor,
        y: prev.y + (targetPos.y - prev.y) * smoothingFactor
      }));
      animationFrame = requestAnimationFrame(lerp);
    };
    animationFrame = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetPos, settings.cursorSmoothing]);

  // Handle click to set zoom focus
  const handleVideoClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !settings.autoZoom) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTargetPos({ x, y });
  };

  // Auto-move simulated cursor if no user interaction
  useEffect(() => {
    if (!settings.autoZoom) return;
    const interval = setInterval(() => {
      // Gentle floating animation to simulate real focus
      setTargetPos(prev => ({
        x: Math.min(Math.max(prev.x + (Math.random() - 0.5) * 20, 15), 85),
        y: Math.min(Math.max(prev.y + (Math.random() - 0.5) * 20, 15), 85),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [settings.autoZoom]);

  const videoTransform = settings.autoZoom 
    ? `scale(${settings.zoomAmount}) translate(${50 - currentPos.x}%, ${50 - currentPos.y}%)`
    : 'scale(1) translate(0, 0)';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* Dynamic Background Layer - Covers Full Screen */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{ background: settings.backgroundValue }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Video Container Layer - Floating with Professional Shadow */}
      <div 
        ref={containerRef}
        onClick={handleVideoClick}
        className={`relative transition-all duration-700 ease-out shadow-2xl overflow-hidden cursor-crosshair group z-10`}
        style={{
          width: `calc(100% - ${settings.padding * 2}px)`,
          maxWidth: settings.aspectRatio === '9:16' ? '450px' : 'none',
          maxHeight: 'calc(100% - 200px)',
          borderRadius: `${settings.borderRadius}px`,
          aspectRatio: settings.aspectRatio.replace(':', '/'),
          boxShadow: `0 ${settings.shadowIntensity}px ${settings.shadowIntensity * 3}px -${settings.shadowIntensity/3}px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.05)`
        }}
      >
        <div className="absolute inset-0 bg-[#0c0c0e] overflow-hidden">
          <div 
            className="w-full h-full transition-transform duration-150 ease-out"
            style={{ transform: videoTransform }}
          >
             {videoUrl ? (
                <video 
                  src={videoUrl} 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover opacity-95 transition-opacity duration-1000"
                />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#141417]">
                  <div className="w-full h-full grid grid-cols-12 grid-rows-8 gap-1.5 p-4 opacity-10">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="bg-white/20 rounded-md" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-white/5 bg-white/5 flex items-center justify-center mb-4">
                      <Play size={32} className="text-white/20 ml-1" />
                    </div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">Studio Canvas</span>
                    <span className="text-white/10 text-[9px] mt-2 font-mono">1.0.4-PRO</span>
                  </div>
                </div>
             )}

             {/* Interactive Lumina Cursor */}
             {settings.showCursor && (
               <div 
                className="absolute pointer-events-none transition-all duration-300 ease-out z-20"
                style={{ 
                  left: `${currentPos.x}%`, 
                  top: `${currentPos.y}%`,
                  transform: `translate(-50%, -50%) scale(${settings.cursorScale})`
                }}
               >
                 <div className="relative flex items-center justify-center">
                    {/* Multi-layered glow */}
                    <div className="absolute w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute w-12 h-12 bg-white/10 rounded-full blur-xl" />
                    
                    {/* Sleek Custom Lumina Cursor */}
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#glow)">
                        <path d="M20 4L22.5 16.5L35 19L22.5 21.5L20 34L17.5 21.5L5 19L17.5 16.5L20 4Z" fill="white" />
                        <path d="M20 4L22.5 16.5L35 19L22.5 21.5L20 34L17.5 21.5L5 19L17.5 16.5L20 4Z" stroke="indigo" strokeWidth="0.5" opacity="0.3" />
                        <circle cx="20" cy="19" r="4" fill="indigo" fillOpacity="0.8" />
                        <circle cx="20" cy="19" r="2" fill="white" />
                      </g>
                      <defs>
                        <filter id="glow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="2"/>
                          <feGaussianBlur stdDeviation="4"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.4 0 0 0 0 0.945098 0 0 0 0.5 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1" result="shape"/>
                        </filter>
                      </defs>
                    </svg>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Webcam Overlay - Floating within Video */}
        {settings.webcamEnabled && (
          <div 
            className={`absolute z-30 transition-all duration-700 ease-in-out rounded-3xl overflow-hidden border border-white/20 shadow-2xl ${
              settings.webcamPosition === 'top-left' ? 'top-8 left-8' : 
              settings.webcamPosition === 'top-right' ? 'top-8 right-8' : 
              settings.webcamPosition === 'bottom-left' ? 'bottom-8 left-8' : 
              'bottom-8 right-8'
            }`}
            style={{ width: settings.webcamSize, height: settings.webcamSize }}
          >
             <img 
              src={`https://picsum.photos/seed/${settings.webcamPosition}/300/300`} 
              className="w-full h-full object-cover saturate-[0.8] brightness-125"
              alt="Face Cam"
            />
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[8px] uppercase font-bold tracking-widest text-white/60">LIVE</div>
          </div>
        )}
      </div>

      {/* Rendering Overlay */}
      {isExporting && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center animate-in fade-in duration-700">
           <div className="flex flex-col items-center gap-10 max-w-sm text-center">
              <div className="relative w-24 h-24">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin shadow-lg shadow-indigo-500/20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-indigo-400 animate-pulse" size={24} />
                 </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight">Finishing Touches</h3>
                <p className="text-white/40 text-sm leading-relaxed px-8">Applying 4K upscaling, cinematic motion blur, and professional audio mastering...</p>
              </div>
              <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full animate-[progress_2s_ease-in-out_infinite]" />
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default VideoPreview;
