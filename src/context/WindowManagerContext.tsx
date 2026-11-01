import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AppId, WindowInstance } from '../types/window';
import { soundManager } from '../utils/audio';

interface WindowManagerContextType {
  windows: WindowInstance[];
  activeWindowId: string | null;
  openWindow: (appId: AppId, title?: string, initialParams?: any) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const appDefaultConfigs: Record<AppId, { title: string; width: number; height: number }> = {
  'my-computer': { title: 'My Computer', width: 500, height: 360 },
  'file-explorer': { title: 'Exploring - C:\\', width: 620, height: 420 },
  'notepad': { title: 'Untitled - Notepad', width: 520, height: 380 },
  'paint': { title: 'untitled - Paint', width: 680, height: 480 },
  'calculator': { title: 'Calculator', width: 280, height: 320 },
  'control-panel': { title: 'Control Panel', width: 520, height: 380 },
  'internet-explorer': { title: 'Microsoft Internet Explorer', width: 720, height: 500 },
  'minesweeper': { title: 'Minesweeper', width: 240, height: 330 },
  'solitaire': { title: 'Solitaire', width: 660, height: 480 },
  'snake': { title: 'Nokia Snake 98', width: 340, height: 420 },
  'image-viewer': { title: 'Imaging Preview', width: 580, height: 450 },
  'document-viewer': { title: 'Document Viewer', width: 640, height: 480 },
  'shutdown': { title: 'Shut Down Windows', width: 360, height: 210 },
  'run': { title: 'Run', width: 380, height: 180 },
  'help': { title: 'Windows Help', width: 500, height: 380 },
  'find': { title: 'Find: All Files', width: 500, height: 360 },
  'retro-chat': { title: '#dandi-march-1930 - mIRC', width: 560, height: 400 },
  'retro-spreadsheet': { title: 'Microsoft Excel 97', width: 640, height: 440 },
  'operation-salt': { title: 'OPERATION_SALT.EXE', width: 580, height: 420 },
  'unseen-footage': { title: '07_UNSEEN_FOOTAGE Gallery', width: 620, height: 460 },
};

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const nextZIndex = useRef<number>(10);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    nextZIndex.current += 1;
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, zIndex: nextZIndex.current, isMinimized: false };
        }
        return win;
      })
    );
  }, []);

  const openWindow = useCallback(
    (appId: AppId, titleOverride?: string, initialParams?: any): string => {
      soundManager.playClick();
      // If single-instance apps like shutdown or run are already open, focus them
      if (['shutdown', 'run', 'control-panel', 'minesweeper', 'snake'].includes(appId)) {
        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
          focusWindow(existing.id);
          return existing.id;
        }
      }

      const id = `${appId}-${Date.now()}`;
      const config = appDefaultConfigs[appId] || { title: 'Application', width: 500, height: 380 };
      const title = titleOverride || config.title;

      // Cascade window placement
      const offset = (windows.length % 8) * 26 + 40;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

      const width = Math.min(config.width, screenW - 40);
      const height = Math.min(config.height, screenH - 70);
      const x = Math.min(offset, screenW - width - 20);
      const y = Math.min(offset, screenH - height - 40);

      nextZIndex.current += 1;
      const newWin: WindowInstance = {
        id,
        appId,
        title,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex.current,
        x: Math.max(10, x),
        y: Math.max(10, y),
        width,
        height,
        initialParams,
      };

      setWindows((prev) => [...prev, newWin]);
      setActiveWindowId(id);
      return id;
    },
    [windows, focusWindow]
  );

  const closeWindow = useCallback(
    (id: string) => {
      soundManager.playClick();
      setWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (activeWindowId === id) {
          // Focus the top window among remaining visible windows
          const visible = remaining.filter((w) => !w.isMinimized);
          if (visible.length > 0) {
            const top = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
            setActiveWindowId(top.id);
          } else {
            setActiveWindowId(null);
          }
        }
        return remaining;
      });
    },
    [activeWindowId]
  );

  const minimizeWindow = useCallback(
    (id: string) => {
      soundManager.playClick();
      setWindows((prev) =>
        prev.map((win) => {
          if (win.id === id) {
            return { ...win, isMinimized: true };
          }
          return win;
        })
      );
      if (activeWindowId === id) {
        setWindows((prev) => {
          const visible = prev.filter((w) => w.id !== id && !w.isMinimized);
          if (visible.length > 0) {
            const top = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
            setActiveWindowId(top.id);
          } else {
            setActiveWindowId(null);
          }
          return prev;
        });
      }
    },
    [activeWindowId]
  );

  const maximizeWindow = useCallback((id: string) => {
    soundManager.playClick();
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, isMaximized: !win.isMaximized, isMinimized: false };
        }
        return win;
      })
    );
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, x, y };
        }
        return win;
      })
    );
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id === id) {
          return { ...win, width, height };
        }
        return win;
      })
    );
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updatePosition,
        updateSize,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return context;
};
