import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type EasterEggId = 0 | 1 | 2 | 3;

interface EasterEggContextType {
  activeEgg: EasterEggId;
  triggerEgg1: () => void;
  triggerEgg2: () => void;
  triggerEgg3: () => void;
  closeActiveEgg: () => void;
  egg1ClickCount: number;
  handleSettingsIconClick: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export const EasterEggProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeEgg, setActiveEgg] = useState<EasterEggId>(0);
  const [isMuted, setIsMuted] = useState(false);
  const settingsClicksRef = useRef<number>(0);
  const settingsClickTimerRef = useRef<any>(null);
  const [egg1ClickCount, setEgg1ClickCount] = useState(0);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const closeActiveEgg = useCallback(() => {
    setActiveEgg(0);
  }, []);

  const triggerEgg1 = useCallback(() => {
    if (activeEgg !== 0) return;
    setActiveEgg(1);
  }, [activeEgg]);

  const triggerEgg2 = useCallback(() => {
    if (activeEgg !== 0) return;
    setActiveEgg(2);
  }, [activeEgg]);

  const triggerEgg3 = useCallback(() => {
    if (activeEgg !== 0) return;
    setActiveEgg(3);
  }, [activeEgg]);

  // Click Settings / Control Panel 3 times to trigger Egg 1
  const handleSettingsIconClick = useCallback(() => {
    if (activeEgg !== 0) return;
    settingsClicksRef.current += 1;
    setEgg1ClickCount(settingsClicksRef.current);

    if (settingsClickTimerRef.current) {
      clearTimeout(settingsClickTimerRef.current);
    }

    if (settingsClicksRef.current >= 3) {
      settingsClicksRef.current = 0;
      setEgg1ClickCount(0);
      triggerEgg1();
    } else {
      settingsClickTimerRef.current = setTimeout(() => {
        settingsClicksRef.current = 0;
        setEgg1ClickCount(0);
      }, 1500); // 1.5s window to register triple click
    }
  }, [activeEgg, triggerEgg1]);

  // Global Keyboard Listener for Ctrl + Shift + Option/Alt + U (Egg 3) and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes any active Easter Egg
      if (e.key === 'Escape' && activeEgg !== 0) {
        e.preventDefault();
        closeActiveEgg();
        return;
      }

      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check shortcut Ctrl + Shift + Alt + U
      // On macOS Option + U produces diaeresis, so we check e.code === 'KeyU' as well as e.key 'u'
      const isUKey = e.code === 'KeyU' || e.key.toLowerCase() === 'u' || e.key === 'u';
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.altKey &&
        isUKey
      ) {
        e.preventDefault();
        triggerEgg3();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEgg, closeActiveEgg, triggerEgg3]);

  return (
    <EasterEggContext.Provider
      value={{
        activeEgg,
        triggerEgg1,
        triggerEgg2,
        triggerEgg3,
        closeActiveEgg,
        egg1ClickCount,
        handleSettingsIconClick,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) throw new Error('useEasterEgg must be used within EasterEggProvider');
  return context;
};
