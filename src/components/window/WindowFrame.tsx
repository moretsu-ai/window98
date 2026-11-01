import React, { useState, useRef, useEffect } from 'react';
import { WindowInstance } from '../../types/window';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WinIcon, WinIconType } from '../common/WinIcon';

interface WindowFrameProps {
  window: WindowInstance;
  iconName?: WinIconType;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  iconName = 'computer',
  children,
}) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateSize,
  } = useWindowManager();

  const isActive = activeWindowId === win.id;
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: win.x,
    startY: win.y,
  });

  const isResizingRef = useRef(false);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: win.width,
    startH: win.height,
  });

  // Handle Dragging
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('.win98-title-btn')) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.x,
      startY: win.y,
    };
    focusWindow(win.id);
  };

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isResizingRef.current = true;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: win.width,
      startH: win.height,
    };
    focusWindow(win.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;

        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

        const newX = Math.max(0, Math.min(screenW - 80, dragStartRef.current.startX + dx));
        const newY = Math.max(0, Math.min(screenH - 60, dragStartRef.current.startY + dy));

        updatePosition(win.id, newX, newY);
      } else if (isResizingRef.current) {
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;

        const newW = Math.max(220, resizeStartRef.current.startW + dx);
        const newH = Math.max(160, resizeStartRef.current.startH + dy);

        updateSize(win.id, newW, newH);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [win.id, updatePosition, updateSize]);

  if (win.isMinimized) {
    return null;
  }

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 28, // above taskbar
        width: '100%',
        height: 'calc(100% - 28px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      className="win98-window"
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div
        className={`win98-titlebar ${isActive ? 'active' : 'inactive'}`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="win98-title-text">
          <WinIcon name={iconName} size={14} />
          <span>{win.title}</span>
        </div>
        <div className="win98-title-controls">
          <button
            className="win98-title-btn"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
          >
            _
          </button>
          <button
            className="win98-title-btn"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
          >
            {win.isMaximized ? '❐' : '□'}
          </button>
          <button
            className="win98-title-btn"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>

      {/* Resize Grip Handle */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: 14,
            height: 14,
            cursor: 'nwse-resize',
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 2,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <line x1="7" y1="1" x2="1" y2="7" stroke="#808080" />
            <line x1="7" y1="2" x2="2" y2="7" stroke="#ffffff" />
            <line x1="7" y1="4" x2="4" y2="7" stroke="#808080" />
            <line x1="7" y1="5" x2="5" y2="7" stroke="#ffffff" />
          </svg>
        </div>
      )}
    </div>
  );
};
