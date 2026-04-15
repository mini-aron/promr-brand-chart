const MARKER_SIZE = { width: 22, height: 30 };
const MARKER_FILL_COLOR = '#5149F5';

export const MARKER_COLORS = {
  primary: '#5149F5',
  secondary: '#6366f1',
  error: '#dc2626',
} as const;

export interface CustomMarkerImage {
  src: string;
  size: { width: number; height: number };
  options?: {
    alt?: string;
    offset?: { x: number; y: number };
    shape?: 'circle' | 'rect' | 'default' | 'poly';
  };
}

function buildMarkerSvg(color?: string): string {
  const fillColor = color ?? MARKER_FILL_COLOR;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">' +
    `<path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="${fillColor}" stroke="#fff" stroke-width="2"/>` +
    '<circle cx="14" cy="14" r="6" fill="#fff"/>' +
    '</svg>'
  );
}

export function createMarkerImageOption(color?: string) {
  return {
    src: 'data:image/svg+xml,' + encodeURIComponent(buildMarkerSvg(color)),
    size: MARKER_SIZE,
    options: { offset: { x: MARKER_SIZE.width / 2, y: MARKER_SIZE.height } },
  };
}
