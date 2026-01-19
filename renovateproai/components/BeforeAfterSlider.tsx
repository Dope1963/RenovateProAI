
import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const position = ((x - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(100, Math.max(0, position)));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
        handleDrag(e);
    }
  };

  // Label visibility logic
  const beforeLabelOpacity = sliderPosition < 10 ? 0 : 1;
  const afterLabelOpacity = sliderPosition > 90 ? 0 : 1;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl select-none shadow-2xl group cursor-ew-resize bg-slate-900"
      onMouseMove={handleMouseMove}
      onTouchMove={handleDrag}
      onClick={handleDrag}
    >
      {/* After Image (Background) */}
      <div 
        className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${afterImage})` }}
      />

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${beforeImage})`,
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <span 
          className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 text-sm rounded font-bold transition-opacity duration-300"
          style={{ opacity: beforeLabelOpacity }}
        >
          BEFORE
        </span>
      </div>

      <span 
        className="absolute bottom-4 right-4 bg-brand-600/80 text-white px-2 py-1 text-sm rounded font-bold transition-opacity duration-300"
        style={{ opacity: afterLabelOpacity }}
      >
        AFTER AI
      </span>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center -ml-0.5">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>
      </div>
    </div>
  );
};
