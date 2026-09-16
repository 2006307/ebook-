import React, { useState } from 'react';
import { Header } from './components/Header';
import { ColoringBookForm } from './components/ColoringBookForm';
import { BookViewer } from './components/BookViewer';
import { ChatDrawer } from './components/ChatDrawer';
import { DigitalColoringModal } from './components/DigitalColoringModal';
import { ColoringBook, ColoringPage, ImageSizeOption, ArtStyleLevel } from './types';
import { SAMPLE_SPACE_DINOSAURS_BOOK } from './data/presets';
import { generateColoringBookPdf } from './utils/pdfGenerator';
import { Sparkles, Printer, Heart, Award, ShieldAlert } from 'lucide-react';

export default function App() {
  const [childName, setChildName] = useState<string>('Leo');
  const [theme, setTheme] = useState<string>('Space Dinosaurs');
  const [imageSize, setImageSize] = useState<ImageSizeOption>('1K');
  const [styleLevel, setStyleLevel] = useState<ArtStyleLevel>('bold_simple');
  const [dedication, setDedication] = useState<string>(
    'Specially crafted for Leo’s epic galactic adventures!'
  );

  const [currentBook, setCurrentBook] = useState<ColoringBook>(SAMPLE_SPACE_DINOSAURS_BOOK);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepMessage, setGenerationStepMessage] = useState<string>('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isRegeneratingPageNumber, setIsRegeneratingPageNumber] = useState<number | null>(null);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeColoringPadPage, setActiveColoringPadPage] = useState<ColoringPage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Generate full 5-page coloring book
  const handleGenerateBook = async () => {
    if (!childName.trim() || !theme.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStepMessage(`Planning 5 distinct story scenes for "${theme}" with Gemini...`);

    try {
      // Step A: Plan the 5 scenes
      const planRes = await fetch('/api/coloring-book/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          childName: childName.trim(),
          styleLevel,
        }),
      });

      const planData = await planRes.json();

      if (!planRes.ok || !planData.pages) {
        throw new Error(planData.error || 'Failed to outline coloring book scenes.');
      }

      // Initialize book skeleton with 5 pages in generating state
      const initialPages: ColoringPage[] = planData.pages.map((p: any, idx: number) => ({
        pageNumber: p.pageNumber || idx + 1,
        sceneTitle: p.sceneTitle || `Scene ${idx + 1}`,
        storyCaption: p.storyCaption || '',
        imagePrompt: p.imagePrompt || '',
        status: 'generating',
      }));

      const newBook: ColoringBook = {
        id: `book-${Date.now()}`,
        childName: childName.trim(),
        theme: theme.trim(),
        bookTitle: planData.bookTitle || `${childName.trim()}'s ${theme.trim()}`,
        dedication: dedication || planData.dedication || `Specially made for ${childName.trim()}`,
        imageSize,
        styleLevel,
        createdAt: Date.now(),
        pages: initialPages,
      };

      setCurrentBook(newBook);

      // Step B: Generate each of the 5 pages sequentially or concurrently
      // We do controlled sequential execution to guarantee each page finishes smoothly and display progress
      const updatedPages = [...initialPages];

      for (let i = 0; i < updatedPages.length; i++) {
        const page = updatedPages[i];
        setGenerationStepMessage(
          `Drawing line art for Page ${i + 1} of 5: "${page.sceneTitle}" (${imageSize} resolution)...`
        );

        try {
          const imgRes = await fetch('/api/coloring-book/generate-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: page.imagePrompt,
              imageSize,
              sceneTitle: page.sceneTitle,
              theme: newBook.theme,
              childName: newBook.childName,
              pageNumber: page.pageNumber,
            }),
          });

          const imgData = await imgRes.json();

          if (!imgRes.ok || !imgData.imageUrl) {
            throw new Error(imgData.error || `Could not generate image for page ${i + 1}`);
          }

          updatedPages[i] = {
            ...page,
            imageUrl: imgData.imageUrl,
            status: 'ready',
          };
        } catch (pageErr: any) {
          console.error(`Page ${i + 1} generation error:`, pageErr);
          updatedPages[i] = {
            ...page,
            status: 'error',
            error: pageErr?.message || 'Failed to render line art',
          };
        }

        // Live progressive update
        setCurrentBook((prev) => ({
          ...prev,
          pages: [...updatedPages],
        }));
      }

      setGenerationStepMessage('');
    } catch (err: any) {
      console.error('Book generation error:', err);
      setErrorMessage(err.message || 'Failed to generate coloring book. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStepMessage('');
    }
  };

  // 2. Regenerate single page
  const handleRegeneratePage = async (pageNumber: number) => {
    const pageIndex = currentBook.pages.findIndex((p) => p.pageNumber === pageNumber);
    if (pageIndex === -1 || isRegeneratingPageNumber !== null) return;

    setIsRegeneratingPageNumber(pageNumber);

    const targetPage = currentBook.pages[pageIndex];

    // Mark page as generating
    setCurrentBook((prev) => {
      const copy = [...prev.pages];
      copy[pageIndex] = { ...targetPage, status: 'generating', error: undefined };
      return { ...prev, pages: copy };
    });

    try {
      const imgRes = await fetch('/api/coloring-book/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetPage.imagePrompt,
          imageSize: currentBook.imageSize || imageSize,
          sceneTitle: targetPage.sceneTitle,
          theme: currentBook.theme,
          childName: currentBook.childName,
          pageNumber,
        }),
      });

      const imgData = await imgRes.json();

      if (!imgRes.ok || !imgData.imageUrl) {
        throw new Error(imgData.error || 'Failed to redraw scene');
      }

      setCurrentBook((prev) => {
        const copy = [...prev.pages];
        copy[pageIndex] = {
          ...targetPage,
          imageUrl: imgData.imageUrl,
          status: 'ready',
        };
        return { ...prev, pages: copy };
      });
    } catch (err: any) {
      console.error('Page redraw error:', err);
      setCurrentBook((prev) => {
        const copy = [...prev.pages];
        copy[pageIndex] = {
          ...targetPage,
          status: 'error',
          error: err.message || 'Redraw failed',
        };
        return { ...prev, pages: copy };
      });
    } finally {
      setIsRegeneratingPageNumber(null);
    }
  };

  // 3. Download combined PDF
  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await generateColoringBookPdf(currentBook);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF. Please ensure images have loaded.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Apply theme from Chatbot
  const handleApplyTheme = (newTheme: string) => {
    setTheme(newTheme);
    setDedication(`Specially created for ${childName || 'our star artist'}'s ${newTheme.toLowerCase()} adventures!`);
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header Navigation */}
      <Header
        currentBook={currentBook}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Error Notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold underline hover:text-rose-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Generator Form Section */}
        <section aria-label="Book Configuration">
          <ColoringBookForm
            childName={childName}
            setChildName={setChildName}
            theme={theme}
            setTheme={setTheme}
            imageSize={imageSize}
            setImageSize={setImageSize}
            styleLevel={styleLevel}
            setStyleLevel={setStyleLevel}
            dedication={dedication}
            setDedication={setDedication}
            onGenerate={handleGenerateBook}
            isGenerating={isGenerating}
            generationStepMessage={generationStepMessage}
          />
        </section>

        {/* Book Preview & Pages Showcase */}
        <section aria-label="Book Pages Showcase">
          <BookViewer
            book={currentBook}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
            onRegeneratePage={handleRegeneratePage}
            onOpenColoringPad={(page) => setActiveColoringPadPage(page)}
            isRegeneratingPageNumber={isRegeneratingPageNumber}
          />
        </section>
      </main>

      {/* Digital Crayon Coloring Pad Modal */}
      {activeColoringPadPage && (
        <DigitalColoringModal
          page={activeColoringPadPage}
          childName={currentBook.childName}
          onClose={() => setActiveColoringPadPage(null)}
        />
      )}

      {/* Multi-turn Gemini Chat Companion Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        childName={childName}
        theme={theme}
        onApplyTheme={handleApplyTheme}
      />

      {/* Footer */}
      <footer className="border-t border-amber-100/80 bg-white/70 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 font-serif">DoodleCraft</span>
            <span>•</span>
            <span>5-Page Printable Children&apos;s Coloring Book Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Standard Letter (8.5 x 11 in)</span>
            <span>•</span>
            <span>Single Combined PDF</span>
            <span>•</span>
            <span>gemini-3-pro-image-preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
