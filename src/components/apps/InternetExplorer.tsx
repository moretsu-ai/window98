import React, { useState, useEffect, useRef } from 'react';
import { useEasterEgg } from '../../context/EasterEggContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { soundManager } from '../../utils/audio';
import { WinIcon } from '../common/WinIcon';

interface InternetExplorerProps {
  initialUrl?: string;
}

export const InternetExplorer: React.FC<InternetExplorerProps> = ({ initialUrl = 'home.microsoft.com' }) => {
  const { triggerEgg2 } = useEasterEgg();
  const { writeFile } = useFileSystem();
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulated Download State
  const [downloadState, setDownloadState] = useState<{
    isOpen: boolean;
    progress: number;
    filename: string;
    sourceDomain: string;
  }>({
    isOpen: false,
    progress: 0,
    filename: '',
    sourceDomain: '',
  });

  const navigateTo = (url: string) => {
    soundManager.playClick();
    let clean = url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    if (!clean) clean = 'home.microsoft.com';
    setIsLoading(true);
    setInputUrl(clean);
    setTimeout(() => {
      setCurrentUrl(clean);
      setIsLoading(false);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), clean]);
      setHistoryIndex((prev) => prev + 1);
    }, 400);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      soundManager.playClick();
      const prev = history[historyIndex - 1];
      setHistoryIndex((i) => i - 1);
      setCurrentUrl(prev);
      setInputUrl(prev);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundManager.playClick();
      const next = history[historyIndex + 1];
      setHistoryIndex((i) => i + 1);
      setCurrentUrl(next);
      setInputUrl(next);
    }
  };

  // Start Simulated Download
  const startDownload = (filename: string, sourceDomain: string) => {
    soundManager.playClick();
    setDownloadState({
      isOpen: true,
      progress: 0,
      filename,
      sourceDomain,
    });
  };

  // Run download progress timer
  useEffect(() => {
    if (!downloadState.isOpen) return;
    const interval = setInterval(() => {
      setDownloadState((prev) => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        const nextProgress = prev.progress + 15;
        if (nextProgress >= 100) {
          clearInterval(interval);
          // Complete download
          const filePath = `C:\\My Documents\\${prev.filename}`;
          writeFile(
            filePath,
            `SIMULATED EXECUTABLE: ${prev.filename}\nDownloaded from ${prev.sourceDomain} on ${new Date().toLocaleString()}\nChecksum: SHA256-AUTHENTIC-WIN98`
          );

          // ONLY zxc.com download triggers Easter Egg 02
          if (prev.sourceDomain.toLowerCase().includes('zxc.com')) {
            setTimeout(() => {
              setDownloadState({ isOpen: false, progress: 0, filename: '', sourceDomain: '' });
              triggerEgg2();
            }, 800);
          } else {
            setTimeout(() => {
              setDownloadState({ isOpen: false, progress: 0, filename: '', sourceDomain: '' });
              alert(`Download complete!\nFile saved to ${filePath}`);
            }, 500);
          }
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: nextProgress };
      });
    }, 300);

    return () => clearInterval(interval);
  }, [downloadState.isOpen, downloadState.sourceDomain, triggerEgg2, writeFile]);

  const domain = currentUrl.toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', position: 'relative' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item">File</span>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Go</span>
        <span className="win98-menu-item">Favorites</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* Navigation Toolbar */}
      <div className="win98-toolbar" style={{ gap: 4 }}>
        <button className="win98-btn" onClick={handleBack} disabled={historyIndex === 0} title="Back">
          ◀ Back
        </button>
        <button className="win98-btn" onClick={handleForward} disabled={historyIndex >= history.length - 1} title="Forward">
          Forward ▶
        </button>
        <button className="win98-btn" onClick={() => navigateTo(currentUrl)} title="Refresh">
          ↻ Refresh
        </button>
        <button className="win98-btn" onClick={() => navigateTo('home.microsoft.com')} title="Home">
          🏠 Home
        </button>
        <button className="win98-btn" onClick={() => navigateTo('google.com')} title="Search">
          🔍 Search
        </button>
      </div>

      {/* Address Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold' }}>Address</span>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigateTo(inputUrl);
          }}
          style={{ flex: 1, height: 20 }}
        />
        <button className="win98-btn" onClick={() => navigateTo(inputUrl)} style={{ padding: '2px 6px' }}>
          Go
        </button>
      </div>

      {/* Browser Viewport Area */}
      <div
        className="inset-border"
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          margin: 2,
          position: 'relative',
        }}
      >
        {isLoading && (
          <div style={{ padding: 16, color: '#000080', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
            <WinIcon name="ie" size={20} />
            <span>Finding site: {inputUrl}...</span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* 1. MSN / home.microsoft.com */}
            {(domain.includes('home.microsoft.com') || domain.includes('msn.com')) && (
              <div style={{ padding: 12, fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000080', paddingBottom: 6 }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#cc0000' }}>
                    msn<span style={{ color: '#000080' }}>.com</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#666' }}>Welcome to Microsoft Internet Start — October 1998</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginTop: 10 }}>
                  <div>
                    <h3 style={{ color: '#000080', fontSize: 14, marginBottom: 4 }}>Top News Stories of 1998</h3>
                    <ul style={{ fontSize: 12, lineHeight: 1.5, paddingLeft: 18 }}>
                      <li>Microsoft launches Windows 98 operating system with USB support and FAT32.</li>
                      <li>Google founded by Larry Page and Sergey Brin in Menlo Park garage.</li>
                      <li>France defeats Brazil 3-0 to win 1998 FIFA World Cup.</li>
                      <li>Atal Bihari Vajpayee leads Indian government into the digital IT era.</li>
                    </ul>

                    <div style={{ marginTop: 14, padding: 8, backgroundColor: '#f0f4f8', border: '1px solid #c0d0e0' }}>
                      <strong>Popular 1998 Web Destinations:</strong>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button className="win98-btn" onClick={() => navigateTo('google.com')}>Google Beta</button>
                        <button className="win98-btn" onClick={() => navigateTo('mcdonalds.com')}>McDonald's</button>
                        <button className="win98-btn" onClick={() => navigateTo('netflix.com')}>Netflix DVD</button>
                        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => navigateTo('zxc.com')}>zxc.com (Turbo Boost)</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffe0', border: '1px solid #e0d080', padding: 8 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 12, borderBottom: '1px solid #cca', paddingBottom: 2 }}>Stock Tickers (1998)</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>MSFT: $108.50 ▲ +2.25</div>
                    <div style={{ fontSize: 11 }}>INTC: $84.12 ▲ +1.10</div>
                    <div style={{ fontSize: 11 }}>AAPL: $36.75 ▼ -0.50</div>
                    <div style={{ fontSize: 11 }}>CSCO: $62.00 ▲ +3.40</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Google Beta (1998) */}
            {domain.includes('google.com') && (
              <div style={{ textAlign: 'center', padding: '30px 10px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ fontSize: 48, fontWeight: 'bold', letterSpacing: -2, marginBottom: 12 }}>
                  <span style={{ color: '#4285f4' }}>G</span>
                  <span style={{ color: '#ea4335' }}>o</span>
                  <span style={{ color: '#fbbc05' }}>o</span>
                  <span style={{ color: '#4285f4' }}>g</span>
                  <span style={{ color: '#34a853' }}>l</span>
                  <span style={{ color: '#ea4335' }}>e</span>
                  <span style={{ color: '#4285f4' }}>!</span>
                </div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>Beta Search the web using Google!</div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                  <input type="text" placeholder="Search 25 million pages..." style={{ width: 280, height: 24 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  <button className="win98-btn" onClick={() => alert('Search results: 1 match found: zxc.com (High Performance Tool)')}>Google Search</button>
                  <button className="win98-btn" onClick={() => navigateTo('zxc.com')}>I'm feeling lucky</button>
                </div>
                <div style={{ marginTop: 24, fontSize: 11, color: '#888' }}>Copyright &copy;1998 Google Inc.</div>
              </div>
            )}

            {/* 3. McDonald's 1998 */}
            {domain.includes('mcdonalds.com') && (
              <div style={{ padding: 10, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ backgroundColor: '#cc0000', color: '#fff', padding: 8, fontSize: 18, fontWeight: 'bold' }}>
                  McDonald's USA — Welcome to the Golden Arches (1998)
                </div>
                <div style={{ margin: '14px 0' }}>
                  <img
                    src="/documents/WhatsApp Image 2026-11-01 at 15.20.59.jpeg"
                    alt="McDonald's 1998"
                    style={{ maxWidth: '90%', maxHeight: 320, border: '2px solid #808080' }}
                  />
                </div>
                <p style={{ fontSize: 12 }}>Order from the menu above or ask Ronald McDonald for assistance!</p>
              </div>
            )}

            {/* 4. Netflix 1998 */}
            {domain.includes('netflix.com') && (
              <div style={{ padding: 10, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ backgroundColor: '#e50914', color: '#fff', padding: 8, fontSize: 18, fontWeight: 'bold' }}>
                  Netflix — Rent all the DVD movies you want for $20 a month!
                </div>
                <div style={{ margin: '14px 0' }}>
                  <img
                    src="/documents/WhatsApp Image 2026-11-01 at 15.20.59 (1).jpeg"
                    alt="Netflix 1998"
                    style={{ maxWidth: '90%', maxHeight: 320, border: '2px solid #808080' }}
                  />
                </div>
                <p style={{ fontSize: 12 }}>Free home delivery! No late fees! Try Netflix for FREE Today!</p>
              </div>
            )}

            {/* 5. zxc.com (CRITICAL FOR EASTER EGG 02) */}
            {domain.includes('zxc.com') && (
              <div
                style={{
                  padding: 16,
                  fontFamily: '"Comic Sans MS", "MS Sans Serif", cursive, sans-serif',
                  backgroundColor: '#000000',
                  color: '#00ff00',
                  minHeight: '100%',
                }}
              >
                <div style={{ textAlign: 'center', border: '3px dashed #ff0000', padding: 14, backgroundColor: '#111' }}>
                  <div style={{ fontSize: 22, color: '#ffff00', fontWeight: 'bold', textShadow: '2px 2px #ff0000' }}>
                    ⚡⚡ ULTRA SPEED ACCELERATOR PRO 98 ⚡⚡
                  </div>
                  <div style={{ fontSize: 14, color: '#00ffff', margin: '8px 0' }}>
                    100% FREE RAM DOUBLER & 56k INTERNET TURBO CHARGER!
                  </div>
                  <p style={{ color: '#ffffff', fontSize: 12, margin: '10px 0' }}>
                    Tired of slow downloads? Double your computer processor speed instantly with this one simple tool!
                    Over 500,000 satisfied Windows 98 users!
                  </p>

                  <div style={{ margin: '18px 0' }}>
                    <button
                      className="win98-btn"
                      onClick={() => startDownload('ULTRA_SPEED_ACCELERATOR_PRO_98.EXE', 'zxc.com')}
                      style={{
                        padding: '10px 24px',
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#cc0000',
                        cursor: 'pointer',
                        backgroundColor: '#ffff00',
                      }}
                    >
                      ⬇️ DOWNLOAD NOW: ULTRA_SPEED_ACCELERATOR_PRO_98.EXE (1.2 MB)
                    </button>
                  </div>

                  <div style={{ fontSize: 10, color: '#888' }}>
                    Guaranteed Virus Free &bull; Certified Microsoft Windows 98 Ready &bull; No Spyware
                  </div>
                </div>
              </div>
            )}

            {/* Unknown URL Fallback */}
            {!['home.microsoft.com', 'msn.com', 'google.com', 'mcdonalds.com', 'netflix.com', 'zxc.com'].some((d) => domain.includes(d)) && (
              <div style={{ padding: 20, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ color: '#cc0000' }}>The page cannot be displayed</h2>
                <p style={{ marginTop: 10, fontSize: 12 }}>
                  The page you are looking for is currently unavailable or the address was typed incorrectly.
                </p>
                <div style={{ marginTop: 16 }}>
                  <button className="win98-btn" onClick={() => navigateTo('home.microsoft.com')}>
                    Return to MSN Home
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Simulated Download Progress Dialog */}
      {downloadState.isOpen && (
        <div
          className="win98-window"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 380,
            zIndex: 1000,
            boxShadow: '4px 4px 10px rgba(0,0,0,0.5)',
          }}
        >
          <div className="win98-titlebar active">
            <div className="win98-title-text">
              <span>File Download - {downloadState.filename}</span>
            </div>
            <button
              className="win98-title-btn"
              onClick={() => setDownloadState({ isOpen: false, progress: 0, filename: '', sourceDomain: '' })}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 12, backgroundColor: '#c0c0c0', fontSize: 11 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <WinIcon name="ie" size={32} />
              <div>
                <div>Saving: <strong>{downloadState.filename}</strong></div>
                <div>From: <strong>{downloadState.sourceDomain}</strong></div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div
              className="inset-border"
              style={{
                height: 18,
                backgroundColor: '#ffffff',
                padding: 2,
                position: 'relative',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${downloadState.progress}%`,
                  backgroundColor: '#000080',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span>Progress: {downloadState.progress}%</span>
              <span>Transfer rate: 28.8 KB/Sec</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button
                className="win98-btn"
                onClick={() => setDownloadState({ isOpen: false, progress: 0, filename: '', sourceDomain: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="win98-statusbar">
        <div className="win98-status-pane" style={{ flex: 3 }}>
          {isLoading ? 'Opening page...' : 'Done'}
        </div>
        <div className="win98-status-pane" style={{ flex: 1 }}>
          Internet
        </div>
      </div>
    </div>
  );
};
