import React, { useState, useEffect, useRef } from 'react';
import { useEasterEgg } from '../../context/EasterEggContext';
import { soundManager } from '../../utils/audio';

type SkullPhase = 1 | 2 | 3;

export const EasterEgg02Skull: React.FC = () => {
  const { closeActiveEgg } = useEasterEgg();
  const [phase, setPhase] = useState<SkullPhase>(1);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<any>(null);

  // Phase 1: Black screen (~2s)
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // Transition to Phase 2: Screaming Skull (~5s)
      setPhase(2);
      const stopFn = soundManager.playVirusAlarm();
      stopAudioRef.current = stopFn;

      timerRef.current = setTimeout(() => {
        if (stopAudioRef.current) {
          stopAudioRef.current();
          stopAudioRef.current = null;
        }
        // Transition to Phase 3: Reveal (~4s)
        setPhase(3);

        timerRef.current = setTimeout(() => {
          handleClose();
        }, 4000);
      }, 5000);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (stopAudioRef.current) stopAudioRef.current();
    };
  }, []);

  const handleClose = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    closeActiveEgg();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        zIndex: 1000000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      onClick={handleClose}
    >
      {/* Phase 1: Pure Black Screen */}
      {phase === 1 && (
        <div style={{ color: '#00ff00', fontFamily: 'monospace', fontSize: 13 }}>
          &nbsp;
        </div>
      )}

      {/* Phase 2: Animated Screaming Skull with Independent Lower Jaw */}
      {phase === 2 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'screenShake 0.12s infinite ease-in-out',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Skull Container */}
          <div
            style={{
              position: 'relative',
              width: 340,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Upper Cranium (Stationary) */}
            <div
              style={{
                width: 300,
                height: 226,
                backgroundImage: 'url("/skull_upper.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                zIndex: 2,
              }}
            />

            {/* Black mouth interior backing */}
            <div
              style={{
                position: 'absolute',
                top: 170,
                width: 140,
                height: 120,
                backgroundColor: '#000000',
                zIndex: 1,
                borderRadius: '0 0 40px 40px',
              }}
            />

            {/* Lower Jaw (Independently Animated Screaming / Laughing) */}
            <div
              style={{
                width: 300,
                height: 156,
                backgroundImage: 'url("/skull_jaw.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center bottom',
                marginTop: -40,
                zIndex: 3,
                animation: 'jawChomp 0.22s infinite alternate ease-in-out',
                transformOrigin: 'top center',
              }}
            />
          </div>

          <div
            style={{
              color: '#ff0000',
              fontFamily: 'monospace',
              fontSize: 22,
              fontWeight: 'bold',
              letterSpacing: 3,
              marginTop: 16,
              textShadow: '0 0 10px #ff0000',
              animation: 'textFlicker 0.2s infinite alternate',
            }}
          >
            CRITICAL SYSTEM ANOMALY!
          </div>
        </div>
      )}

      {/* Phase 3: The Reveal */}
      {phase === 3 && (
        <div
          className="win98-window"
          style={{
            backgroundColor: '#c0c0c0',
            padding: 24,
            maxWidth: 460,
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(255,255,255,0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>😂</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#000080', marginBottom: 4 }}>
            GOT YOU! 😂
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#cc0000', marginBottom: 14 }}>
            JUST KIDDING!
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>
            Your computer is perfectly safe.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: '#333', marginBottom: 18 }}>
            No files were harmed. Welcome back to Windows 98!
          </p>

          <button
            className="win98-btn"
            style={{ padding: '6px 20px', fontSize: 12, fontWeight: 'bold' }}
            onClick={handleClose}
            autoFocus
          >
            Return to Desktop
          </button>
        </div>
      )}

      <style>{`
        @keyframes screenShake {
          0% { transform: translate(-2px, 1px) rotate(0deg); }
          50% { transform: translate(2px, -2px) rotate(0.5deg); }
          100% { transform: translate(-1px, 2px) rotate(-0.5deg); }
        }
        @keyframes jawChomp {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(32px) rotate(-2deg); }
        }
        @keyframes textFlicker {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
