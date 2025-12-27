
import { EditorSettings } from './types';

export const DEFAULT_SETTINGS: EditorSettings = {
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  padding: 60,
  borderRadius: 16,
  shadowIntensity: 40,
  aspectRatio: '16:9',
  showCursor: true,
  cursorScale: 1.5,
  autoZoom: true,
  zoomAmount: 1.2,
  webcamEnabled: false,
  webcamPosition: 'bottom-left',
  webcamSize: 180,
};

export const GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
  'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
  'radial-gradient(circle at center, #312e81 0%, #000000 100%)',
];
