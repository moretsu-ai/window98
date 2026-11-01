import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { DesktopIcon } from './DesktopIcon';
import { WinIconType } from '../common/WinIcon';
import { AppId } from '../../types/window';

interface IconConfig {
  id: string;
  label: string;
  iconName: WinIconType;
  appId: AppId;
  titleOverride?: string;
  params?: any;
  col: number;
  row: number;
}

const desktopIcons: IconConfig[] = [
  { id: 'my-computer', label: 'My Computer', iconName: 'computer', appId: 'my-computer', col: 0, row: 0 },
  { id: 'my-documents', label: 'My Documents', iconName: 'folder', appId: 'file-explorer', params: { path: 'C:\\My Documents' }, col: 0, row: 1 },
  { id: 'ie', label: 'Internet Explorer', iconName: 'ie', appId: 'internet-explorer', col: 0, row: 2 },
  { id: 'recycle-bin', label: 'Recycle Bin', iconName: 'recycle-bin', appId: 'file-explorer', params: { path: 'C:\\Recycle Bin' }, col: 0, row: 3 },
  { id: 'control-panel', label: 'Control Panel', iconName: 'control-panel', appId: 'control-panel', col: 0, row: 4 },

  { id: 'notepad', label: 'Notepad', iconName: 'notepad', appId: 'notepad', col: 1, row: 0 },
  { id: 'paint', label: 'Paint', iconName: 'paint', appId: 'paint', col: 1, row: 1 },
  { id: 'calculator', label: 'Calculator', iconName: 'calculator', appId: 'calculator', col: 1, row: 2 },
  { id: 'minesweeper', label: 'Minesweeper', iconName: 'minesweeper', appId: 'minesweeper', col: 1, row: 3 },
  { id: 'solitaire', label: 'Solitaire', iconName: 'solitaire', appId: 'solitaire', col: 1, row: 4 },

  { id: 'snake', label: 'Nokia Snake 98', iconName: 'snake', appId: 'snake', col: 2, row: 0 },
];

interface DesktopProps {
  wallpaperUrl?: string;
}

export const Desktop: React.FC<DesktopProps> = ({ wallpaperUrl }) => {
  const { openWindow } = useWindowManager();
  const { writeFile } = useFileSystem();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleCreateTextDocument = () => {
    const filename = `New Text Document (${Date.now().toString().slice(-4)}).txt`;
    writeFile(`C:\\My Documents\\${filename}`, '');
    openWindow('notepad', `${filename} - Notepad`, { path: `C:\\My Documents\\${filename}` });
    handleCloseMenu();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 28, // above taskbar
        backgroundImage: wallpaperUrl ? `url("${wallpaperUrl}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#008080',
        overflow: 'hidden',
      }}
      onClick={() => {
        setSelectedId(null);
        handleCloseMenu();
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          iconName={icon.iconName}
          isSelected={selectedId === icon.id}
          onSelect={() => setSelectedId(icon.id)}
          onOpen={() => openWindow(icon.appId, icon.titleOverride, icon.params)}
          initialX={icon.col * 85 + 14}
          initialY={icon.row * 84 + 14}
        />
      ))}

      {/* Right Click Context Menu */}
      {contextMenu && (
        <div
          className="win98-menu-dropdown"
          style={{
            position: 'absolute',
            left: Math.min(contextMenu.x, window.innerWidth - 160),
            top: Math.min(contextMenu.y, window.innerHeight - 180),
            zIndex: 99999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="win98-dropdown-item" onClick={handleCloseMenu}>
            <span>Arrange Icons</span>
            <span>▶</span>
          </div>
          <div className="win98-dropdown-item" onClick={handleCloseMenu}>
            <span>Line Up Icons</span>
          </div>
          <div className="win98-dropdown-divider" />
          <div className="win98-dropdown-item" onClick={handleCloseMenu}>
            <span>Refresh</span>
          </div>
          <div className="win98-dropdown-divider" />
          <div className="win98-dropdown-item" onClick={handleCreateTextDocument}>
            <span>New Text Document</span>
          </div>
          <div className="win98-dropdown-divider" />
          <div
            className="win98-dropdown-item"
            onClick={() => {
              openWindow('control-panel');
              handleCloseMenu();
            }}
          >
            <span>Properties</span>
          </div>
        </div>
      )}
    </div>
  );
};
