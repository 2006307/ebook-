import React from 'react';
import { ColoringBook } from '../types';
import { Sparkles, Star, Award, Heart } from 'lucide-react';

interface CoverPreviewProps {
  book: ColoringBook;
}

export const CoverPreview: React.FC<CoverPreviewProps> = ({ book }) => {
  const childUpper = (book.childName || 'Super Artist').toUpperCase();
  const themeUpper = (book.theme || 'Adventure').toUpperCase();

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[3/4] max-w-xl mx-auto select-none print:aspect-auto print:border-4">
      {/* Decorative Outer Inset Border */}
      <div className="absolute inset-3 sm:inset-4 border-2 border-dashed border-slate-300 pointer-events-none rounded-2xl" />

      {/* 4 Corner Stars */}
      <div className="absolute top-6 left-6 text-slate-400">
        <Star className="w-5 h-5 fill-slate-300 text-slate-400" />
      </div>
      <div className="absolute top-6 right-6 text-slate-400">
        <Star className="w-5 h-5 fill-slate-300 text-slate-400" />
      </div>
      <div className="absolute bottom-6 left-6 text-slate-400">
        <Star className="w-5 h-5 fill-slate-300 text-slate-400" />
      </div>
      <div className="absolute bottom-6 right-6 text-slate-400">
        <Star className="w-5 h-5 fill-slate-300 text-slate-400" />
      </div>

      {/* Top Banner */}
      <div className="text-center pt-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Personalized Edition
        </div>
        <div className="text-xs sm:text-sm font-black tracking-widest text-slate-400 uppercase">
          ★ The Amazing Coloring Adventure ★
        </div>
      </div>

      {/* Main Title Block */}
      <div className="text-center my-auto py-4 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif drop-shadow-xs">
          {childUpper}&apos;S
        </h2>
        <div className="text-2xl sm:text-4xl font-extrabold text-amber-600 tracking-normal mt-1 font-serif uppercase">
          {themeUpper}
        </div>
        <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase mt-2">
          Coloring Book
        </div>

        <div className="w-24 h-1 bg-slate-800 mx-auto mt-4 rounded-full" />
      </div>

      {/* Artist Ownership Box */}
      <div className="relative z-10 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 bg-amber-50/50 text-center my-2">
        <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-center gap-1.5 mb-1.5">
          <Award className="w-4 h-4 text-amber-600" />
          This Coloring Book Belongs To:
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
          {book.childName || 'Our Star Artist'}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Official Master Colorist in Training 🖍️
        </div>

        {/* Crayon Signature Line */}
        <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">Artist Signature:</span>
          <span className="border-b-2 border-slate-400 w-32 sm:w-44 h-4" />
        </div>
      </div>

      {/* Bottom Dedication & Specs */}
      <div className="text-center pt-2 relative z-10">
        {book.dedication && (
          <p className="text-xs sm:text-sm italic text-slate-600 font-serif max-w-md mx-auto line-clamp-2 mb-2">
            &ldquo;{book.dedication}&rdquo;
          </p>
        )}
        <div className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
          <span>5 Exclusive Thick-Line Coloring Pages</span>
          <span>•</span>
          <span>Printable 8.5 x 11 Format</span>
        </div>
      </div>
    </div>
  );
};
