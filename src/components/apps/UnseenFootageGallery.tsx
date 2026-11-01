import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

interface FootageItem {
  id: string;
  title: string;
  caption: string;
  url: string;
  dateTag: string;
  classification: string;
}

const footageList: FootageItem[] = [
  {
    id: '1',
    title: 'Surveillance Photo #01 — The Strategy Conference',
    caption: 'Declassified 1998: Key leaders meeting to review the 240-mile walking route and test sandals.',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.35 (1).jpeg',
    dateTag: 'March 11, 1930 / Restored 1998',
    classification: 'TOP SECRET // DECLASSIFIED',
  },
  {
    id: '2',
    title: 'Surveillance Photo #02 — The 1998 Salt Monitor',
    caption: 'Viceroy’s secret command terminal monitoring the speed of the marchers on high-tech CRT.',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.33 (1).jpeg',
    dateTag: 'Restored 1998 Archive',
    classification: 'EYES ONLY',
  },
  {
    id: '3',
    title: 'Surveillance Photo #03 — The Wireless Telegraph',
    caption: 'Alleged retro handheld mobile device used by volunteers to message "Water stop in 2 miles!"',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.34 (1).jpeg',
    dateTag: 'Classified Tech Exhibit',
    classification: 'RESTRICTED',
  },
  {
    id: '4',
    title: 'Surveillance Photo #04 — The March Supporters Gathering',
    caption: 'Villagers gathering along the highway in Navsari chanting slogans and distributing lemons.',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.34.jpeg',
    dateTag: 'April 4, 1930',
    classification: 'HISTORICAL PARODY',
  },
  {
    id: '5',
    title: 'Surveillance Photo #05 — The Salt Disk Archive',
    caption: 'Magnetic 1.44MB storage containing the complete text of the Indian Declaration of Independence.',
    url: '/documents/WhatsApp Image 2026-11-01 at 15.20.33.jpeg',
    dateTag: 'October 1998 Preservation',
    classification: 'DECLASSIFIED',
  },
];

export const UnseenFootageGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSepia, setIsSepia] = useState(true);
  const [stamped, setStamped] = useState(true);

  const current = footageList[currentIndex];

  const handlePrev = () => {
    soundManager.playClick();
    setCurrentIndex((i) => (i > 0 ? i - 1 : footageList.length - 1));
  };

  const handleNext = () => {
    soundManager.playClick();
    setCurrentIndex((i) => (i < footageList.length - 1 ? i + 1 : 0));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontSize: 12 }}>
      {/* Notice header */}
      <div style={{ backgroundColor: '#202020', color: '#ffcc00', padding: '4px 8px', fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
        <span><strong>[FICTIONAL ARCHIVE]</strong> PROJECT DANDI — 07_UNSEEN_FOOTAGE GALLERY</span>
        <span>{currentIndex + 1} of {footageList.length}</span>
      </div>

      {/* Main Image Display Area */}
      <div
        className="inset-border"
        style={{
          flex: 1,
          backgroundColor: '#111111',
          margin: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 8,
          overflow: 'hidden',
        }}
      >
        <img
          src={current.url}
          alt={current.title}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100% - 20px)',
            objectFit: 'contain',
            filter: isSepia ? 'sepia(0.7) contrast(1.1) brightness(0.95)' : 'none',
            border: '2px solid #555',
            transition: 'filter 0.3s ease',
          }}
        />

        {/* Vintage red stamp */}
        {stamped && (
          <div
            style={{
              position: 'absolute',
              top: 18,
              right: 24,
              border: '3px solid rgba(220, 20, 20, 0.85)',
              color: 'rgba(220, 20, 20, 0.85)',
              padding: '4px 12px',
              fontWeight: 'bold',
              fontSize: 13,
              letterSpacing: 2,
              transform: 'rotate(-12deg)',
              pointerEvents: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {current.classification}
          </div>
        )}
      </div>

      {/* Caption & Metadata Box */}
      <div
        style={{
          backgroundColor: '#e8e4d8',
          border: '1px solid #808080',
          margin: '0 4px 4px 4px',
          padding: 8,
          color: '#2a2418',
          fontFamily: '"Courier New", monospace',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#800000', marginBottom: 2 }}>
          {current.title}
        </div>
        <div style={{ fontSize: 11, marginBottom: 4 }}>
          {current.caption}
        </div>
        <div style={{ fontSize: 10, color: '#666' }}>
          Date: {current.dateTag} | Status: Verified Fictional Parody
        </div>
      </div>

      {/* Controls toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderTop: '1px solid #fff' }}>
        <button className="win98-btn" onClick={handlePrev}>
          ◀ Previous
        </button>
        <button className="win98-btn" onClick={handleNext}>
          Next ▶
        </button>

        <div style={{ width: 2, height: 16, borderLeft: '1px solid #808080' }} />

        <button
          className={`win98-btn ${isSepia ? 'active' : ''}`}
          onClick={() => setIsSepia(!isSepia)}
        >
          {isSepia ? '✓ Sepia Filter' : 'Normal Colors'}
        </button>
        <button
          className={`win98-btn ${stamped ? 'active' : ''}`}
          onClick={() => setStamped(!stamped)}
        >
          {stamped ? 'Hide Stamp' : 'Show Stamp'}
        </button>
      </div>
    </div>
  );
};

