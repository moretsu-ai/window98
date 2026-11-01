import React, { useState } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { VFSItem } from '../../types/filesystem';
import { WinIcon, WinIconType } from '../common/WinIcon';
import { soundManager } from '../../utils/audio';

interface FileExplorerProps {
  initialPath?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ initialPath = 'C:\\My Documents' }) => {
  const { getFolderItems, getItem, deleteItem, createFolder, writeFile } = useFileSystem();
  const { openWindow } = useWindowManager();
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'icons' | 'details'>('icons');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const items = getFolderItems(currentPath);

  const navigateTo = (newPath: string) => {
    soundManager.playClick();
    setCurrentPath(newPath);
    setSelectedPath(null);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newPath]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      soundManager.playClick();
      setHistoryIndex((prev) => prev - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedPath(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundManager.playClick();
      setHistoryIndex((prev) => prev + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedPath(null);
    }
  };

  const handleUp = () => {
    if (currentPath === 'C:' || currentPath === 'C:\\') return;
    const lastSlash = currentPath.lastIndexOf('\\');
    const parent = lastSlash > 2 ? currentPath.substring(0, lastSlash) : 'C:';
    navigateTo(parent);
  };

  const handleOpenItem = (item: VFSItem) => {
    soundManager.playClick();
    // Special Classified Archive interactions
    if (item.name === '03_DANDI_GROUP_CHAT.txt') {
      openWindow('retro-chat', 'Dandi March 1930 - mIRC Group Chat [TOP SECRET]', { item });
    } else if (item.name === '04_TRAVEL_EXPENSES.xls') {
      openWindow('retro-spreadsheet', 'Microsoft Excel 97 - 04_TRAVEL_EXPENSES.xls', { item });
    } else if (item.name === '06_OPERATION_SALT.exe') {
      openWindow('operation-salt', 'OPERATION_SALT.EXE - Mission Terminal [CLASSIFIED]', { item });
    } else if (item.name === '07_UNSEEN_FOOTAGE') {
      openWindow('unseen-footage', 'Classified Archive - 07_UNSEEN_FOOTAGE Gallery', { item });
    } else if (item.type === 'folder') {
      navigateTo(item.path);
    } else {
      const ext = item.name.split('.').pop()?.toLowerCase();
      if (['txt', 'log', 'bat', 'ini', 'md'].includes(ext || '')) {
        openWindow('notepad', `${item.name} - Notepad`, { path: item.path });
      } else if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(ext || '')) {
        openWindow('image-viewer', `${item.name} - Image Preview`, { item });
      } else if (['html', 'htm', 'pdf'].includes(ext || '')) {
        openWindow('document-viewer', `${item.name}`, { item });
      } else {
        soundManager.playError();
        alert(`Windows cannot open this file: ${item.name}\nUnknown format.`);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPath) {
      soundManager.playClick();
      deleteItem(selectedPath);
      setSelectedPath(null);
    }
  };

  const handleNewFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(currentPath, newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const getItemIcon = (item: VFSItem): WinIconType => {
    if (item.name === '03_DANDI_GROUP_CHAT.txt') return 'network';
    if (item.name === '04_TRAVEL_EXPENSES.xls') return 'document';
    if (item.name === '06_OPERATION_SALT.exe') return 'run';
    if (item.name === '07_UNSEEN_FOOTAGE') return 'image';
    if (item.type === 'folder') return 'folder';
    const ext = item.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext === 'exe') return 'run';
    if (['txt', 'log', 'bat', 'ini', 'md'].includes(ext || '')) return 'document';
    return 'document';
  };

  const isClassifiedFolder = currentPath.includes('PROJECT_DANDI_CLASSIFIED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Favorites</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="win98-toolbar" style={{ gap: 4 }}>
        <button className="win98-btn" onClick={handleBack} disabled={historyIndex === 0} title="Back">
          ◀ Back
        </button>
        <button className="win98-btn" onClick={handleForward} disabled={historyIndex >= history.length - 1} title="Forward">
          Forward ▶
        </button>
        <button className="win98-btn" onClick={handleUp} disabled={currentPath === 'C:'} title="Up One Level">
          ▲ Up
        </button>

        <div style={{ width: 2, height: 16, borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />

        <button className="win98-btn" onClick={handleDeleteSelected} disabled={!selectedPath} title="Delete">
          ✕ Delete
        </button>
        <button className="win98-btn" onClick={() => setIsCreatingFolder(true)} title="New Folder">
          + New Folder
        </button>

        <div style={{ width: 2, height: 16, borderLeft: '1px solid #808080', borderRight: '1px solid #fff' }} />

        <button
          className={`win98-btn ${viewMode === 'icons' ? 'active' : ''}`}
          onClick={() => setViewMode('icons')}
          title="Icons"
        >
          Icons
        </button>
        <button
          className={`win98-btn ${viewMode === 'details' ? 'active' : ''}`}
          onClick={() => setViewMode('details')}
          title="Details"
        >
          Details
        </button>
      </div>

      {/* Address Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <span style={{ fontSize: 11 }}>Address</span>
        <input
          type="text"
          value={currentPath}
          onChange={(e) => setCurrentPath(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigateTo(currentPath);
            }
          }}
          style={{ flex: 1, height: 20 }}
        />
      </div>

      {/* Classified Header Banner if inside Project Dandi */}
      {isClassifiedFolder && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '3px 8px', fontSize: 11, borderBottom: '1px solid #ffeeba', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🔒 <strong>TOP SECRET:</strong> PROJECT DANDI CLASSIFIED ARCHIVE (PRESERVED OCTOBER 1998)</span>
          <span style={{ fontSize: 10, color: '#aa3300' }}>[FICTIONAL PARODY ARCHIVE]</span>
        </div>
      )}

      {/* Main Content Area (Sidebar + File Grid) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Quick Navigation Tree */}
        <div
          className="inset-border"
          style={{
            width: 165,
            backgroundColor: '#ffffff',
            margin: 2,
            overflowY: 'auto',
            padding: 4,
          }}
        >
          <div style={{ fontWeight: 'bold', padding: 2, borderBottom: '1px solid #dfdfdf', marginBottom: 4 }}>
            All Folders
          </div>
          <div
            onClick={() => navigateTo('C:')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 2, cursor: 'pointer', backgroundColor: currentPath === 'C:' ? '#000080' : 'transparent', color: currentPath === 'C:' ? '#fff' : '#000' }}
          >
            <WinIcon name="drive-c" size={14} />
            <span>(C:)</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\My Documents')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 14px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\My Documents' ? '#000080' : 'transparent', color: currentPath === 'C:\\My Documents' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span>My Documents</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\My Documents\\Classified')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 24px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\My Documents\\Classified' ? '#000080' : 'transparent', color: currentPath === 'C:\\My Documents\\Classified' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span>Classified</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 34px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED' ? '#000080' : 'transparent', color: currentPath === 'C:\\My Documents\\Classified\\PROJECT_DANDI_CLASSIFIED' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span style={{ fontSize: 10, fontWeight: 'bold', color: currentPath.includes('PROJECT_DANDI') ? '#fff' : '#800000' }}>PROJECT_DANDI</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\My Documents\\My Pictures')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 24px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\My Documents\\My Pictures' ? '#000080' : 'transparent', color: currentPath === 'C:\\My Documents\\My Pictures' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span>My Pictures</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\Program Files')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 14px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\Program Files' ? '#000080' : 'transparent', color: currentPath === 'C:\\Program Files' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span>Program Files</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\Windows')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 2px 2px 14px', cursor: 'pointer', backgroundColor: currentPath === 'C:\\Windows' ? '#000080' : 'transparent', color: currentPath === 'C:\\Windows' ? '#fff' : '#000' }}
          >
            <WinIcon name="folder" size={14} />
            <span>Windows</span>
          </div>
          <div
            onClick={() => navigateTo('C:\\Recycle Bin')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 2, cursor: 'pointer', backgroundColor: currentPath === 'C:\\Recycle Bin' ? '#000080' : 'transparent', color: currentPath === 'C:\\Recycle Bin' ? '#fff' : '#000' }}
          >
            <WinIcon name="recycle-bin" size={14} />
            <span>Recycle Bin</span>
          </div>
        </div>

        {/* Right Folder Content Pane */}
        <div
          className="inset-border"
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            margin: 2,
            overflowY: 'auto',
            padding: 8,
          }}
          onClick={() => setSelectedPath(null)}
        >
          {isCreatingFolder && (
            <form onSubmit={handleNewFolderSubmit} style={{ display: 'flex', gap: 4, marginBottom: 8, padding: 4, backgroundColor: '#f0f0f0' }}>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                style={{ flex: 1 }}
              />
              <button type="submit" className="win98-btn">Create</button>
              <button type="button" className="win98-btn" onClick={() => setIsCreatingFolder(false)}>Cancel</button>
            </form>
          )}

          {items.length === 0 && !isCreatingFolder && (
            <div style={{ color: '#808080', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
              This folder is empty.
            </div>
          )}

          {viewMode === 'icons' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
                gridAutoRows: '82px',
                gap: 8,
              }}
            >
              {items.map((item) => {
                const isSelected = selectedPath === item.path;
                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPath(item.path);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenItem(item);
                    }}
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
                    <WinIcon name={getItemIcon(item)} size={32} />
                    <span
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        lineHeight: 1.2,
                        maxHeight: 28,
                        overflow: 'hidden',
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #808080' }}>
                  <th style={{ padding: 4 }}>Name</th>
                  <th style={{ padding: 4 }}>Size</th>
                  <th style={{ padding: 4 }}>Type</th>
                  <th style={{ padding: 4 }}>Modified</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSelected = selectedPath === item.path;
                  return (
                    <tr
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPath(item.path);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleOpenItem(item);
                      }}
                      style={{
                        backgroundColor: isSelected ? '#000080' : 'transparent',
                        color: isSelected ? '#ffffff' : '#000000',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '3px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <WinIcon name={getItemIcon(item)} size={16} />
                        <span>{item.name}</span>
                      </td>
                      <td style={{ padding: '3px 4px' }}>
                        {item.type === 'folder' ? '' : `${Math.ceil(item.size / 1024)} KB`}
                      </td>
                      <td style={{ padding: '3px 4px' }}>{item.type === 'folder' ? 'File Folder' : item.mimeType || 'File'}</td>
                      <td style={{ padding: '3px 4px' }}>{item.modifiedDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 2 }}>
          {items.length} object(s)
        </div>
        <div className="win98-status-pane" style={{ flex: 3 }}>
          {selectedPath
            ? items.find((i) => i.path === selectedPath)?.name || ''
            : `${items.filter((i) => i.type === 'file').reduce((acc, i) => acc + i.size, 0) / 1024 > 1024 ? (items.filter((i) => i.type === 'file').reduce((acc, i) => acc + i.size, 0) / (1024 * 1024)).toFixed(1) + ' MB' : Math.ceil(items.filter((i) => i.type === 'file').reduce((acc, i) => acc + i.size, 0) / 1024) + ' KB'}`}
        </div>
      </div>
    </div>
  );
};
