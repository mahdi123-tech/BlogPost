'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
      );
    };

    const handleMouseDown = () => {
      setIsDown(true);
    };

    const handleMouseUp = () => {
      setIsDown(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className={cn(
        "hidden lg:block fixed pointer-events-none z-[9999] transition-transform duration-200 ease-in-out",
      )}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
        {/* Outer Ring */}
      <div
        className={cn(
          "absolute top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition-transform",
          isPointer ? 'scale-150' : 'scale-100',
          isDown ? 'scale-75' : '',
        )}
      />
      {/* Inner Dot */}
      <div
        className={cn(
          "absolute top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-transform",
          isDown ? 'scale-150' : 'scale-100'
        )}
      />
    </div>
  );
}
