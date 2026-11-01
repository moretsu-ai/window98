import React, { useState, useRef, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { WinIcon } from '../common/WinIcon';
import { AppId } from '../../types/window';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager();
  const { getItem } = useFileSystem();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (!(e.target as HTMLElement).closest('.win98-start-btn')) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLaunch = (appId: AppId, title?: string, params?: any) => {
    openWindow(appId, title, params);
    onClose();
  };

  return (
    <div className="win98-startmenu" ref={menuRef}>
      {/* Blue Windows 98 Banner */}
      <div className="win98-startmenu-banner">
        <div className="win98-startmenu-banner-text">Windows 98</div>
      </div>

      {/* Main Menu List */}
      <div className="win98-startmenu-items">
        {/* Programs */}
        <div
          className={`win98-startmenu-row ${activeSubmenu === 'programs' ? 'open' : ''}`}
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <WinIcon name="folder" size={20} />
          <span>Programs</span>
          <span className="win98-startmenu-arrow">▶</span>

          {activeSubmenu === 'programs' && (
            <div className="win98-submenu" style={{ top: 0 }}>
              {/* Accessories */}
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('notepad')}
              >
                <WinIcon name="notepad" size={18} />
                <span>Notepad</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('paint')}
              >
                <WinIcon name="paint" size={18} />
                <span>Paint</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('calculator')}
              >
                <WinIcon name="calculator" size={18} />
                <span>Calculator</span>
              </div>
              <div className="win98-dropdown-divider" />
              {/* Games */}
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('minesweeper')}
              >
                <WinIcon name="minesweeper" size={18} />
                <span>Minesweeper</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('solitaire')}
              >
                <WinIcon name="solitaire" size={18} />
                <span>Solitaire</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('snake')}
              >
                <WinIcon name="snake" size={18} />
                <span>Nokia Snake 98</span>
              </div>
              <div className="win98-dropdown-divider" />
              {/* IE & Explorer */}
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('internet-explorer')}
              >
                <WinIcon name="ie" size={18} />
                <span>Internet Explorer</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('file-explorer', 'Windows Explorer', { path: 'C:' })}
              >
                <WinIcon name="folder-open" size={18} />
                <span>Windows Explorer</span>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <div
          className={`win98-startmenu-row ${activeSubmenu === 'documents' ? 'open' : ''}`}
          onMouseEnter={() => setActiveSubmenu('documents')}
        >
          <WinIcon name="document" size={20} />
          <span>Documents</span>
          <span className="win98-startmenu-arrow">▶</span>

          {activeSubmenu === 'documents' && (
            <div className="win98-submenu" style={{ top: 24, minWidth: 220 }}>
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('document-viewer', 'Personal context.html', {
                    path: 'C:\\My Documents\\Personal context.html',
                  })
                }
              >
                <WinIcon name="document" size={16} />
                <span>Personal context.html</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('document-viewer', 'Pragya Dewangan Kundali.pdf', {
                    path: 'C:\\My Documents\\Pragya Dewangan Personal Kundali.pdf',
                  })
                }
              >
                <WinIcon name="pdf" size={16} />
                <span>Kundali.pdf</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('notepad', 'secret_diary.txt - Notepad', {
                    path: 'C:\\My Documents\\secret_diary.txt',
                  })
                }
              >
                <WinIcon name="notepad" size={16} />
                <span>secret_diary.txt</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('file-explorer', 'My Pictures', {
                    path: 'C:\\My Documents\\My Pictures',
                  })
                }
              >
                <WinIcon name="folder" size={16} />
                <span>My Pictures</span>
              </div>
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('file-explorer', 'PROJECT_DANDI_CLASSIFIED [TOP SECRET]', {
                    path: 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED',
                  })
                }
              >
                <WinIcon name="folder" size={16} />
                <span style={{ color: '#800000', fontWeight: 'bold' }}>PROJECT_DANDI [Classified]</span>
              </div>
              <div className="win98-dropdown-divider" />
              <div
                className="win98-startmenu-row"
                onClick={() =>
                  handleLaunch('file-explorer', 'My Documents', {
                    path: 'C:\\My Documents',
                  })
                }
              >
                <WinIcon name="folder-open" size={16} />
                <span>Open My Documents</span>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div
          className={`win98-startmenu-row ${activeSubmenu === 'settings' ? 'open' : ''}`}
          onMouseEnter={() => setActiveSubmenu('settings')}
        >
          <WinIcon name="control-panel" size={20} />
          <span>Settings</span>
          <span className="win98-startmenu-arrow">▶</span>

          {activeSubmenu === 'settings' && (
            <div className="win98-submenu" style={{ top: 52 }}>
              <div
                className="win98-startmenu-row"
                onClick={() => handleLaunch('control-panel')}
              >
                <WinIcon name="control-panel" size={18} />
                <span>Control Panel</span>
              </div>
            </div>
          )}
        </div>

        {/* Find */}
        <div
          className="win98-startmenu-row"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch('find')}
        >
          <WinIcon name="find" size={20} />
          <span>Find</span>
        </div>

        {/* Help */}
        <div
          className="win98-startmenu-row"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch('help')}
        >
          <WinIcon name="help" size={20} />
          <span>Help</span>
        </div>

        {/* Run */}
        <div
          className="win98-startmenu-row"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch('run')}
        >
          <WinIcon name="run" size={20} />
          <span>Run...</span>
        </div>

        <div className="win98-dropdown-divider" />

        {/* Shut Down */}
        <div
          className="win98-startmenu-row"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch('shutdown')}
        >
          <WinIcon name="shutdown" size={20} />
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
};
