import React from 'react';

export type WinIconType =
  | 'computer'
  | 'folder'
  | 'folder-open'
  | 'document'
  | 'image'
  | 'pdf'
  | 'notepad'
  | 'paint'
  | 'calculator'
  | 'control-panel'
  | 'ie'
  | 'recycle-bin'
  | 'recycle-bin-full'
  | 'minesweeper'
  | 'solitaire'
  | 'snake'
  | 'drive-c'
  | 'drive-floppy'
  | 'drive-cd'
  | 'help'
  | 'find'
  | 'run'
  | 'shutdown'
  | 'speaker'
  | 'network'
  | 'win-flag';

interface WinIconProps {
  name: WinIconType;
  size?: number;
  className?: string;
}

export const WinIcon: React.FC<WinIconProps> = ({ name, size = 32, className = '' }) => {
  switch (name) {
    case 'computer':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Monitor */}
          <rect x="3" y="2" width="22" height="18" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="5" y="4" width="18" height="14" fill="#008080" />
          <rect x="6" y="5" width="16" height="12" fill="#000" />
          <rect x="7" y="6" width="14" height="10" fill="#3a6ea5" />
          {/* Base */}
          <path d="M11 20 L17 20 L19 24 L9 24 Z" fill="#b0aca4" stroke="#000" strokeWidth="1" />
          {/* Tower PC */}
          <rect x="23" y="10" width="7" height="18" fill="#d4d0c8" stroke="#000" strokeWidth="1" />
          <rect x="24" y="12" width="5" height="2" fill="#808080" />
          <rect x="24" y="15" width="5" height="1" fill="#000" />
          <circle cx="27" cy="22" r="1" fill="#00ff00" />
        </svg>
      );

    case 'folder':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Tab */}
          <path d="M2 7 L12 7 L15 10 L28 10 L28 26 L2 26 Z" fill="#ffd700" stroke="#806000" strokeWidth="1" />
          {/* Front Body */}
          <path d="M2 11 L30 11 L28 27 L2 27 Z" fill="#ffea75" stroke="#806000" strokeWidth="1" />
        </svg>
      );

    case 'folder-open':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <path d="M2 7 L12 7 L15 10 L28 10 L28 25 L2 25 Z" fill="#d4a017" stroke="#806000" strokeWidth="1" />
          <path d="M0 14 L28 14 L32 27 L4 27 Z" fill="#fff080" stroke="#806000" strokeWidth="1" />
        </svg>
      );

    case 'document':
    case 'notepad':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Paper with folded corner */}
          <path d="M6 3 L20 3 L26 9 L26 29 L6 29 Z" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <path d="M20 3 L20 9 L26 9 Z" fill="#dfdfdf" stroke="#000000" strokeWidth="1" />
          {/* Ruled lines */}
          <line x1="9" y1="12" x2="23" y2="12" stroke="#0000aa" strokeWidth="1" />
          <line x1="9" y1="16" x2="23" y2="16" stroke="#0000aa" strokeWidth="1" />
          <line x1="9" y1="20" x2="23" y2="20" stroke="#0000aa" strokeWidth="1" />
          <line x1="9" y1="24" x2="19" y2="24" stroke="#0000aa" strokeWidth="1" />
          {name === 'notepad' && (
            <path d="M22 17 L29 24 L27 26 L20 19 Z" fill="#ffcc00" stroke="#805500" strokeWidth="1" />
          )}
        </svg>
      );

    case 'image':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="4" width="26" height="24" fill="#ffffff" stroke="#808080" strokeWidth="1" />
          <rect x="5" y="6" width="22" height="20" fill="#2080df" />
          {/* Mountains and sun */}
          <circle cx="10" cy="11" r="3" fill="#ffdd00" />
          <polygon points="5,26 14,15 21,26" fill="#228833" />
          <polygon points="15,26 21,18 27,26" fill="#1b6628" />
        </svg>
      );

    case 'pdf':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <path d="M6 3 L20 3 L26 9 L26 29 L6 29 Z" fill="#f4f4f4" stroke="#b00000" strokeWidth="1" />
          <rect x="8" y="14" width="16" height="10" fill="#cc0000" />
          <text x="10" y="22" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="Arial">
            PDF
          </text>
        </svg>
      );

    case 'paint':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Palette */}
          <path
            d="M6 14 C6 7, 18 3, 25 7 C31 11, 30 21, 23 26 C18 29, 13 25, 11 26 C8 27, 6 22, 6 14 Z"
            fill="#d2a679"
            stroke="#5c3818"
            strokeWidth="1"
          />
          {/* Thumb hole */}
          <ellipse cx="14" cy="22" rx="2.5" ry="3" fill="#ffffff" stroke="#5c3818" strokeWidth="1" />
          {/* Paint dollops */}
          <circle cx="11" cy="10" r="2.5" fill="#e81123" />
          <circle cx="17" cy="8" r="2.5" fill="#00a4ef" />
          <circle cx="23" cy="12" r="2.5" fill="#ffb900" />
          <circle cx="23" cy="18" r="2.5" fill="#7fba00" />
          {/* Brush */}
          <path d="M4 27 L18 13 L21 16 L7 30 Z" fill="#804000" />
          <polygon points="4,27 2,31 7,30" fill="#111" />
        </svg>
      );

    case 'calculator':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="5" y="3" width="22" height="26" fill="#c0c0c0" stroke="#000000" strokeWidth="1" />
          {/* LCD Screen */}
          <rect x="8" y="6" width="16" height="6" fill="#88b088" stroke="#405840" strokeWidth="1" />
          <text x="11" y="11" fill="#002b00" fontSize="5" fontFamily="monospace">
            1998.
          </text>
          {/* Buttons */}
          <rect x="8" y="14" width="4" height="3" fill="#fff" stroke="#808080" />
          <rect x="14" y="14" width="4" height="3" fill="#fff" stroke="#808080" />
          <rect x="20" y="14" width="4" height="3" fill="#dfdfdf" stroke="#808080" />

          <rect x="8" y="19" width="4" height="3" fill="#fff" stroke="#808080" />
          <rect x="14" y="19" width="4" height="3" fill="#fff" stroke="#808080" />
          <rect x="20" y="19" width="4" height="3" fill="#dfdfdf" stroke="#808080" />

          <rect x="8" y="24" width="4" height="3" fill="#e81123" stroke="#808080" />
          <rect x="14" y="24" width="4" height="3" fill="#00a4ef" stroke="#808080" />
          <rect x="20" y="24" width="4" height="3" fill="#ffb900" stroke="#808080" />
        </svg>
      );

    case 'control-panel':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="6" width="26" height="21" fill="#c0c0c0" stroke="#000000" strokeWidth="1" />
          {/* Gears / Tools */}
          <circle cx="16" cy="16" r="6" fill="#808080" stroke="#000" strokeWidth="1" />
          <circle cx="16" cy="16" r="2.5" fill="#c0c0c0" />
          {/* Hammer / Screwdriver */}
          <path d="M6 10 L12 16" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 10 L20 16" stroke="#0000aa" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'ie':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Big blue lowercase 'e' */}
          <circle cx="16" cy="16" r="11" fill="#0078d7" />
          <path d="M8 16 Q16 16 24 16 Q24 9 16 9 Q8 9 8 16 Q8 23 16 23 Q22 23 24 19" stroke="#ffffff" strokeWidth="3.5" fill="none" />
          {/* Orbit Swoop */}
          <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#ffb900" strokeWidth="2.5" transform="rotate(-30 16 16)" />
        </svg>
      );

    case 'recycle-bin':
    case 'recycle-bin-full':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <ellipse cx="16" cy="6" rx="9" ry="3" fill="#d0d0d0" stroke="#000" strokeWidth="1" />
          <path d="M8 6 L10 27 L22 27 L24 6 Z" fill="#b0b0b0" stroke="#000" strokeWidth="1" />
          {/* Mesh grid */}
          <line x1="12" y1="7" x2="13" y2="26" stroke="#808080" strokeWidth="1" />
          <line x1="16" y1="7" x2="16" y2="26" stroke="#808080" strokeWidth="1" />
          <line x1="20" y1="7" x2="19" y2="26" stroke="#808080" strokeWidth="1" />
          {/* Green recycle symbol */}
          <circle cx="16" cy="17" r="4" fill="#00aa00" />
        </svg>
      );

    case 'minesweeper':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          {/* Bomb */}
          <circle cx="16" cy="17" r="7" fill="#000000" />
          <circle cx="13" cy="14" r="2" fill="#ffffff" />
          {/* Spikes */}
          <line x1="16" y1="7" x2="16" y2="27" stroke="#000" strokeWidth="2" />
          <line x1="6" y1="17" x2="26" y2="17" stroke="#000" strokeWidth="2" />
          <line x1="9" y1="10" x2="23" y2="24" stroke="#000" strokeWidth="2" />
          <line x1="9" y1="24" x2="23" y2="10" stroke="#000" strokeWidth="2" />
        </svg>
      );

    case 'solitaire':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="4" y="6" width="16" height="22" rx="2" fill="#0055aa" stroke="#000" strokeWidth="1" />
          <rect x="12" y="4" width="16" height="22" rx="2" fill="#ffffff" stroke="#000" strokeWidth="1" />
          {/* Ace of Hearts */}
          <text x="14" y="11" fill="#e81123" fontSize="7" fontWeight="bold">
            A
          </text>
          <path d="M19 14 C19 12 17 12 16 13 C15 12 13 12 13 14 C13 17 16 19 16 19 C16 19 19 17 19 14 Z" fill="#e81123" />
        </svg>
      );

    case 'snake':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Nokia Phone frame */}
          <rect x="6" y="2" width="20" height="28" rx="4" fill="#2d3748" stroke="#000" strokeWidth="1" />
          <rect x="9" y="6" width="14" height="12" fill="#9bbb59" stroke="#50662a" strokeWidth="1" />
          {/* Pixel snake */}
          <rect x="11" y="9" width="2" height="2" fill="#002b00" />
          <rect x="13" y="9" width="2" height="2" fill="#002b00" />
          <rect x="15" y="9" width="2" height="2" fill="#002b00" />
          <rect x="15" y="11" width="2" height="2" fill="#002b00" />
          <rect x="15" y="13" width="2" height="2" fill="#002b00" />
          {/* Food dot */}
          <rect x="19" y="8" width="2" height="2" fill="#002b00" />
          {/* Keypad */}
          <rect x="10" y="20" width="12" height="7" fill="#cbd5e0" rx="1" />
        </svg>
      );

    case 'drive-c':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="10" width="26" height="14" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          <rect x="6" y="13" width="12" height="2" fill="#808080" />
          <circle cx="23" cy="14" r="1.5" fill="#00aa00" />
          <circle cx="26" cy="14" r="1.5" fill="#ff0000" />
        </svg>
      );

    case 'drive-floppy':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <path d="M5 4 L23 4 L27 8 L27 28 L5 28 Z" fill="#0000aa" stroke="#000" strokeWidth="1" />
          {/* Silver slider */}
          <rect x="9" y="4" width="12" height="9" fill="#dfdfdf" stroke="#808080" strokeWidth="1" />
          <rect x="13" y="6" width="3" height="5" fill="#000" />
          {/* Paper label */}
          <rect x="8" y="16" width="16" height="10" fill="#ffffff" stroke="#808080" strokeWidth="1" />
          <line x1="10" y1="19" x2="22" y2="19" stroke="#e81123" strokeWidth="1" />
          <line x1="10" y1="22" x2="20" y2="22" stroke="#0000aa" strokeWidth="1" />
        </svg>
      );

    case 'drive-cd':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="13" fill="#dfdfdf" stroke="#808080" strokeWidth="1" />
          <circle cx="16" cy="16" r="4.5" fill="#ffffff" stroke="#808080" strokeWidth="1" />
          <circle cx="16" cy="16" r="2" fill="#000000" />
          {/* Rainbow sheen */}
          <path d="M7 16 A9 9 0 0 1 16 7" stroke="#00a4ef" strokeWidth="2" opacity="0.6" />
          <path d="M16 25 A9 9 0 0 1 25 16" stroke="#ffb900" strokeWidth="2" opacity="0.6" />
        </svg>
      );

    case 'win-flag':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          {/* Windows 98 Flying Flag */}
          <rect x="4" y="5" width="10" height="9" fill="#e81123" />
          <rect x="16" y="5" width="10" height="9" fill="#00a4ef" />
          <rect x="4" y="16" width="10" height="9" fill="#7fba00" />
          <rect x="16" y="16" width="10" height="9" fill="#ffb900" />
        </svg>
      );

    case 'shutdown':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="11" fill="#e81123" stroke="#800000" strokeWidth="1" />
          <path d="M16 8 L16 16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M11 12 A8 8 0 1 0 21 12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'help':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="12" fill="#0078d7" />
          <text x="16" y="22" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
            ?
          </text>
        </svg>
      );

    case 'find':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="14" cy="14" r="8" stroke="#000" strokeWidth="3" fill="#ffffff" />
          <line x1="20" y1="20" x2="28" y2="28" stroke="#804000" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'run':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="6" width="26" height="20" fill="#dfdfdf" stroke="#000" strokeWidth="1" />
          <path d="M8 16 L22 16 M18 11 L23 16 L18 21" stroke="#0000aa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'speaker':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" className={className} fill="none">
          <polygon points="2,6 5,6 8,3 8,13 5,10 2,10" fill="#000000" />
          <path d="M11,5 Q13,8 11,11" stroke="#000000" strokeWidth="1.5" fill="none" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
          <rect x="6" y="6" width="20" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
          <text x="16" y="20" fontSize="12" fill="#000" textAnchor="middle">
            98
          </text>
        </svg>
      );
  }
};
