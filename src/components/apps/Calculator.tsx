import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0.');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [historySequence, setHistorySequence] = useState<string>('');

  const inputDigit = (digit: string) => {
    soundManager.playClick();
    setHistorySequence((prev) => (prev + digit).slice(-6));
    if (waitingForOperand) {
      setDisplay(digit + '.');
      setWaitingForOperand(false);
    } else {
      const clean = display.replace(/\.$/, '');
      setDisplay(clean === '0' ? digit + '.' : clean + digit + '.');
    }
  };

  const inputDecimal = () => {
    soundManager.playClick();
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    soundManager.playClick();
    setDisplay('0.');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    soundManager.playClick();
    setDisplay('0.');
  };

  const backspace = () => {
    soundManager.playClick();
    const clean = display.replace(/\.$/, '');
    if (clean.length > 1) {
      setDisplay(clean.slice(0, -1) + '.');
    } else {
      setDisplay('0.');
    }
  };

  const performOperation = (nextOp: string) => {
    soundManager.playClick();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const current = prevValue || 0;
      let newValue = current;

      if (operation === '+') newValue = current + inputValue;
      else if (operation === '-') newValue = current - inputValue;
      else if (operation === '*') newValue = current * inputValue;
      else if (operation === '/') newValue = inputValue !== 0 ? current / inputValue : 0;

      // Hidden discovery: 1998 =
      if (historySequence.includes('1998') && nextOp === '=') {
        soundManager.playStartup();
        setDisplay('WIN98 RULEZ!');
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue) + (String(newValue).includes('.') ? '' : '.'));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  };

  const handleSqrt = () => {
    soundManager.playClick();
    const val = parseFloat(display);
    if (val >= 0) {
      const res = Math.sqrt(val);
      setDisplay(String(res) + (String(res).includes('.') ? '' : '.'));
      setWaitingForOperand(true);
    }
  };

  const handleInverse = () => {
    soundManager.playClick();
    const val = parseFloat(display);
    if (val !== 0) {
      const res = 1 / val;
      setDisplay(String(res) + (String(res).includes('.') ? '' : '.'));
      setWaitingForOperand(true);
    }
  };

  const handleToggleSign = () => {
    soundManager.playClick();
    const val = parseFloat(display);
    const res = -val;
    setDisplay(String(res) + (String(res).includes('.') ? '' : '.'));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        performOperation('=');
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operation, waitingForOperand, historySequence]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0', padding: 4 }}>
      {/* Menu Bar */}
      <div className="win98-menubar" style={{ marginBottom: 4 }}>
        <span className="win98-menu-item">Edit</span>
        <span className="win98-menu-item">View</span>
        <span className="win98-menu-item">Help</span>
      </div>

      {/* LCD Display */}
      <div
        className="inset-border"
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: '"Share Tech Mono", monospace, "Courier New"',
          fontSize: 18,
          textAlign: 'right',
          padding: '6px 8px',
          marginBottom: 6,
          minHeight: 34,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {display}
      </div>

      {/* Top Row: Backspace, CE, C */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
          {memory !== 0 ? 'M' : ''}
        </div>
        <button className="win98-btn" style={{ flex: 1, color: '#cc0000' }} onClick={backspace}>
          Backspace
        </button>
        <button className="win98-btn" style={{ flex: 1, color: '#cc0000' }} onClick={clearEntry}>
          CE
        </button>
        <button className="win98-btn" style={{ flex: 1, color: '#cc0000' }} onClick={clearAll}>
          C
        </button>
      </div>

      {/* Keypad Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3, flex: 1 }}>
        {/* Row 1 */}
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => { soundManager.playClick(); setMemory(0); }}>MC</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('7')}>7</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('8')}>8</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('9')}>9</button>
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => performOperation('/')}>/</button>

        {/* Row 2 */}
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => { soundManager.playClick(); setDisplay(String(memory) + '.'); setWaitingForOperand(true); }}>MR</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('4')}>4</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('5')}>5</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('6')}>6</button>
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => performOperation('*')}>*</button>

        {/* Row 3 */}
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => { soundManager.playClick(); setMemory(parseFloat(display)); }}>MS</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('1')}>1</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('2')}>2</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('3')}>3</button>
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => performOperation('-')}>-</button>

        {/* Row 4 */}
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => { soundManager.playClick(); setMemory((prev) => prev + parseFloat(display)); }}>M+</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={() => inputDigit('0')}>0</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={handleToggleSign}>+/-</button>
        <button className="win98-btn" style={{ color: '#0000aa', fontWeight: 'bold' }} onClick={inputDecimal}>.</button>
        <button className="win98-btn" style={{ color: '#cc0000' }} onClick={() => performOperation('+')}>+</button>
      </div>

      {/* Row 5 (Functions & Equals) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, marginTop: 3 }}>
        <button className="win98-btn" style={{ color: '#0000aa' }} onClick={handleSqrt}>sqrt</button>
        <button className="win98-btn" style={{ color: '#0000aa' }} onClick={() => performOperation('/')}>%</button>
        <button className="win98-btn" style={{ color: '#0000aa' }} onClick={handleInverse}>1/x</button>
        <button className="win98-btn" style={{ color: '#cc0000', fontWeight: 'bold' }} onClick={() => performOperation('=')}>=</button>
      </div>
    </div>
  );
};
