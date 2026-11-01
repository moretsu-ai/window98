import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../../utils/audio';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const ROWS = 9;
const COLS = 9;
const TOTAL_MINES = 10;

export const Minesweeper: React.FC = () => {
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Initialize Board
  const initBoard = () => {
    soundManager.playClick();
    const newGrid: CellState[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines randomly
    let placedMines = 0;
    while (placedMines < TOTAL_MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setTimerActive(false);
  };

  useEffect(() => {
    initBoard();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || gameOver || gameWon) return;
    const interval = setInterval(() => {
      setTimer((t) => Math.min(999, t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameOver, gameWon]);

  // Reveal Cell
  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (nextGrid[r][c].isMine) {
      // Game Over: Boom!
      soundManager.playExplosion();
      // Reveal all mines
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (nextGrid[row][col].isMine) {
            nextGrid[row][col].isRevealed = true;
          }
        }
      }
      setGrid(nextGrid);
      setGameOver(true);
      return;
    }

    soundManager.playClick();

    // Flood fill algorithm
    const queue: [number, number][] = [[r, c]];
    nextGrid[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      if (nextGrid[currR][currC].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (
              nr >= 0 &&
              nr < ROWS &&
              nc >= 0 &&
              nc < COLS &&
              !nextGrid[nr][nc].isRevealed &&
              !nextGrid[nr][nc].isFlagged
            ) {
              nextGrid[nr][nc].isRevealed = true;
              if (nextGrid[nr][nc].neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    // Check Win
    let unrevealedSafeCells = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!nextGrid[row][col].isMine && !nextGrid[row][col].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    setGrid(nextGrid);

    if (unrevealedSafeCells === 0) {
      soundManager.playStartup();
      setGameWon(true);
    }
  };

  // Flag Cell
  const flagCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].isRevealed) return;
    soundManager.playClick();
    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    nextGrid[r][c].isFlagged = !nextGrid[r][c].isFlagged;
    setGrid(nextGrid);
  };

  const flaggedCount = grid.flat().filter((cell) => cell.isFlagged).length;
  const remainingMines = Math.max(0, TOTAL_MINES - flaggedCount);

  // Number colors
  const numberColors = [
    '',
    '#0000ff', // 1: Blue
    '#008000', // 2: Green
    '#ff0000', // 3: Red
    '#000080', // 4: Dark Blue
    '#800000', // 5: Maroon
    '#008080', // 6: Teal
    '#000000', // 7: Black
    '#808080', // 8: Gray
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#c0c0c0',
        padding: 6,
      }}
    >
      {/* Top Header Controls */}
      <div
        className="inset-border"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          marginBottom: 6,
          backgroundColor: '#c0c0c0',
        }}
      >
        {/* Mine Counter */}
        <div
          style={{
            backgroundColor: '#000000',
            color: '#ff0000',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 20,
            padding: '2px 4px',
            border: '1px inset #808080',
            letterSpacing: 2,
          }}
        >
          {String(remainingMines).padStart(3, '0')}
        </div>

        {/* Smiley Face Button */}
        <button
          className="win98-btn"
          style={{ width: 28, height: 28, fontSize: 16, padding: 0 }}
          onClick={initBoard}
        >
          {gameOver ? '😵' : gameWon ? '😎' : isPressing ? '😮' : '🙂'}
        </button>

        {/* Timer */}
        <div
          style={{
            backgroundColor: '#000000',
            color: '#ff0000',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 20,
            padding: '2px 4px',
            border: '1px inset #808080',
            letterSpacing: 2,
          }}
        >
          {String(timer).padStart(3, '0')}
        </div>
      </div>

      {/* Grid of Cells */}
      <div
        className="inset-border"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 22px)`,
          gridTemplateRows: `repeat(${ROWS}, 22px)`,
          gap: 1,
          backgroundColor: '#808080',
          padding: 2,
        }}
        onMouseDown={() => setIsPressing(true)}
        onMouseUp={() => setIsPressing(false)}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isRevealed = cell.isRevealed;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => flagCell(e, r, c)}
                className={isRevealed ? '' : 'win98-btn'}
                style={{
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  cursor: isRevealed ? 'default' : 'pointer',
                  backgroundColor: isRevealed
                    ? cell.isMine
                      ? '#ff0000'
                      : '#c0c0c0'
                    : '#c0c0c0',
                  boxShadow: isRevealed
                    ? 'inset 1px 1px #808080'
                    : undefined,
                  padding: 0,
                  minHeight: 0,
                }}
              >
                {cell.isFlagged && !isRevealed && '🚩'}
                {isRevealed && cell.isMine && '💣'}
                {isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                  <span style={{ color: numberColors[cell.neighborMines] }}>
                    {cell.neighborMines}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
