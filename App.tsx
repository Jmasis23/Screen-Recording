
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorSettings, AppState } from './types';
import { DEFAULT_SETTINGS } from './constants';
import Toolbar from './components/Toolbar';
import EditorSidebar from './components/EditorSidebar';
import VideoPreview from './components/VideoPreview';
import Timeline from './components/Timeline';
import { Play, Square, Video, Settings, Download, Camera, Mic, Layout, Laptop } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [recordingBlob, setRecordingBlob] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: true
      });
      
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
    setTimeout(() => {
      alert('Your high-quality 4K video is ready for download!');
      setAppState('editing');
    }, 2000);
  };

  const handleAiAction = async (prompt: string) => {
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Update the Lumina Studio video editor settings based on this creative request: "${prompt}". Current settings are: ${JSON.stringify(settings)}. Return only the updated EditorSettings object as JSON.`,
        config: {
          systemInstruction: "You are a world-class video creative director. Your goal is to translate user requests into visual settings. Background values MUST be valid CSS linear/radial gradients or solid colors. Padding is 0-200. BorderRadius is 0-48. shadowIntensity is 0-100. cursorScale is 1.0-2.0. zoomAmount is 1.0-2.0.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              backgroundType: { type: Type.STRING },
              backgroundValue: { type: Type.STRING },
              padding: { type: Type.NUMBER },
              borderRadius: { type: Type.NUMBER },
              shadowIntensity: { type: Type.NUMBER },
              aspectRatio: { type: Type.STRING },
              showCursor: { type: Type.BOOLEAN },
              cursorScale: { type: Type.NUMBER },
              autoZoom: { type: Type.BOOLEAN },
              zoomAmount: { type: Type.NUMBER },
              webcamEnabled: { type: Type.BOOLEAN },
              webcamPosition: { type: Type.STRING },
              webcamSize: { type: Type.NUMBER },
            },
            required: ["backgroundValue", "padding", "borderRadius", "shadowIntensity", "aspectRatio", "cursorScale", "zoomAmount"]
          }
        }
      });

      const updatedSettings = JSON.parse(response.text);
      setSettings(prev => ({ ...prev, ...updatedSettings }));
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 overflow-hidden">
      {/* Header Bar - Fixed at top */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-white/5 mica-effect shrink-0 z-[100] relative">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Lumina Studio</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white/60 font-medium uppercase tracking-widest">Windows Pro</span>
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

      {/* Main Content Area - Full Screen Background */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        
        {/* Full Screen Video Preview Background */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${appState === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
          {(appState === 'editing' || appState === 'exporting' || appState === 'recording') && (
            <VideoPreview 
              videoUrl={recordingBlob} 
              settings={settings}
              isExporting={appState === 'exporting'}
            />
          )}
        </div>

        {/* Idle State Content - Centered Overlay */}
        {appState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center text-center max-w-md">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center mb-8 ring-1 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <Laptop size={48} className="text-indigo-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tight">Immersive Screen Mastering</h1>
              <p className="text-white/40 text-sm mb-10 leading-relaxed">
                Create cinematic product demos with intelligent auto-zoom, professional cursor styling, and instant branding.
              </p>
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={startRecording}
                  className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                >
                  <Video size={20} />
                  Start Capturing
                </button>
                <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Press Alt + R to start instantly</span>
              </div>
            </div>
          </div>
        )}

        {/* Recording State Overlay */}
        {appState === 'recording' && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-8 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-40 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-red-500 ring-4 ring-red-500/20 shadow-2xl shadow-red-500" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight mb-2">Capturing Screen...</p>
                <p className="text-white/40 text-sm uppercase tracking-widest">Alt + S to Finish</p>
              </div>
            </div>
            {/* Allow clicking the stop button through the pointer-events-none container? No, we need a specific button */}
            <button 
              onClick={stopRecording}
              className="mt-12 pointer-events-auto px-10 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold shadow-2xl active:scale-95"
            >
              Stop Recording
            </button>
          </div>
        )}

        {/* Floating Sidebar - Overlay */}
        {appState === 'editing' && isSidebarOpen && (
          <div className="absolute top-4 bottom-4 left-4 z-40">
            <EditorSidebar 
              settings={settings} 
              onChange={setSettings} 
              onAiAction={handleAiAction}
              isAiProcessing={isAiProcessing}
            />
          </div>
        )}

        {/* Floating Toolbar - Bottom Center Overlay */}
        {appState === 'editing' && (
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-40">
            <Toolbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
          </div>
        )}

        {/* Floating Timeline - Bottom Overlay */}
        {appState === 'editing' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-40 px-4">
            <div className="h-28 rounded-3xl border border-white/5 mica-effect p-4 shrink-0 relative overflow-hidden shadow-2xl">
              <Timeline 
                trimRange={settings.trimRange} 
                onTrimChange={(range) => setSettings(s => ({ ...s, trimRange: range }))} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
