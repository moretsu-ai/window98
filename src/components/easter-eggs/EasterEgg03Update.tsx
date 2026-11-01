import React, { useState, useEffect, useRef } from 'react';
import { useEasterEgg } from '../../context/EasterEggContext';
import { soundManager } from '../../utils/audio';

type UpdateStage = 'progress' | 'freeze' | 'spongebob' | 'gap' | 'complete' | 'meme';

interface ProgressStep {
  percent: number;
  msg: string;
}

const progressSteps: ProgressStep[] = [
  { percent: 0, msg: 'Preparing to install updates...' },
  { percent: 12, msg: 'Downloading system updates...' },
  { percent: 28, msg: 'Installing security patches...' },
  { percent: 45, msg: 'Updating system components...' },
  { percent: 67, msg: 'Configuring Windows features...' },
  { percent: 89, msg: 'Almost done...' },
  { percent: 99, msg: 'Finalizing updates...' },
];

const humorousMessages = [
  'Optimizing your patience...',
  'Installing unnecessary updates...',
  'Checking your intelligence...',
  'Updating your coffee dependency...',
  'Calculating how much time you\'ve wasted...',
  'Searching for your common sense...',
];

const spongebobClips = [
  {
    title: '12 Seconds Later',
    src: '/spongebob/vlipsy-spongebob-squarepants-twelve-seconds-later-8fZQBuhW.mp4',
  },
  {
    title: '2 Hours Later',
    src: '/spongebob/vlipsy-spongebob-squarepants-ten-hours-later-9fwEnlag.mp4',
  },
  {
    title: '1 Eternity Later',
    src: '/spongebob/vlipsy-spongebobsquarepantsoneeternitylater-gyck95iN.mp4',
  },
];

interface MemeCard {
  caption: string;
  category: string;
  imgUrl?: string;
  emoji: string;
}

const localMemes: MemeCard[] = [
  {
    caption: 'Even Gandhi is tired of waiting.',
    category: 'Gandhi Meme',
    emoji: '🕊️',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.35 (1).jpeg',
  },
  {
    caption: 'Gandhi wondering why it\'s still 99%.',
    category: 'Gandhi Meme',
    emoji: '⏳',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.35 (1).jpeg',
  },
  {
    caption: 'Bhai, update khatam bhi hoga?',
    category: 'Indian Reaction',
    emoji: '🤯',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.34 (1).jpeg',
  },
  {
    caption: 'Abhi tak 99% pe hi hai?',
    category: 'Bollywood Reaction',
    emoji: '🤦‍♂️',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.33 (1).jpeg',
  },
  {
    caption: 'Mummy, computer kab chalega?',
    category: 'Family Patience',
    emoji: '😭',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.34.jpeg',
  },
  {
    caption: 'Itna wait toh result ke liye bhi nahi kiya.',
    category: 'Indian Student Meme',
    emoji: '📚',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.21.00.jpeg',
  },
  {
    caption: 'Yeh update hai ya UPSC preparation?',
    category: 'UPSC Aspirant Meme',
    emoji: '☕',
    imgUrl: '/documents/WhatsApp Image 2026-11-01 at 15.20.33.jpeg',
  },
];

