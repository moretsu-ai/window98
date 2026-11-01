import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

export const OperationSalt: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [grainsSynthesized, setGrainsSynthesized] = useState<number>(1);

  useEffect(() => {
    soundManager.playClick();
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => {
      setStep(3);
      soundManager.playStartup();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSynthesizeMore = () => {
    soundManager.playClick();
    setGrainsSynthesized((g) => g + 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0a101d',
        color: '#33ff33',
        fontFamily: '"Courier New", Courier, monospace',
        padding: 12,
        overflowY: 'auto',
      }}
    >
      {/* Disclaimer */}
      <div
        style={{
          border: '1px solid #ffcc00',
          padding: '4px 8px',
          color: '#ffcc00',
          marginBottom: 12,
          fontSize: 11,
          backgroundColor: 'rgba(255,204,0,0.1)',
        }}
      >
        [FICTIONAL PARODY ARCHIVE // HARMLESS RETRO SIMULATION]
        <br />
        This program does NOT alter local files or execute real system commands.
      </div>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        C:\PROJECT_DANDI_CLASSIFIED&gt; OPERATION_SALT.EXE -v --ahimsa-mode
      </div>

      {step >= 1 && (
        <div style={{ marginBottom: 8, color: '#a0ffa0' }}>
          [+] Initializing Mission Parameters...
          <br />
          &nbsp;&nbsp;&nbsp;&bull; Route: Sabarmati Ashram &rarr; Dandi Seashore
          <br />
          &nbsp;&nbsp;&nbsp;&bull; March Distance: 240 Miles on Foot
          <br />
          &nbsp;&nbsp;&nbsp;&bull; Force: 78 Marchers (Expanding to Millions)
          <br />
          &nbsp;&nbsp;&nbsp;&bull; Weaponry: Truth (Satya) &amp; Non-Violence (Ahimsa)
        </div>
      )}

      {step >= 2 && (
        <div style={{ marginBottom: 8, color: '#ffff33' }}>
          [*] Boiling Arabian Seawater in Brass Vessel...
          <br />
          [*] Evaporating H2O molecules...
          <br />
          [*] Crystallizing pure sodium chloride (NaCl)...
        </div>
      )}

      {step >= 3 && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            border: '2px solid #33ff33',
            backgroundColor: 'rgba(0, 255, 0, 0.05)',
            position: 'relative',
          }}
        >
          {/* Red stamp */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 14,
              border: '3px solid #ff3333',
              color: '#ff3333',
              padding: '4px 10px',
              fontWeight: 'bold',
              fontSize: 14,
              transform: 'rotate(12deg)',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            DECLASSIFIED
          </div>

          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 }}>
            ★ MISSION ACCOMPLISHED! ★
          </div>

          <div style={{ fontSize: 13, color: '#aaffaa', lineHeight: 1.5 }}>
            Status: <strong>SALT LAW DEFIED WITHOUT A SINGLE WEAPON!</strong>
            <br />
            British Salt Monopoly: <strong>DISRUPTED</strong>
            <br />
            Total Free Grains of Salt Synthesized: <strong>{grainsSynthesized.toLocaleString()}</strong>
          </div>

          <p style={{ fontStyle: 'italic', color: '#ffea70', marginTop: 10 }}>
            "With this handful of salt, I am shaking the foundations of the British Empire."
            <br />
            — Mahatma Gandhi, Dandi (April 6, 1930)
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              className="win98-btn"
              style={{ padding: '6px 12px', color: '#000', fontWeight: 'bold' }}
              onClick={handleSynthesizeMore}
            >
              🧂 Synthesize Another Grain of Salt (+1)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

