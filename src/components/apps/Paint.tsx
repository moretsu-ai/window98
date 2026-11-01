import React, { useRef, useState, useEffect } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { soundManager } from '../../utils/audio';

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'circle' | 'fill';

const classicColors = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000', '#ffffff', '#c0c0c0',
  '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80',
  '#80ffff', '#7f7fff', '#ff0080', '#ff8040',
];

export const Paint: React.FC = () => {
  const { writeFile } = useFileSystem();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [primaryColor, setPrimaryColor] = useState<string>('#000000');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const color = e.button === 2 ? secondaryColor : primaryColor;

    setIsDrawing(true);
    setStartPos(coords);
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = currentTool === 'eraser' ? lineWidth * 3 : currentTool === 'brush' ? lineWidth * 2 : 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (currentTool === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const color = e.buttons === 2 ? secondaryColor : primaryColor;

    if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = currentTool === 'eraser' ? lineWidth * 3 : currentTool === 'brush' ? lineWidth * 2 : 1;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      // Shape tools: restore snapshot first
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.fillStyle = secondaryColor;
      ctx.lineWidth = lineWidth;

      if (currentTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (currentTool === 'rect') {
        const w = coords.x - startPos.x;
        const h = coords.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (currentTool === 'circle') {
        const rx = Math.abs(coords.x - startPos.x) / 2;
        const ry = Math.abs(coords.y - startPos.y) / 2;
        const cx = Math.min(startPos.x, coords.x) + rx;
        const cy = Math.min(startPos.y, coords.y) + ry;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  const handleClear = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const filename = `Artwork_${Date.now().toString().slice(-4)}.png`;
    const path = `C:\\My Documents\\My Pictures\\${filename}`;
    writeFile(path, dataUrl, 'image/png');
    alert(`Image saved to:\n${path}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win98-menubar">
        <span className="win98-menu-item" onClick={handleSave}>Save</span>
        <span className="win98-menu-item" onClick={handleClear}>Clear</span>
        <span className="win98-menu-item">Image</span>
        <span className="win98-menu-item">Help</span>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Toolbar */}
        <div
          style={{
            width: 56,
            backgroundColor: '#c0c0c0',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            borderRight: '1px solid #808080',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <button
              className={`win98-btn ${currentTool === 'pencil' ? 'active' : ''}`}
              onClick={() => setCurrentTool('pencil')}
              title="Pencil"
              style={{ padding: 2, height: 24 }}
            >
              ✏️
            </button>
            <button
              className={`win98-btn ${currentTool === 'brush' ? 'active' : ''}`}
              onClick={() => setCurrentTool('brush')}
              title="Brush"
              style={{ padding: 2, height: 24 }}
            >
              🖌️
            </button>
            <button
              className={`win98-btn ${currentTool === 'eraser' ? 'active' : ''}`}
              onClick={() => setCurrentTool('eraser')}
              title="Eraser"
              style={{ padding: 2, height: 24 }}
            >
              🧹
            </button>
            <button
              className={`win98-btn ${currentTool === 'fill' ? 'active' : ''}`}
              onClick={() => setCurrentTool('fill')}
              title="Fill Color"
              style={{ padding: 2, height: 24 }}
            >
              🪣
            </button>
            <button
              className={`win98-btn ${currentTool === 'line' ? 'active' : ''}`}
              onClick={() => setCurrentTool('line')}
              title="Line"
              style={{ padding: 2, height: 24 }}
            >
              ╱
            </button>
            <button
              className={`win98-btn ${currentTool === 'rect' ? 'active' : ''}`}
              onClick={() => setCurrentTool('rect')}
              title="Rectangle"
              style={{ padding: 2, height: 24 }}
            >
              ▭
            </button>
            <button
              className={`win98-btn ${currentTool === 'circle' ? 'active' : ''}`}
              onClick={() => setCurrentTool('circle')}
              title="Ellipse"
              style={{ padding: 2, height: 24 }}
            >
              ○
            </button>
          </div>

          <div className="win98-dropdown-divider" />

          {/* Stroke Width Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            {[1, 2, 4, 8].map((w) => (
              <div
                key={w}
                onClick={() => setLineWidth(w)}
                style={{
                  width: 38,
                  height: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: lineWidth === w ? '#000080' : 'transparent',
                }}
              >
                <div style={{ width: 28, height: w, backgroundColor: lineWidth === w ? '#fff' : '#000' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className="inset-border"
          style={{
            flex: 1,
            backgroundColor: '#808080',
            overflow: 'auto',
            padding: 8,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={420}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
              cursor: currentTool === 'eraser' ? 'crosshair' : 'crosshair',
            }}
          />
        </div>
      </div>

      {/* Bottom Color Palette */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          borderTop: '1px solid #808080',
          backgroundColor: '#c0c0c0',
        }}
      >
        {/* Selected Color Preview */}
        <div
          className="inset-border"
          style={{ width: 28, height: 28, position: 'relative', backgroundColor: '#c0c0c0' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              width: 14,
              height: 14,
              backgroundColor: primaryColor,
              border: '1px solid #000',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              backgroundColor: secondaryColor,
              border: '1px solid #000',
              zIndex: 1,
            }}
          />
        </div>

        {/* Palette Swatches */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 14px)', gap: 2 }}>
          {classicColors.map((color, idx) => (
            <div
              key={idx}
              onClick={() => setPrimaryColor(color)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(color);
              }}
              style={{
                width: 14,
                height: 14,
                backgroundColor: color,
                border: '1px inset #808080',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
