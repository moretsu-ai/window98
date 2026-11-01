import React, { useState, useEffect } from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { EasterEggProvider, useEasterEgg } from './context/EasterEggContext';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/taskbar/Taskbar';
import { WindowRenderer } from './components/window/WindowRenderer';
import { EasterEgg01Chick } from './components/easter-eggs/EasterEgg01Chick';
import { EasterEgg02Skull } from './components/easter-eggs/EasterEgg02Skull';
import { EasterEgg03Update } from './components/easter-eggs/EasterEgg03Update';
import { soundManager } from './utils/audio';

const DesktopContainer: React.FC = () => {
  const { activeEgg } = useEasterEgg();
  const [wallpaperUrl, setWallpaperUrl] = useState<string | undefined>(undefined);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Play startup sound on first click
  const handleFirstInteraction = () => {
    if (!hasStartedAudio) {
      setHasStartedAudio(true);
      soundManager.playStartup();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onClick={handleFirstInteraction}
    >
      <Desktop wallpaperUrl={wallpaperUrl} />
      <WindowRenderer onWallpaperChange={setWallpaperUrl} />
      <Taskbar />

      {/* Easter Egg Overlays */}
      {activeEgg === 1 && <EasterEgg01Chick />}
      {activeEgg === 2 && <EasterEgg02Skull />}
      {activeEgg === 3 && <EasterEgg03Update />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FileSystemProvider>
      <WindowManagerProvider>
        <EasterEggProvider>
          <DesktopContainer />
        </EasterEggProvider>
      </WindowManagerProvider>
    </FileSystemProvider>
  );
};

export default App;
