import React, { useRef, useState, useEffect } from 'react';
import { ColoringPage } from '../types';
import { X, RotateCcw, Download, Palette, Eraser, Brush, Check } from 'lucide-react';

interface DigitalColoringModalProps {
  page: ColoringPage;
  childName: string;
  onClose: () => void;
}

const CRAYON_COLORS = [
  { name: 'Cherry Red', hex: '#ef4444' },
  { name: 'Tangerine', hex: '#f97316' },
  { name: 'Sun Yellow', hex: '#eab308' },
  { name: 'Lime Green', hex: '#84cc16' },
  { name: 'Forest Green', hex: '#16a34a' },
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Royal Blue', hex: '#3b82f6' },
  { name: 'Lavender Purple', hex: '#a855f7' },
  { name: 'Bubblegum Pink', hex: '#ec4899' },
  { name: 'Teddy Brown', hex: '#854d0e' },
  { name: 'Soft Gray', hex: '#94a3b8' },
  { name: 'Black Crayon', hex: '#1e293b' },
];

export const DigitalColoringModal: React.FC<DigitalColoringModalProps> = ({
  page,
  childName,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(16);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load line art image onto canvas
    if (page.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = page.imageUrl;
      img.onload = () => {
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 800;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [page.imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#ffffff';
    } else {
      // Multiply composite operation allows coloring under thick black lines!
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas || !page.imageUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = page.imageUrl;
    img.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleSaveColoredArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${childName}_page_${page.pageNumber}_colored.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
              🖍️
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Digital Crayon Coloring Pad • Page {page.pageNumber}
              </h3>
              <p className="text-xs text-slate-500">
                {page.sceneTitle} (Features translucent crayon blending over black lines)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveColoredArt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Artwork</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workspace: Canvas + Controls */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4 items-center justify-center bg-slate-50">
          {/* Canvas Viewport */}
          <div className="relative bg-white rounded-2xl shadow-md border border-slate-200 p-2 max-w-md max-h-[60vh] sm:max-h-[65vh] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-auto max-h-[58vh] rounded-xl touch-none cursor-crosshair object-contain"
            />
          </div>

          {/* Palette & Tool Controls */}
          <div className="w-full md:w-64 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Crayon Palette
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CRAYON_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.hex);
                      setIsEraser(false);
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-10 h-10 rounded-xl transition-all relative flex items-center justify-center shadow-xs ${
                      !isEraser && selectedColor === c.hex
                        ? 'ring-3 ring-amber-500 ring-offset-2 scale-105'
                        : 'hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    {!isEraser && selectedColor === c.hex && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brush & Eraser */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Drawing Tool
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEraser(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    !isEraser
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Brush className="w-3.5 h-3.5" />
                  <span>Crayon</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isEraser
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>
              </div>
            </div>

            {/* Crayon Size */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Crayon Tip Size:</span>
                <span className="font-mono">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="mt-2 py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear &amp; Start Over</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