export const EasterEgg03Update: React.FC = () => {
  const { closeActiveEgg, isMuted, toggleMute } = useEasterEgg();
  const [stage, setStage] = useState<UpdateStage>('progress');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [humorMsg, setHumorMsg] = useState<string>('');
  const [spongebobIndex, setSpongebobIndex] = useState<number>(0);
  const [currentMemeIndex, setCurrentMemeIndex] = useState<number>(() =>
    Math.floor(Math.random() * localMemes.length)
  );
  const [videoError, setVideoError] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);

  // Emergency Escape Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (videoRef.current) videoRef.current.pause();
        closeActiveEgg();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (videoRef.current) videoRef.current.pause();
    };
  }, [closeActiveEgg]);

  // Phase 1: Advance progress stages quickly (under 2s total to reach 99%)
  useEffect(() => {
    if (stage !== 'progress') return;

    if (stepIndex < progressSteps.length - 1) {
      // Fast progress: ~280ms per step
      timerRef.current = setTimeout(() => {
        setStepIndex((idx) => idx + 1);
        if (Math.random() > 0.4) {
          const randHumor = humorousMessages[Math.floor(Math.random() * humorousMessages.length)];
          setHumorMsg(randHumor);
        }
      }, 280);
    } else {
      // Reached 99% -> Pause for approximately 2 seconds as required
      setStage('freeze');
      timerRef.current = setTimeout(() => {
        setStage('spongebob');
        setSpongebobIndex(0);
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, stepIndex]);

  // Phase 2: SpongeBob Video Sequence Playback
  useEffect(() => {
    if (stage !== 'spongebob') return;
    setVideoError(false);
    setAutoplayBlocked(false);

    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented, providing continue button', err);
          setAutoplayBlocked(true);
        });
      }
    }
  }, [stage, spongebobIndex]);

  // Graceful fallback auto-advance if video errors
  useEffect(() => {
    if (videoError && stage === 'spongebob') {
      const fallbackTimer = setTimeout(() => {
        handleVideoEnded();
      }, 1500);
      return () => clearTimeout(fallbackTimer);
    }
  }, [videoError, stage, spongebobIndex]);

  const handleVideoEnded = () => {
    if (spongebobIndex < spongebobClips.length - 1) {
      // Gap between clips: approximately 0.5s (500ms)
      setStage('gap');
      timerRef.current = setTimeout(() => {
        setSpongebobIndex((idx) => idx + 1);
        setStage('spongebob');
      }, 500);
    } else {
      // All 3 clips completed -> 0.5s gap, then Move to Phase 3: Update complete
      setStage('gap');
      timerRef.current = setTimeout(() => {
        setStage('complete');
        soundManager.playStartup();
        // Briefly show UPDATE SUCCESSFUL! (~1.8 seconds)
        timerRef.current = setTimeout(() => {
          // Move to Phase 4: Meme reveal
          setStage('meme');
        }, 1800);
      }, 500);
    }
  };

  const handleNextMeme = () => {
    soundManager.playClick();
    setCurrentMemeIndex((prev) => (prev + 1) % localMemes.length);
  };

  const currentStep = progressSteps[stepIndex] || progressSteps[0];
  const currentClip = spongebobClips[spongebobIndex];
  const meme = localMemes[currentMemeIndex];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: stage === 'meme' ? '#000000' : '#0078d7',
        color: '#ffffff',
        zIndex: 1000000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe UI", Arial, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Top right escape hint and audio control */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <button
          onClick={toggleMute}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 11,
          }}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        <span>Press <strong>Esc</strong> to exit</span>
      </div>

      {/* Phase 1 & Freeze: Update Screen */}
      {(stage === 'progress' || stage === 'freeze') && (
        <div style={{ textAlign: 'center', maxWidth: 460, padding: 20 }}>
          {/* Windows Circular Loading Spinner */}
          <div style={{ display: 'inline-block', marginBottom: 28 }}>
            <div className="update-spinner" />
          </div>

          <div style={{ fontSize: 38, fontWeight: 300, marginBottom: 12 }}>
            Working on updates {currentStep.percent}%
          </div>

          <div style={{ fontSize: 16, fontWeight: 300, marginBottom: 8, color: '#e0e0e0' }}>
            {currentStep.msg}
          </div>

          {humorMsg && (
            <div style={{ fontSize: 14, color: '#a0d8ef', fontStyle: 'italic', marginBottom: 14 }}>
              {humorMsg}
            </div>
          )}

          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 24 }}>
            Please don't turn off your computer.
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            Your PC will restart several times.
          </div>
        </div>
      )}

      {/* Gap between clips (0.5s black transition) */}
      {stage === 'gap' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
          }}
        />
      )}

      {/* Phase 2: SpongeBob Video Player Sequence */}
      {stage === 'spongebob' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}
        >
          {!videoError ? (
            <video
              ref={videoRef}
              key={currentClip.src}
              src={currentClip.src}
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnded}
              onError={() => setVideoError(true)}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
              }}
            />
          ) : (
            // Fallback Title Card if video element fails
            <div
              style={{
                width: 480,
                height: 320,
                backgroundColor: '#002040',
                border: '4px solid #fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 20,
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              <div style={{ fontSize: 32, color: '#ffdd00', fontWeight: 'bold' }}>
                {currentClip.title}
              </div>
              <button
                className="win98-btn"
                style={{ marginTop: 20, fontSize: 14 }}
                onClick={handleVideoEnded}
              >
                Continue ▶
              </button>
            </div>
          )}

          {/* Autoplay fallback button */}
          {autoplayBlocked && !videoError && (
            <button
              className="win98-btn"
              style={{
                position: 'absolute',
                bottom: 30,
                padding: '8px 20px',
                fontSize: 14,
                backgroundColor: '#ffcc00',
              }}
              onClick={() => {
                setAutoplayBlocked(false);
                videoRef.current?.play();
              }}
            >
              Click to Play ({currentClip.title}) ▶
            </button>
          )}

          <div style={{ position: 'absolute', bottom: 10, fontSize: 11, color: '#666' }}>
            Clip {spongebobIndex + 1} of 3: {currentClip.title}
          </div>
        </div>
      )}

      {/* Phase 3: Update Complete (100%) */}
      {stage === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 38, fontWeight: 300, marginBottom: 8 }}>
            Working on updates 100%
          </div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#aaffaa' }}>
            UPDATE SUCCESSFUL!
          </div>
        </div>
      )}

      {/* Phase 4: Meme Reveal */}
      {stage === 'meme' && (
        <div
          className="win98-window"
          style={{
            maxWidth: 520,
            backgroundColor: '#c0c0c0',
            padding: 16,
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(255,255,255,0.3)',
            color: '#000000',
          }}
        >
          <div className="win98-titlebar active" style={{ marginBottom: 12 }}>
            <span className="win98-title-text">Windows 98 Troll Alert</span>
            <button className="win98-title-btn" onClick={closeActiveEgg}>
              ✕
            </button>
          </div>

          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#cc0000', marginBottom: 4 }}>
            HAHAHA! YOU GOT TROLLED! 😂
          </div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#000080', marginBottom: 6 }}>
            Your PC was never updating.
          </div>
          <div style={{ fontSize: 12, color: '#333', marginBottom: 12 }}>
            Nothing happened to your files. Congratulations! You just wasted your precious time.
          </div>

          {/* Meme Card */}
          <div
            className="inset-border"
            style={{
              backgroundColor: '#ffffff',
              padding: 12,
              marginBottom: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {meme.imgUrl ? (
              <img
                src={meme.imgUrl}
                alt="Meme"
                style={{
                  maxHeight: 220,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  border: '1px solid #808080',
                  marginBottom: 8,
                }}
              />
            ) : (
              <div style={{ fontSize: 48, margin: '14px 0' }}>{meme.emoji}</div>
            )}
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000080', marginTop: 4 }}>
              "{meme.caption}"
            </div>
            <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{meme.category}</div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button
              className="win98-btn"
              style={{ padding: '6px 14px', fontWeight: 'bold' }}
              onClick={handleNextMeme}
            >
              SHOW ANOTHER MEME
            </button>
            <button
              className="win98-btn"
              style={{ padding: '6px 18px', fontWeight: 'bold', backgroundColor: '#000080', color: '#ffffff' }}
              onClick={closeActiveEgg}
            >
              HAHA, OK!
            </button>
          </div>
        </div>
      )}

      <style>{`
        .update-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.25);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
