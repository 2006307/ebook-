import React, { useState } from 'react';
import { ColoringBook, ColoringPage } from '../types';
import { CoverPreview } from './CoverPreview';
import { PageCard } from './PageCard';
import {
  BookOpen,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileDown,
  Sparkles,
  Palette,
} from 'lucide-react';

interface BookViewerProps {
  book: ColoringBook;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  onRegeneratePage: (pageNumber: number) => void;
  onOpenColoringPad: (page: ColoringPage) => void;
  isRegeneratingPageNumber: number | null;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  book,
  onDownloadPdf,
  isDownloadingPdf,
  onRegeneratePage,
  onOpenColoringPad,
  isRegeneratingPageNumber,
}) => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0 = Cover, 1-5 = Pages

  const readyPagesCount = book.pages.filter((p) => p.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Viewer Sub-Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight font-serif">
              {book.bookTitle || `${book.childName}'s Coloring Book`}
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {readyPagesCount}/5 Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Custom cover + 5 distinct scenes • Formatted for 8.5 x 11 in printing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'carousel'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Book Flip</span>
            </button>
          </div>

          {/* Download Combined PDF Button */}
          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf || readyPagesCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-500/20 transition-all disabled:opacity-40"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Full Book (PDF)</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="space-y-8">
          {/* Highlighted Cover Showcase */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  ★
                </span>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Personalized Cover Page (Page 1 in PDF)
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Printed on Letter (8.5 x 11 in)
              </span>
            </div>
            <CoverPreview book={book} />
          </div>

          {/* 5 Distinct Coloring Pages Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>5 Distinct Coloring Pages</span>
              </h4>
              <span className="text-xs text-slate-500">
                Resolution: <strong>{book.imageSize}</strong> (gemini-3-pro-image-preview)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {book.pages.map((page) => (
                <PageCard
                  key={page.pageNumber}
                  page={page}
                  childName={book.childName}
                  theme={book.theme}
                  onRegenerate={onRegeneratePage}
                  onOpenColoringPad={onOpenColoringPad}
                  isRegenerating={isRegeneratingPageNumber === page.pageNumber}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Carousel / Book Flip View */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col items-center">
          {/* Page Navigator */}
          <div className="flex items-center justify-between w-full max-w-xl mb-6">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-sm font-black text-slate-800">
                {currentPageIndex === 0
                  ? 'Personalized Cover Page'
                  : `Coloring Page ${currentPageIndex} of 5`}
              </div>
              <div className="text-xs text-slate-400">
                {currentPageIndex === 0
                  ? 'Cover with child dedication'
                  : book.pages[currentPageIndex - 1]?.sceneTitle}
              </div>
            </div>

            <button
              onClick={() =>
                setCurrentPageIndex((prev) => Math.min(book.pages.length, prev + 1))
              }
              disabled={currentPageIndex === book.pages.length}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Active Viewport */}
          <div className="w-full max-w-xl">
            {currentPageIndex === 0 ? (
              <CoverPreview book={book} />
            ) : (
              <PageCard
                page={book.pages[currentPageIndex - 1]}
                childName={book.childName}
                theme={book.theme}
                onRegenerate={onRegeneratePage}
                onOpenColoringPad={onOpenColoringPad}
                isRegenerating={
                  isRegeneratingPageNumber === book.pages[currentPageIndex - 1]?.pageNumber
                }
              />
            )}
          </div>

          {/* Page Thumbnails bar */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
            <button
              onClick={() => setCurrentPageIndex(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentPageIndex === 0
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Cover
            </button>
            {book.pages.map((p) => (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(p.pageNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentPageIndex === p.pageNumber
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Page {p.pageNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
