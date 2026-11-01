import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';

export const ShutdownDialog: React.FC = () => {
  const { closeWindow, windows } = useWindowManager();
  const [option, setOption] = useState<'shutdown' | 'restart' | 'dos'>('shutdown');
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  const handleOk = () => {
    soundManager.playClick();
    if (option === 'shutdown') {
      setIsPoweredOff(true);
    } else if (option === 'restart') {
      window.location.reload();
    } else {
      alert('MS-DOS Mode:\nC:\\> Type "win" to return to Windows 98.');
      closeWindow('shutdown');
    }
  };

  const handleCancel = () => {
    soundManager.playClick();
    const shutdownWin = windows.find((w) => w.appId === 'shutdown');
    if (shutdownWin) closeWindow(shutdownWin.id);
  };

  if (isPoweredOff) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          zIndex: 9999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff8800',
          fontFamily: '"Times New Roman", Times, serif',
          textAlign: 'center',
          padding: 20,
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 2, marginBottom: 20, textShadow: '2px 2px #441100' }}>
          It's now safe to turn off your computer.
        </div>
        <button
          className="win98-btn"
          style={{ fontSize: 14, padding: '8px 16px', marginTop: 30 }}
          onClick={() => {
            soundManager.playStartup();
            setIsPoweredOff(false);
            const shutdownWin = windows.find((w) => w.appId === 'shutdown');
            if (shutdownWin) closeWindow(shutdownWin.id);
          }}
        >
          Restart Computer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', fontSize: 11 }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <WinIcon name="shutdown" size={32} />
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>What do you want the computer to do?</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shutdown-option"
                checked={option === 'shutdown'}
                onChange={() => setOption('shutdown')}
              />
              <span>Shut down</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shutdown-option"
                checked={option === 'restart'}
                onChange={() => setOption('restart')}
              />
              <span>Restart</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="radio"
                name="shutdown-option"
                checked={option === 'dos'}
                onChange={() => setOption('dos')}
              />
              <span>Restart in MS-DOS mode</span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 'auto' }}>
        <button className="win98-btn" style={{ minWidth: 60 }} onClick={handleOk}>
          OK
        </button>
        <button className="win98-btn" style={{ minWidth: 60 }} onClick={handleCancel}>
          Cancel
        </button>
        <button className="win98-btn" style={{ minWidth: 60 }} onClick={() => alert('Windows 98 Help: Select an action to power off or restart the simulator.')}>
          Help
        </button>
      </div>
    </div>
  );
};
