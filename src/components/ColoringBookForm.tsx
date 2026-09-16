import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Layers, ShieldCheck, Heart } from 'lucide-react';
import { ImageSizeOption, ArtStyleLevel } from '../types';
import { POPULAR_THEMES } from '../data/presets';

interface ColoringBookFormProps {
  childName: string;
  setChildName: (val: string) => void;
  theme: string;
  setTheme: (val: string) => void;
  imageSize: ImageSizeOption;
  setImageSize: (val: ImageSizeOption) => void;
  styleLevel: ArtStyleLevel;
  setStyleLevel: (val: ArtStyleLevel) => void;
  dedication: string;
  setDedication: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStepMessage: string;
}

export const ColoringBookForm: React.FC<ColoringBookFormProps> = ({
  childName,
  setChildName,
  theme,
  setTheme,
  imageSize,
  setImageSize,
  styleLevel,
  setStyleLevel,
  dedication,
  setDedication,
  onGenerate,
  isGenerating,
  generationStepMessage,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSelectTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    if (!dedication || dedication.includes('adventures')) {
      setDedication(`Specially created for ${childName || 'our star artist'}'s ${selectedTheme.toLowerCase()} adventures!`);
    }
  };

  const handleNameChange = (name: string) => {
    setChildName(name);
    if (theme && (!dedication || dedication.includes('created for'))) {
      setDedication(`Specially created for ${name || 'our star artist'}'s ${theme.toLowerCase()} adventures!`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-100 shadow-xl shadow-amber-500/5 p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Coloring Book Creator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Create Your 5-Page Coloring Adventure
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Personalized with thick, clean black outlines perfect for crayons, markers, and colored pencils.
          </p>
        </div>

        {/* Resolution Indicator Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Powered by <strong>gemini-3-pro-image-preview</strong></span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child's Name Input */}
        <div>
          <label htmlFor="child-name-input" className="block text-sm font-bold text-slate-700 mb-1.5">
            Child&apos;s Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="child-name-input"
              type="text"
              value={childName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Leo, Maya, Oliver, Sophia"
              className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 border border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none font-medium text-slate-800 text-base transition-all placeholder:text-slate-400"
              disabled={isGenerating}
            />
            <span className="absolute right-3.5 top-3 text-lg select-none">
              👦👧
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Featured prominently on the custom cover and title pages.
          </p>
        </div>

        {/* Theme Input */}
        <div>
          <label htmlFor="theme-input" className="block text-sm font-bold text-slate-700 mb-1.5">
            Coloring Book Theme <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="theme-input"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. space dinosaurs, ocean animals, princess dragons"
              className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 border border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none font-medium text-slate-800 text-base transition-all placeholder:text-slate-400"
              disabled={isGenerating}
            />
            <span className="absolute right-3.5 top-3 text-lg select-none">
              🚀🦖
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Gemini plans 5 distinct, sequential storyline scenes for this theme.
          </p>
        </div>
      </div>

      {/* Quick Theme Inspiration Pills */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-500 mr-2 inline-block mb-1">
          Quick Inspirations:
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_THEMES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelectTheme(item.name)}
              disabled={isGenerating}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all active:scale-95 flex items-center gap-1.5 ${
                theme.toLowerCase() === item.name.toLowerCase()
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution & Style Controls (Affordance for 1K, 2K, 4K) */}
      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Image Resolution Selector (Mandated: 1K, 2K, and 4K) */}
        <div className="col-span-1">
          <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Image Print Resolution</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Mandatory Spec
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['1K', '2K', '4K'] as ImageSizeOption[]).map((size) => (
              <button
                key={size}
                type="button"
                id={`size-btn-${size}`}
                onClick={() => setImageSize(size)}
                disabled={isGenerating}
                className={`py-2.5 px-3 rounded-xl text-center border transition-all ${
                  imageSize === size
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm shadow-indigo-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium'
                }`}
              >
                <div className="text-sm font-black">{size}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${imageSize === size ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {size === '1K' ? 'Fast HD' : size === '2K' ? 'Ultra Crisp' : 'Master 4K'}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Configures image size for <code>gemini-3-pro-image-preview</code>.
          </p>
        </div>

        {/* Outline / Art Style Level */}
        <div className="col-span-1">
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            Line Thickness &amp; Age Group
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bold_simple', label: 'Ages 3-5', sub: 'Extra Bold' },
              { id: 'classic_storybook', label: 'Ages 6-8', sub: 'Standard' },
              { id: 'detailed_explorer', label: 'Ages 9+', sub: 'Fine Detail' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStyleLevel(st.id as ArtStyleLevel)}
                disabled={isGenerating}
                className={`py-2 px-2 text-center rounded-xl border transition-all ${
                  styleLevel === st.id
                    ? 'bg-amber-500 text-white font-bold border-amber-500 shadow-sm shadow-amber-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium'
                }`}
              >
                <div className="text-xs font-bold">{st.label}</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${styleLevel === st.id ? 'text-amber-100' : 'text-slate-400'}`}>
                  {st.sub}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Adjusts outline weight for young hands and crayons.
          </p>
        </div>

        {/* Custom Cover Dedication Toggle */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Cover Dedication
            </label>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-amber-700 font-medium hover:underline"
            >
              {showAdvanced ? 'Hide Dedication' : 'Edit Dedication'}
            </button>
          </div>

          {showAdvanced ? (
            <input
              type="text"
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="e.g. Specially made with love for Leo!"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-amber-500"
              disabled={isGenerating}
            />
          ) : (
            <div className="px-3 py-2 text-xs text-slate-600 bg-slate-50 rounded-xl border border-slate-200 truncate italic">
              &ldquo;{dedication || `Specially created for ${childName || 'Artist'}`}&rdquo;
            </div>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Printed on the custom cover artist box.
          </p>
        </div>
      </div>

      {/* Generation Button & Progress Banner */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            5
          </div>
          <div>
            <div className="font-bold text-slate-700">Full 5-Page Storybook</div>
            <div className="text-[11px] text-slate-400">
              Generates custom cover + 5 pure B&amp;W thick-line art scenes
            </div>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !childName.trim() || !theme.trim()}
          id="generate-coloring-book-btn"
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
            isGenerating
              ? 'bg-amber-400 text-white cursor-wait'
              : !childName.trim() || !theme.trim()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30 hover:shadow-xl cursor-pointer'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating Book...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate 5-Page Coloring Book</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time generation feedback banner */}
      {isGenerating && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div className="text-sm font-semibold text-amber-900">
            {generationStepMessage || 'Planning 5 distinct story scenes with Gemini...'}
          </div>
        </div>
      )}
    </div>
  );
};
