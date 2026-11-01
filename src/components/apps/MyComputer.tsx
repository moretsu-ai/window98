import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WinIcon, WinIconType } from '../common/WinIcon';

interface DriveItem {
  id: string;
  name: string;
  type: string;
  totalSize: string;
  freeSpace: string;
  icon: WinIconType;
  path?: string;
  appId?: 'file-explorer' | 'control-panel';
}

const items: DriveItem[] = [
  {
    id: 'floppy-a',
    name: '3½ Floppy (A:)',
    type: '3½-Inch Floppy Disk',
    totalSize: '1.44 MB',
    freeSpace: '1.44 MB',
    icon: 'drive-floppy',
    path: 'A:',
    appId: 'file-explorer',
  },
  {
    id: 'drive-c',
    name: '(C:)',
    type: 'Local Disk',
    totalSize: '2.00 GB',
    freeSpace: '1.42 GB',
    icon: 'drive-c',
    path: 'C:',
    appId: 'file-explorer',
  },
  {
    id: 'drive-d',
    name: 'Compact Disc (D:)',
    type: 'CD-ROM Disc',
    totalSize: '650 MB',
    freeSpace: '0 bytes',
    icon: 'drive-cd',
    path: 'D:',
    appId: 'file-explorer',
  },
  {
    id: 'control-panel',
    name: 'Control Panel',
    type: 'System Folder',
    totalSize: '',
    freeSpace: '',
    icon: 'control-panel',
    appId: 'control-panel',
  },
];

export const MyComputer: React.FC = () => {
  const { openWindow } = useWindowManager();
  const [selectedId, setSelectedId] = React.useState<string>('drive-c');

  const selectedItem = items.find((i) => i.id === selectedId) || items[1];

  const handleOpen = (item: DriveItem) => {
    if (item.appId === 'control-panel') {
      openWindow('control-panel');
    } else if (item.appId === 'file-explorer' && item.path) {
      openWindow('file-explorer', `Exploring - ${item.name}`, { path: item.path });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Main Drive Grid Area */}
      <div
        className="inset-border"
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          padding: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gridAutoRows: '80px',
          gap: 10,
          overflowY: 'auto',
        }}
      >
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              onDoubleClick={() => handleOpen(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                cursor: 'pointer',
                backgroundColor: isSelected ? '#000080' : 'transparent',
                color: isSelected ? '#ffffff' : '#000000',
                border: isSelected ? '1px dotted #ffffff' : '1px solid transparent',
              }}
            >
              <WinIcon name={item.icon} size={32} />
              <span
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  lineHeight: 1.2,
                }}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 2 }}>
          {items.length} object(s)
        </div>
        <div className="win98-status-pane" style={{ flex: 3 }}>
          {selectedItem.freeSpace ? `Free Space: ${selectedItem.freeSpace}` : selectedItem.type}
        </div>
        <div className="win98-status-pane" style={{ flex: 2 }}>
          My Computer
        </div>
      </div>
    </div>
  );
};
