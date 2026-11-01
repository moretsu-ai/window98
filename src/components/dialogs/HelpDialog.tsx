import React from 'react';
import { WinIcon } from '../common/WinIcon';

export const HelpDialog: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', padding: 4 }}>
      <div className="win98-menubar">
        <span className="win98-menu-item">Contents</span>
        <span className="win98-menu-item">Index</span>
        <span className="win98-menu-item">Search</span>
      </div>

      <div className="inset-border" style={{ flex: 1, backgroundColor: '#ffffff', padding: 12, overflowY: 'auto', fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '2px solid #000080', paddingBottom: 6, marginBottom: 10 }}>
          <WinIcon name="help" size={24} />
          <h2 style={{ fontSize: 16, color: '#000080', margin: 0 }}>The Abandoned Computer — Windows 98 Help</h2>
        </div>

        <p>
          Welcome to <strong>The Abandoned Computer</strong>, an authentic nostalgic recreation of a 1998 PC discovered after decades in an attic.
        </p>

        <h3 style={{ fontSize: 13, color: '#000080', marginTop: 12 }}>System Features</h3>
        <ul style={{ paddingLeft: 20 }}>
          <li><strong>Virtual Filesystem:</strong> Explore documents, photos from 1998, and notes across C:\.</li>
          <li><strong>Bundled Documents:</strong> View original HTML exports and PDF records in My Documents.</li>
          <li><strong>Internet Explorer:</strong> Visit retro 1998 websites (MSN, Google Beta, McDonald's, Netflix, and zxc.com).</li>
          <li><strong>Classic Applications:</strong> Notepad, Paint, Calculator, and Control Panel.</li>
          <li><strong>Retro Games:</strong> Minesweeper, Solitaire, and Nokia Snake 98.</li>
        </ul>

        <h3 style={{ fontSize: 13, color: '#000080', marginTop: 12 }}>Hidden Secrets & Easter Eggs</h3>
        <ul style={{ paddingLeft: 20 }}>
          <li><strong>Easter Egg 01:</strong> Try clicking the Control Panel icon on the desktop three times.</li>
          <li><strong>Easter Egg 02:</strong> Visit <em>zxc.com</em> in Internet Explorer and try the free download...</li>
          <li><strong>Easter Egg 03:</strong> Press <code>Ctrl + Shift + Alt + U</code> anywhere on the desktop!</li>
          <li><strong>Project Dandi Archive:</strong> Explore <code>C:\My Documents\Classified\PROJECT_DANDI_CLASSIFIED</code> for the 1930 Salt March declassified parody archive.</li>
          <li><strong>Calculator Discovery:</strong> Try entering <code>1998 =</code> in the Calculator.</li>
        </ul>
      </div>
    </div>
  );
};
