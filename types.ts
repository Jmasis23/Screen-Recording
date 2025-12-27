
export type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1';

export interface EditorSettings {
  backgroundType: 'gradient' | 'solid' | 'image';
  backgroundValue: string;
  padding: number;
  borderRadius: number;
  shadowIntensity: number;
  aspectRatio: AspectRatio;
  showCursor: boolean;
  cursorScale: number;
  cursorSmoothing: number; // New: 0 to 100
  autoZoom: boolean;
  zoomAmount: number;
  webcamEnabled: boolean;
  webcamPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  webcamSize: number;
  trimRange: [number, number]; // [start %, end %]
}

export type AppState = 'idle' | 'recording' | 'editing' | 'exporting';
