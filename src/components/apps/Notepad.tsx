import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { soundManager } from '../../utils/audio';

interface NotepadProps {
  initialPath?: string;
  onUpdateTitle?: (title: string) => void;
}

export const Notepad: React.FC<NotepadProps> = ({ initialPath, onUpdateTitle }) => {
  const { readFile, writeFile } = useFileSystem();
  const [filePath, setFilePath] = useState<string | undefined>(initialPath);
  const [content, setContent] = useState<string>('');
  const [isModified, setIsModified] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (filePath) {
      const text = readFile(filePath);
      if (text !== undefined) {
        setContent(text);
        setIsModified(false);
      }
    }
  }, [filePath, readFile]);

  const handleSave = () => {
    soundManager.playClick();
    const targetPath = filePath || `C:\\My Documents\\Untitled_${Date.now().toString().slice(-4)}.txt`;
    writeFile(targetPath, content, 'text/plain');
    setFilePath(targetPath);
    setIsModified(false);
    if (onUpdateTitle) {
      const filename = targetPath.split('\\').pop();
      onUpdateTitle(`${filename} - Notepad`);
    }
  };

  const handleNew = () => {
    soundManager.playClick();
    setFilePath(undefined);
    setContent('');
    setIsModified(false);
    setActiveMenu(null);
    if (onUpdateTitle) {
      onUpdateTitle('Untitled - Notepad');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        {/* File Menu */}
        <div
          className={`win98-menu-item ${activeMenu === 'file' ? 'open' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
        >
          File
          {activeMenu === 'file' && (
            <div className="win98-menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="win98-dropdown-item" onClick={handleNew}>
                <span>New</span>
                <span>Ctrl+N</span>
              </div>
              <div className="win98-dropdown-item" onClick={() => { handleSave(); setActiveMenu(null); }}>
                <span>Save</span>
                <span>Ctrl+S</span>
              </div>
              <div className="win98-dropdown-divider" />
              <div className="win98-dropdown-item" onClick={() => setActiveMenu(null)}>
                <span>Exit</span>
              </div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div
          className={`win98-menu-item ${activeMenu === 'edit' ? 'open' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
        >
          Edit
          {activeMenu === 'edit' && (
            <div className="win98-menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                className="win98-dropdown-item"
                onClick={() => {
                  const now = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
                  setContent((prev) => prev + '\n' + now);
                  setActiveMenu(null);
                }}
              >
                <span>Time/Date</span>
                <span>F5</span>
              </div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div
          className={`win98-menu-item ${activeMenu === 'help' ? 'open' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
        >
          Help
          {activeMenu === 'help' && (
            <div className="win98-menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                className="win98-dropdown-item"
                onClick={() => {
                  alert('Notepad for Windows 98\nVersion 4.10.1998\n(C) Microsoft Corporation.');
                  setActiveMenu(null);
                }}
              >
                <span>About Notepad</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, padding: 1, display: 'flex' }} onClick={() => setActiveMenu(null)}>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            resize: 'none',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 13,
            lineHeight: 1.3,
            padding: 6,
            border: 'none',
            outline: 'none',
            whiteSpace: 'pre-wrap',
          }}
          placeholder="Type here..."
          autoFocus
        />
      </div>

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 3 }}>
          {filePath || 'Untitled'} {isModified ? '(Unsaved)' : ''}
        </div>
        <div className="win98-status-pane" style={{ flex: 1 }}>
          {content.length} chars
        </div>
      </div>
    </div>
  );
};
