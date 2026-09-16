import React, { useState } from 'react';
import { ColoringPage } from '../types';
import { Printer, RefreshCw, Palette, ZoomIn, Sparkles, AlertCircle } from 'lucide-react';

interface PageCardProps {
  page: ColoringPage;
  childName: string;
  theme: string;
  onRegenerate: (pageNumber: number) => void;
  onOpenColoringPad: (page: ColoringPage) => void;
  isRegenerating: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({
  page,
  childName,
  theme,
  onRegenerate,
  onOpenColoringPad,
  isRegenerating,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handlePrintSinglePage = () => {
    if (!page.imageUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${childName}'s Coloring Page - ${page.sceneTitle}</title>
          <style>
            @page { size: letter portrait; margin: 0.5in; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
              text-align: center;
              background: #fff;
            }
            .page-container {
              border: 2px solid #222;
              padding: 16px;
              box-sizing: border-box;
              height: 98vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              color: #555;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              font-weight: 600;
            }
            .title {
              font-size: 20px;
              font-weight: 800;
              margin: 8px 0;
              color: #111;
            }
            .image-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 8px;
            }
            img {
              max-width: 95%;
              max-height: 72vh;
              object-fit: contain;
            }
            .caption {
              font-size: 14px;
              color: #333;
              margin: 8px 0;
              font-style: italic;
            }
            .footer {
              font-size: 11px;
              color: #888;
              font-weight: 600;
              border-top: 1px solid #eee;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <div class="header">
              <span>${childName}'s Coloring Adventure • ${theme}</span>
              <span>Page ${page.pageNumber} of 5</span>
            </div>
            <div class="title">${page.sceneTitle}</div>
            <div class="image-wrapper">
              <img src="${page.imageUrl}" alt="${page.sceneTitle}" />
            </div>
            <div class="caption">"${page.storyCaption}"</div>
            <div class="footer">★ COLOR OUTSIDE THE LINES &amp; ENJOY! ★</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div
        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {page.pageNumber}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Page {page.pageNumber} of 5
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Digital Coloring Pad Launcher */}
            <button
              onClick={() => onOpenColoringPad(page)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Test color on digital canvas"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Print Single Page */}
            <button
              onClick={handlePrintSinglePage}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Print just this page"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Regenerate Line Art */}
            <button
              onClick={() => onRegenerate(page.pageNumber)}
              disabled={isRegenerating || page.status === 'generating'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-40"
              title="Regenerate this scene's line art"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isRegenerating || page.status === 'generating' ? 'animate-spin text-indigo-600' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Scene Title */}
        <div className="px-5 pt-3">
          <h3 className="font-bold text-slate-800 text-base line-clamp-1">
            {page.sceneTitle}
          </h3>
        </div>

        {/* Line Art Image Frame */}
        <div className="p-4 sm:p-5 flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-[3/4] bg-white rounded-2xl border-2 border-slate-900 p-2 flex items-center justify-center overflow-hidden shadow-xs">
            {page.status === 'generating' ? (
              <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-xs font-bold text-slate-700">
                  Drawing black-and-white thick lines...
                </div>
                <div className="text-[11px] text-slate-400">
                  gemini-3-pro-image-preview
                </div>
              </div>
            ) : page.status === 'error' ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center text-rose-600">
                <AlertCircle className="w-7 h-7" />
                <div className="text-xs font-semibold">
                  {page.error || 'Failed to draw image'}
                </div>
                <button
                  onClick={() => onRegenerate(page.pageNumber)}
                  className="mt-1 text-xs font-bold underline hover:text-rose-700"
                >
                  Retry page
                </button>
              </div>
            ) : page.imageUrl ? (
              <>
                <img
                  src={page.imageUrl}
                  alt={page.sceneTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => setShowFullImage(true)}
                />

                {/* Quick overlay controls */}
                <div
                  className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2.5 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 hover:bg-white text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>
                  <button
                    onClick={() => onOpenColoringPad(page)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Color Online</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400 italic">No image data</div>
            )}
          </div>
        </div>

        {/* Story Caption Box */}
        <div className="p-4 sm:p-5 pt-0">
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-slate-700 text-xs sm:text-sm font-serif italic text-center leading-relaxed">
            &ldquo;{page.storyCaption}&rdquo;
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {showFullImage && page.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div
            className="bg-white rounded-3xl p-4 max-w-2xl max-h-[90vh] flex flex-col items-center justify-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="font-bold text-slate-800 text-sm">
                Page {page.pageNumber}: {page.sceneTitle}
              </div>
              <button
                onClick={() => setShowFullImage(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <img
              src={page.imageUrl}
              alt={page.sceneTitle}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] object-contain border-2 border-slate-900 rounded-xl"
            />
            <div className="text-xs text-slate-500 italic mt-3 text-center">
              &ldquo;{page.storyCaption}&rdquo;
            </div>
          </div>
        </div>
      )}
    </>
  );
};
