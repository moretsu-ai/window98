import React from 'react';
import { VFSItem } from '../../types/filesystem';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';

interface DocumentViewerProps {
  item?: VFSItem;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ item }) => {
  const isPdf = item?.name.toLowerCase().endsWith('.pdf');
  const isHtml = item?.name.toLowerCase().endsWith('.html') || item?.name.toLowerCase().endsWith('.htm');
  const fileUrl = item?.url || '';

  const handleDownload = () => {
    soundManager.playClick();
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = item?.name || 'document';
      a.click();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Document</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="win98-toolbar" style={{ gap: 4 }}>
        <button className="win98-btn" onClick={handleDownload} title="Save a copy">
          💾 Save Copy
        </button>
        <button
          className="win98-btn"
          onClick={() => {
            soundManager.playClick();
            if (fileUrl) window.open(fileUrl, '_blank');
          }}
          title="Open in external tab"
        >
          ↗ Open in Tab
        </button>
      </div>

      {/* Content Frame */}
      <div
        className="inset-border"
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          margin: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {fileUrl ? (
          <iframe
            src={fileUrl}
            title={item?.name || 'Document'}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        ) : (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <WinIcon name="document" size={48} />
            <div style={{ marginTop: 10, fontSize: 13, fontWeight: 'bold' }}>{item?.name}</div>
            <div style={{ marginTop: 6, color: '#666' }}>No content available for preview.</div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 3 }}>
          {item?.name} — {isPdf ? 'Portable Document Format (PDF)' : isHtml ? 'HTML Hypertext Document' : 'Document'}
        </div>
        <div className="win98-status-pane" style={{ flex: 1 }}>
          {item?.size ? `${(item.size / 1024 > 1024 ? (item.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.ceil(item.size / 1024) + ' KB')}` : ''}
        </div>
      </div>
    </div>
  );
};
