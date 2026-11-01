import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../../utils/audio';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 18;

export const Snake: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const [food, setFood] = useState<Point>({ x: 14, y: 9 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const dirRef = useRef<Direction>('RIGHT');

  const spawnFood = (currentSnake: Point[]): Point => {
    while (true) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      if (!currentSnake.some((p) => p.x === rx && p.y === ry)) {
        return { x: rx, y: ry };
      }
    }
  };

  const startGame = () => {
    soundManager.playClick();
    const initialSnake = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const changeDir = (newDir: Direction) => {
    if (
      (newDir === 'UP' && dirRef.current !== 'DOWN') ||
      (newDir === 'DOWN' && dirRef.current !== 'UP') ||
      (newDir === 'LEFT' && dirRef.current !== 'RIGHT') ||
      (newDir === 'RIGHT' && dirRef.current !== 'LEFT')
    ) {
      setDirection(newDir);
      dirRef.current = newDir;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        changeDir('UP');
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        changeDir('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        changeDir('LEFT');
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        changeDir('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dirRef.current === 'UP') head.y -= 1;
        else if (dirRef.current === 'DOWN') head.y += 1;
        else if (dirRef.current === 'LEFT') head.x -= 1;
        else if (dirRef.current === 'RIGHT') head.x += 1;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          soundManager.playError();
          setIsGameOver(true);
          setIsPlaying(false);
          return prev;
        }

        // Collision with self
        if (prev.some((p) => p.x === head.x && p.y === head.y)) {
          soundManager.playError();
          setIsGameOver(true);
          setIsPlaying(false);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          soundManager.playClick();
          const nextScore = score + 10;
          setScore(nextScore);
          if (nextScore > highScore) setHighScore(nextScore);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, score, highScore]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#2d3748',
        padding: 10,
        fontFamily: '"Share Tech Mono", monospace',
      }}
    >
      {/* Nokia Screen Frame */}
      <div
        className="inset-border"
        style={{
          width: 260,
          backgroundColor: '#9bbb59',
          border: '4px solid #556b2f',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#1a3300',
        }}
      >
        {/* Scoreboard */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '1px solid #708530',
            paddingBottom: 4,
            marginBottom: 4,
          }}
        >
          <span>SCORE: {score}</span>
          <span>HIGH: {highScore}</span>
        </div>

        {/* LCD Pixel Grid */}
        <div
          style={{
            width: 216,
            height: 216,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 12px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 12px)`,
            backgroundColor: '#8da850',
            border: '2px solid #1a3300',
            position: 'relative',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((p) => p.x === x && p.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: isHead
                    ? '#0f2200'
                    : isBody
                    ? '#1a3300'
                    : isFood
                    ? '#0f2200'
                    : 'transparent',
                  borderRadius: isFood ? '50%' : isHead ? 2 : 1,
                }}
              />
            );
          })}

          {!isPlaying && !isGameOver && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(155, 187, 89, 0.85)',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>NOKIA SNAKE 98</div>
              <button className="win98-btn" onClick={startGame} style={{ marginTop: 10 }}>
                Press Start
              </button>
            </div>
          )}

          {isGameOver && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(155, 187, 89, 0.85)',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>GAME OVER!</div>
              <div style={{ fontSize: 12, margin: '4px 0' }}>Final Score: {score}</div>
              <button className="win98-btn" onClick={startGame} style={{ marginTop: 6 }}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Retro D-Pad On-Screen Controls */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button className="win98-btn" onClick={() => changeDir('UP')} style={{ width: 44, height: 26 }}>
          ▲
        </button>
        <div style={{ display: 'flex', gap: 14 }}>
          <button className="win98-btn" onClick={() => changeDir('LEFT')} style={{ width: 44, height: 26 }}>
            ◀
          </button>
          <button className="win98-btn" onClick={() => changeDir('RIGHT')} style={{ width: 44, height: 26 }}>
            ▶
          </button>
        </div>
        <button className="win98-btn" onClick={() => changeDir('DOWN')} style={{ width: 44, height: 26 }}>
          ▼
        </button>
      </div>
    </div>
  );
};
