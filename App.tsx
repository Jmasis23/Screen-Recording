
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorSettings, AppState } from './types';
import { DEFAULT_SETTINGS } from './constants';
import Toolbar from './components/Toolbar';
import EditorSidebar from './components/EditorSidebar';
import VideoPreview from './components/VideoPreview';
import Timeline from './components/Timeline';
import { Play, Square, Video, Settings, Download, Camera, Mic, Layout, Laptop } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [recordingBlob, setRecordingBlob] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: true
      });
      
      let combinedStream = screenStream;
      
      if (settings.webcamEnabled) {
        const camStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        // Simplification for demo: logic to merge streams would normally happen in a canvas or WebAudio
        // For this demo, we'll just track the stream state
      }

      streamRef.current = screenStream;
      const recorder = new MediaRecorder(screenStream, { mimeType: 'video/webm;codecs=vp9' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingBlob(url);
        setAppState('editing');
        streamRef.current?.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setAppState('recording');
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleExport = () => {
    setAppState('exporting');
    // Simulate export
    setTimeout(() => {
      alert('Your high-quality 4K video is ready for download!');
      setAppState('editing');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white selection:bg-indigo-500/30">
      {/* Header Bar */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-white/5 mica-effect shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Lumina Studio</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/60 font-medium">BETA</span>
        </div>

        <div className="flex items-center gap-4">
          {appState === 'editing' && (
            <button 
              onClick={handleExport}
              disabled={appState === 'exporting'}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              <Download size={14} />
              {appState === 'exporting' ? 'Generating...' : 'Export 4K Video'}
            </button>
          )}
          {appState === 'idle' && (
            <button 
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Video size={14} />
              New Recording
            </button>
          )}
          <Settings size={18} className="text-white/40 hover:text-white transition-colors cursor-pointer" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Controls */}
        {appState === 'editing' && isSidebarOpen && (
          <EditorSidebar 
            settings={settings} 
            onChange={setSettings} 
          />
        )}

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col bg-[#020202] relative items-center justify-center overflow-hidden">
          {appState === 'idle' && (
            <div className="flex flex-col items-center text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                <Laptop size={40} className="text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Beautiful Screen Recordings</h1>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                Record high-impact product demos and tutorials. Lumina Studio automatically pans to your cursor, smooths movements, and adds professional branding.
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={startRecording}
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-xl active:scale-95"
                >
                  Start Capturing (Alt + R)
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8 text-white/20">
                <Mic size={20} />
                <Camera size={20} />
                <Layout size={20} />
              </div>
            </div>
          )}

          {appState === 'recording' && (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
              <div className="text-center">
                <p className="text-xl font-medium">Recording Your Screen</p>
                <p className="text-white/40 text-sm">Alt + S to Stop</p>
              </div>
              <button 
                onClick={stopRecording}
                className="mt-4 px-8 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all font-semibold"
              >
                Stop Recording
              </button>
            </div>
          )}

          {(appState === 'editing' || appState === 'exporting') && (
            <div className="w-full h-full flex flex-col p-8 lg:p-12 transition-all">
              <VideoPreview 
                videoUrl={recordingBlob} 
                settings={settings}
                isExporting={appState === 'exporting'}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Toolbar */}
      {appState === 'editing' && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40">
          <Toolbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        </div>
      )}

      {/* Footer Timeline */}
      {appState === 'editing' && (
        <div className="h-28 border-t border-white/5 mica-effect p-2 px-6 shrink-0 relative overflow-hidden">
          <Timeline />
        </div>
      )}
    </div>
  );
};

export default App;
