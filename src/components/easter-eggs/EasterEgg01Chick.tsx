import React, { useState, useEffect, useRef } from 'react';
import { useEasterEgg } from '../../context/EasterEggContext';
import { soundManager } from '../../utils/audio';

export const EasterEgg01Chick: React.FC = () => {
  const { closeActiveEgg } = useEasterEgg();
  const [clickCount, setClickCount] = useState<number>(0);
  const [isHatched, setIsHatched] = useState<boolean>(false);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const autoCloseTimerRef = useRef<any>(null);

  // Handle clicking the egg
  const handleEggClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playClick();
    if (clickCount < 4) {
      setClickCount((c) => c + 1);
    } else if (!isHatched) {
      // 5th click cracks egg open!
      setClickCount(5);
      setIsHatched(true);

      // Play audio for max 10 seconds
      const stopFn = soundManager.playChickSong();
      stopAudioRef.current = stopFn;

      autoCloseTimerRef.current = setTimeout(() => {
        handleClose();
      }, 9500);
    }
  };

  const handleClose = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    closeActiveEgg();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        zIndex: 1000000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        // Prevent clicks intended for the Easter egg from propagating through to desktop icons
        e.stopPropagation();
      }}
    >
      <div
        className="win98-window"
        style={{
          padding: 16,
          backgroundColor: '#c0c0c0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '4px 4px 16px rgba(0,0,0,0.6)',
          minWidth: 320,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="win98-titlebar active" style={{ width: '100%', marginBottom: 12 }}>
          <span className="win98-title-text">Easter Egg 01 — Hatching!</span>
          <button className="win98-title-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Animated Bouncing Egg or Chick */}
        <div
          style={{
            position: 'relative',
            width: 160,
            height: 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !isHatched ? 'pointer' : 'default',
          }}
          onClick={!isHatched ? handleEggClick : undefined}
        >
          {!isHatched ? (
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'bounce 0.8s infinite alternate ease-in-out',
                padding: 10,
              }}
            >
              <svg width="100" height="130" viewBox="0 0 100 130">
                {/* Egg Shell */}
                <ellipse cx="50" cy="70" rx="42" ry="54" fill="#fff5d7" stroke="#806030" strokeWidth="2" />
                {/* Cracks advancing with clicks */}
                {clickCount >= 1 && (
                  <path d="M50 35 L44 50 L56 60" stroke="#806030" strokeWidth="2.5" fill="none" />
                )}
                {clickCount >= 2 && (
                  <path d="M56 60 L42 75 L62 85" stroke="#806030" strokeWidth="2.5" fill="none" />
                )}
                {clickCount >= 3 && (
                  <path d="M62 85 L35 100 L55 110" stroke="#806030" strokeWidth="2.5" fill="none" />
                )}
                {clickCount >= 4 && (
                  <path d="M44 50 L20 60 M56 60 L80 55" stroke="#806030" strokeWidth="2.5" fill="none" />
                )}
              </svg>
              {/* Shadow */}
              <div
                style={{
                  width: 70,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  marginTop: -6,
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'hop 0.4s infinite alternate ease-in-out',
              }}
            >
              {/* Baby Chick */}
              <svg width="110" height="130" viewBox="0 0 110 130">
                {/* Broken bottom shell */}
                <path d="M20 95 L30 85 L45 95 L60 85 L75 95 L90 85 L85 120 C85 125, 25 125, 25 120 Z" fill="#fff5d7" stroke="#806030" strokeWidth="2" />
                {/* Chick Body */}
                <circle cx="55" cy="70" r="32" fill="#ffe033" stroke="#cc9900" strokeWidth="2" />
                {/* Chick Head */}
                <circle cx="55" cy="42" r="24" fill="#ffe033" stroke="#cc9900" strokeWidth="2" />
                {/* Eyes */}
                <circle cx="47" cy="38" r="3" fill="#000" />
                <circle cx="63" cy="38" r="3" fill="#000" />
                <circle cx="48" cy="37" r="1" fill="#fff" />
                <circle cx="64" cy="37" r="1" fill="#fff" />
                {/* Orange Beak */}
                <polygon points="50,44 60,44 55,52" fill="#ff6600" stroke="#cc3300" strokeWidth="1" />
                {/* Cute Wings */}
                <ellipse cx="26" cy="72" rx="8" ry="14" fill="#ffd400" transform="rotate(-20 26 72)" />
                <ellipse cx="84" cy="72" rx="8" ry="14" fill="#ffd400" transform="rotate(20 84 72)" />
              </svg>
            </div>
          )}
        </div>

        {/* Message */}
        <div style={{ marginTop: 14, textAlign: 'center', minHeight: 38 }}>
          {!isHatched ? (
            <div style={{ fontSize: 12, fontWeight: 'bold' }}>
              Click the egg to hatch it! ({5 - clickCount} clicks left)
            </div>
          ) : (
            <div style={{ fontSize: 20, color: '#cc6600', fontWeight: 'bold', animation: 'pulse 0.5s infinite alternate' }}>
              "Peep-peep!" 🐣
            </div>
          )}
        </div>

        <button className="win98-btn" style={{ marginTop: 10, minWidth: 80 }} onClick={handleClose}>
          Close
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
        @keyframes hop {
          0% { transform: translateY(0) scale(1, 0.95); }
          100% { transform: translateY(-10px) scale(0.95, 1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
