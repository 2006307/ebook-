import React from 'react';
import { Sparkles, Printer, FileDown, MessageSquareHeart } from 'lucide-react';
import { ColoringBook } from '../types';

interface HeaderProps {
  currentBook: ColoringBook;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  onOpenChat: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentBook,
  onDownloadPdf,
  isDownloadingPdf,
  onOpenChat,
}) => {
  const readyPagesCount = currentBook.pages.filter((p) => p.status === 'ready').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo & App Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-rose-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold text-xl">
            🖍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight font-serif">
                DoodleCraft
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                5-Page Printable
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Children&apos;s Coloring Book Studio • Thick-Line Art &amp; Custom Covers
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Chatbot Companion Button */}
          <button
            onClick={onOpenChat}
            id="open-chat-btn"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:scale-95 transition-all border border-indigo-200"
            title="Chat with creative AI coloring buddies"
          >
            <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Creative Buddy</span>
            <span className="text-xs bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded-full">
              AI
            </span>
          </button>

          {/* Download Combined PDF Button */}
          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf || readyPagesCount === 0}
            id="download-pdf-btn"
            className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${
              readyPagesCount > 0
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isDownloadingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Compiling PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Download Book PDF</span>
                <span className="sm:hidden">PDF</span>
                <span className="text-xs bg-black/15 px-1.5 py-0.5 rounded-md">
                  {readyPagesCount}/5
                </span>
              </>
            )}
          </button>

          {/* Quick Print Entire Window / Page */}
          <button
            onClick={() => window.print()}
            title="Print coloring pages"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
