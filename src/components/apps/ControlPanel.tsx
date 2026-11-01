import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';

interface ControlPanelProps {
  onWallpaperChange?: (url: string | undefined) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onWallpaperChange }) => {
  const [activeTab, setActiveTab] = useState<'display' | 'datetime' | 'sounds' | 'system'>('display');
  const [wallpaper, setWallpaper] = useState<string>('none');
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
  const [doubleClickCount, setDoubleClickCount] = useState<number>(0);

  const handleApplyWallpaper = (wp: string) => {
    soundManager.playClick();
    setWallpaper(wp);
    if (onWallpaperChange) {
      if (wp === 'clouds') {
        onWallpaperChange('/documents/WhatsApp Image 2026-11-01 at 15.20.32.jpeg');
      } else {
        onWallpaperChange(undefined);
      }
    }
  };

  const handleTestSound = () => {
    soundManager.playStartup();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', padding: 6 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #808080', paddingBottom: 2 }}>
        <button
          className={`win98-btn ${activeTab === 'display' ? 'active' : ''}`}
          onClick={() => { soundManager.playClick(); setActiveTab('display'); }}
        >
          Display
        </button>
        <button
          className={`win98-btn ${activeTab === 'datetime' ? 'active' : ''}`}
          onClick={() => { soundManager.playClick(); setActiveTab('datetime'); }}
        >
          Date / Time
        </button>
        <button
          className={`win98-btn ${activeTab === 'sounds' ? 'active' : ''}`}
          onClick={() => { soundManager.playClick(); setActiveTab('sounds'); }}
        >
          Sounds
        </button>
        <button
          className={`win98-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => { soundManager.playClick(); setActiveTab('system'); }}
        >
          System
        </button>
      </div>

      {/* Tab Body */}
      <div
        className="inset-border"
        style={{ flex: 1, backgroundColor: '#c0c0c0', padding: 10, marginTop: 4, overflowY: 'auto' }}
      >
        {activeTab === 'display' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 'bold' }}>Display Properties - Background</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {/* Miniature Monitor Preview */}
              <div
                className="outset-border"
                style={{ width: 140, height: 105, backgroundColor: '#c0c0c0', padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div
                  className="inset-border"
                  style={{
                    width: '100%',
                    height: '80%',
                    backgroundColor: wallpaper === 'clouds' ? '#0078d7' : '#008080',
                    backgroundImage: wallpaper === 'clouds' ? 'url("/documents/WhatsApp Image 2026-11-01 at 15.20.32.jpeg")' : 'none',
                    backgroundSize: 'cover',
                  }}
                />
                <div style={{ width: 30, height: 6, backgroundColor: '#808080', marginTop: 4 }} />
              </div>

              {/* Wallpaper Selection Box */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div>Select a Wallpaper:</div>
                <div
                  className="inset-border"
                  style={{ backgroundColor: '#ffffff', height: 90, overflowY: 'auto', padding: 2 }}
                >
                  <div
                    onClick={() => handleApplyWallpaper('none')}
                    style={{
                      padding: '2px 4px',
                      cursor: 'pointer',
                      backgroundColor: wallpaper === 'none' ? '#000080' : 'transparent',
                      color: wallpaper === 'none' ? '#ffffff' : '#000000',
                    }}
                  >
                    (None) — Windows 98 Teal
                  </div>
                  <div
                    onClick={() => handleApplyWallpaper('clouds')}
                    style={{
                      padding: '2px 4px',
                      cursor: 'pointer',
                      backgroundColor: wallpaper === 'clouds' ? '#000080' : 'transparent',
                      color: wallpaper === 'clouds' ? '#ffffff' : '#000000',
                    }}
                  >
                    Windows 98 Clouds (Classic)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'datetime' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 'bold' }}>Date & Time Properties</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {/* Calendar Simulation */}
              <div className="outset-border" style={{ flex: 1, padding: 8 }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 6 }}>
                  {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 10, textAlign: 'center' }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  {Array.from({ length: 31 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        padding: 2,
                        backgroundColor: i + 1 === new Date().getDate() ? '#000080' : 'transparent',
                        color: i + 1 === new Date().getDate() ? '#ffffff' : '#000000',
                      }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clock */}
              <div className="outset-border" style={{ width: 140, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {new Date().toLocaleTimeString()}
                </div>
                <div style={{ fontSize: 10, color: '#404040', marginTop: 4 }}>Current System Time</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 'bold' }}>Sound Schemes</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soundsEnabled}
                onChange={(e) => {
                  setSoundsEnabled(e.target.checked);
                  soundManager.setMuted(!e.target.checked);
                }}
              />
              <span>Enable Windows 98 Sound Effects</span>
            </label>
            <div style={{ marginTop: 8 }}>
              <button className="win98-btn" onClick={handleTestSound}>
                <WinIcon name="speaker" size={14} />
                <span>Play Windows 98 Startup Chime</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 'bold' }}>System Properties</div>
            <div style={{ display: 'flex', gap: 14 }}>
              <WinIcon name="computer" size={48} />
              <div style={{ fontSize: 11, lineHeight: 1.5 }}>
                <div><strong>System:</strong></div>
                <div>Microsoft Windows 98</div>
                <div>Second Edition</div>
                <div>4.10.2222 A</div>
                <div style={{ marginTop: 6 }}><strong>Computer:</strong></div>
                <div>Intel Pentium(R) II Processor</div>
                <div>400 MHz, 64.0 MB of RAM</div>
                <div>Sound Blaster 16 Audio Card</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OK / Cancel */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 6 }}>
        <button className="win98-btn" style={{ minWidth: 60 }}>OK</button>
        <button className="win98-btn" style={{ minWidth: 60 }}>Cancel</button>
        <button className="win98-btn" style={{ minWidth: 60 }}>Apply</button>
      </div>
    </div>
  );
};
