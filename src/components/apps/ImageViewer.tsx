import React, { useState } from 'react';
import { VFSItem } from '../../types/filesystem';
import { soundManager } from '../../utils/audio';

interface ImageViewerProps {
  item?: VFSItem;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ item }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const imgSrc = item?.url || item?.content || '/documents/WhatsApp Image 2026-11-01 at 15.20.32.jpeg';

  const handleZoomIn = () => {
    soundManager.playClick();
    setZoom((z) => Math.min(3, z + 0.25));
  };

  const handleZoomOut = () => {
    soundManager.playClick();
    setZoom((z) => Math.max(0.25, z - 0.25));
  };

  const handleRotate = () => {
    soundManager.playClick();
    setRotation((r) => (r + 90) % 360);
  };

  const handleReset = () => {
    soundManager.playClick();
    setZoom(1);
    setRotation(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Page</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="win98-toolbar" style={{ gap: 4 }}>
        <button className="win98-btn" onClick={handleZoomIn} title="Zoom In">
          🔍+ Zoom In
        </button>
        <button className="win98-btn" onClick={handleZoomOut} title="Zoom Out">
          🔍- Zoom Out
        </button>
        <button className="win98-btn" onClick={handleReset} title="Actual Size">
          1:1 Actual Size
        </button>
        <button className="win98-btn" onClick={handleRotate} title="Rotate 90°">
          ↻ Rotate
        </button>
      </div>

      {/* Image Preview Canvas */}
      <div
        className="inset-border"
        style={{
          flex: 1,
          backgroundColor: '#808080',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}
      >
        <img
          src={imgSrc}
          alt={item?.name || 'Image'}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
            backgroundColor: '#ffffff',
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 2 }}>
          {item?.name || 'Image Preview'}
        </div>
        <div className="win98-status-pane" style={{ flex: 1 }}>
          Zoom: {Math.round(zoom * 100)}%
        </div>
        <div className="win98-status-pane" style={{ flex: 1 }}>
          {item?.size ? `${Math.ceil(item.size / 1024)} KB` : ''}
        </div>
      </div>
    </div>
  );
};
