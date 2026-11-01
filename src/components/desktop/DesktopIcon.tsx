import React, { useState, useRef, useEffect } from 'react';
import { WinIcon, WinIconType } from '../common/WinIcon';
import { useEasterEgg } from '../../context/EasterEggContext';

interface DesktopIconProps {
  id: string;
  label: string;
  iconName: WinIconType;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  initialX?: number;
  initialY?: number;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  label,
  iconName,
  isSelected,
  onSelect,
  onOpen,
  initialX = 10,
  initialY = 10,
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const hasMovedRef = useRef(false);
  const openTimeoutRef = useRef<any>(null);
  const { handleSettingsIconClick, activeEgg } = useEasterEgg();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();

    // If this is Control Panel / Settings icon, notify EasterEggContext
    if (id === 'control-panel') {
      handleSettingsIconClick();
      // If click sequence is in progress, cancel any scheduled window open
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
    }

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeEgg !== 0) return;

    if (id === 'control-panel') {
      // Delay opening Control Panel by 350ms so a 3rd click intended for the Easter egg
      // will cancel this and prevent opening the window behind the egg
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      openTimeoutRef.current = setTimeout(() => {
        onOpen();
        openTimeoutRef.current = null;
      }, 350);
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMovedRef.current = true;
        }
        setPos({
          x: Math.max(0, dragStartRef.current.startX + dx),
          y: Math.max(0, dragStartRef.current.startY + dy),
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`win98-desktop-icon ${isSelected ? 'selected' : ''}`}
      title={id === 'control-panel' ? 'Control Panel (Click 3 times to hatch surprise)' : label}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: isDraggingRef.current ? 5 : 1,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <WinIcon name={iconName} size={32} />
      <div className="win98-icon-label">{label}</div>
    </div>
  );
};
