
import React, { useState, useEffect, useRef } from 'react';
import { EditorSettings } from '../types';

interface VideoPreviewProps {
  videoUrl: string | null;
  settings: EditorSettings;
  isExporting: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, settings, isExporting }) => {
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fake cursor motion to simulate auto-zoom behavior
  useEffect(() => {
    if (!settings.autoZoom) return;
    
    const interval = setInterval(() => {
      setCursorPos(prev => ({
        x: Math.min(Math.max(prev.x + (Math.random() - 0.5) * 10, 20), 80),
        y: Math.min(Math.max(prev.y + (Math.random() - 0.5) * 10, 20), 80),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [settings.autoZoom]);

  const getAspectPadding = () => {
    switch(settings.aspectRatio) {
      case '16:9': return 'pb-[56.25%]';
      case '9:16': return 'pb-[177.78%]';
      case '4:3': return 'pb-[75%]';
      case '1:1': return 'pb-[100%]';
      default: return 'pb-[56.25%]';
    }
  };

  const videoTransform = settings.autoZoom 
    ? `scale(${settings.zoomAmount}) translate(${50 - cursorPos.x}%, ${50 - cursorPos.y}%)`
    : 'scale(1) translate(0, 0)';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 transition-all duration-500 ease-in-out rounded-2xl overflow-hidden"
        style={{ background: settings.backgroundValue }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Video Container Layer */}
      <div 
        ref={containerRef}
        className={`relative transition-all duration-500 ease-out shadow-2xl overflow-hidden`}
        style={{
          width: `calc(100% - ${settings.padding * 2}px)`,
          maxWidth: settings.aspectRatio === '9:16' ? '400px' : 'none',
          maxHeight: 'calc(100% - 100px)',
          borderRadius: `${settings.borderRadius}px`,
          aspectRatio: settings.aspectRatio.replace(':', '/'),
          boxShadow: `0 ${settings.shadowIntensity}px ${settings.shadowIntensity * 2}px -${settings.shadowIntensity/2}px rgba(0,0,0,0.6)`
        }}
      >
        {/* Actual Video Content */}
        <div className="absolute inset-0 bg-[#18181b] overflow-hidden">
          <div 
            className="w-full h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: videoTransform }}
          >
             {videoUrl ? (
                <video 
                  src={videoUrl} 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover opacity-90"
                />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-full h-full bg-[#1e1e2e] grid grid-cols-12 grid-rows-8 gap-1 p-2 opacity-20">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="bg-white/10 rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white/20 text-xs font-mono">WORKSPACE PREVIEW</span>
                  </div>
                </div>
             )}

             {/* Simulated Cursor */}
             {settings.showCursor && (
               <div 
                className="absolute pointer-events-none transition-all duration-300 ease-out z-20"
                style={{ 
                  left: `${cursorPos.x}%`, 
                  top: `${cursorPos.y}%`,
                  transform: `scale(${settings.cursorScale})`
                }}
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                    <path d="M5.65376 12.3822L2.103 2.13705C1.86237 1.44421 2.55579 0.75079 3.24864 0.991418L13.4938 4.54218C14.1204 4.7593 14.1819 5.61788 13.5941 5.91799L9.46271 8.02497C9.3083 8.10372 9.18241 8.22961 9.10366 8.38402L6.99668 12.5154C6.69657 13.1032 5.83798 13.0417 5.65376 12.3822Z" fill="white"/>
                 </svg>
                 <div className="absolute -inset-2 bg-indigo-500/20 blur-lg rounded-full animate-pulse" />
               </div>
             )}
          </div>
        </div>

        {/* Webcam Overlay */}
        {settings.webcamEnabled && (
          <div 
            className={`absolute z-30 transition-all duration-500 ease-in-out rounded-full overflow-hidden border-2 border-white/20 shadow-xl ${
              settings.webcamPosition === 'top-left' ? 'top-6 left-6' : 
              settings.webcamPosition === 'top-right' ? 'top-6 right-6' : 
              settings.webcamPosition === 'bottom-left' ? 'bottom-6 left-6' : 
              'bottom-6 right-6'
            }`}
            style={{ width: settings.webcamSize, height: settings.webcamSize }}
          >
             <img 
              src={`https://picsum.photos/seed/${settings.webcamPosition}/200/200`} 
              className="w-full h-full object-cover grayscale brightness-110"
              alt="Webcam placeholder"
            />
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
          </div>
        )}
      </div>

      {/* Progress / Status Overlay */}
      {isExporting && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-500">
           <div className="flex flex-col items-center gap-6 max-w-sm text-center">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                 <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rendering 4K Video</h3>
                <p className="text-white/60 text-sm">Applying motion smoothing, color grading and cursor highlighting...</p>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-indigo-500 transition-all duration-[30s]" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
