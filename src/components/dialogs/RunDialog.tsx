import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';
import { AppId } from '../../types/window';

export const RunDialog: React.FC = () => {
  const { openWindow, closeWindow, windows } = useWindowManager();
  const [cmd, setCmd] = useState('');

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const clean = cmd.trim().toLowerCase();

    const appMap: Record<string, AppId> = {
      notepad: 'notepad',
      calc: 'calculator',
      calculator: 'calculator',
      pbrush: 'paint',
      paint: 'paint',
      explorer: 'file-explorer',
      winmine: 'minesweeper',
      minesweeper: 'minesweeper',
      sol: 'solitaire',
      solitaire: 'solitaire',
      snake: 'snake',
      iexplore: 'internet-explorer',
      control: 'control-panel',
    };

    if (appMap[clean]) {
      openWindow(appMap[clean]);
      const runWin = windows.find((w) => w.appId === 'run');
      if (runWin) closeWindow(runWin.id);
    } else {
      soundManager.playError();
      alert(`Cannot find the file '${cmd}' (or one of its components). Make sure the path and filename are correct.`);
    }
  };

  const handleCancel = () => {
    soundManager.playClick();
    const runWin = windows.find((w) => w.appId === 'run');
    if (runWin) closeWindow(runWin.id);
  };

  return (
    <form onSubmit={handleRun} style={{ padding: 12, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontSize: 11 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <WinIcon name="run" size={32} />
        <div>
          Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <label>Open:</label>
        <input
          type="text"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="e.g. notepad, calc, winmine, sol, iexplore"
          autoFocus
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 'auto' }}>
        <button type="submit" className="win98-btn" style={{ minWidth: 60 }}>
          OK
        </button>
        <button type="button" className="win98-btn" style={{ minWidth: 60 }} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
