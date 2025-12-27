
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
  autoZoom: boolean;
  zoomAmount: number;
  webcamEnabled: boolean;
  webcamPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  webcamSize: number;
}

export type AppState = 'idle' | 'recording' | 'editing' | 'exporting';
