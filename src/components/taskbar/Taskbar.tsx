import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useEasterEgg } from '../../context/EasterEggContext';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';
import { StartMenu } from './StartMenu';

export const Taskbar: React.FC = () => {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openWindow } = useWindowManager();
  const { isMuted, toggleMute } = useEasterEgg();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartToggle = () => {
    soundManager.playClick();
    setIsStartOpen((prev) => !prev);
  };

  const handleTaskClick = (id: string, isMinimized: boolean) => {
    soundManager.playClick();
    if (activeWindowId === id && !isMinimized) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />
      <div className="win98-taskbar">
        {/* Start Button */}
        <button
          className={`win98-btn win98-start-btn ${isStartOpen ? 'active' : ''}`}
          onClick={handleStartToggle}
        >
          <WinIcon name="win-flag" size={16} />
          <span>Start</span>
        </button>

        {/* Quick Launch separator */}
        <div style={{ width: 3, height: 18, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 3px' }} />

        {/* Quick Launch icons */}
        <div style={{ display: 'flex', gap: 2, marginRight: 4 }}>
          <button
            className="win98-btn"
            style={{ minHeight: 20, padding: 2 }}
            title="Internet Explorer"
            onClick={() => openWindow('internet-explorer')}
          >
            <WinIcon name="ie" size={14} />
          </button>
          <button
            className="win98-btn"
            style={{ minHeight: 20, padding: 2 }}
            title="Show Desktop"
            onClick={() => {
              windows.forEach((w) => {
                if (!w.isMinimized) minimizeWindow(w.id);
              });
            }}
          >
            <WinIcon name="computer" size={14} />
          </button>
        </div>

        <div style={{ width: 3, height: 18, borderLeft: '1px solid #808080', borderRight: '1px solid #fff', margin: '0 3px' }} />

        {/* Task Buttons for Open Windows */}
        <div className="win98-taskbar-tasks">
          {windows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                className={`win98-btn win98-task-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTaskClick(win.id, win.isMinimized)}
                title={win.title}
              >
                <WinIcon name="computer" size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {win.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="win98-systray">
          {/* Audio volume speaker toggle */}
          <div
            onClick={() => {
              toggleMute();
              soundManager.setMuted(!isMuted);
              soundManager.playClick();
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            <WinIcon name="speaker" size={14} />
            {isMuted && <span style={{ color: '#cc0000', fontWeight: 'bold', fontSize: 10, marginLeft: 2 }}>✕</span>}
          </div>

          {/* Real-time Clock */}
          <span>{timeStr}</span>
        </div>
      </div>
    </>
  );
};
