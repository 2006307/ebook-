import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Palette,
  BookOpen,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, ChatRole, TaskType } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  theme: string;
  onApplyTheme: (theme: string) => void;
}

const ROLES: {
  id: ChatRole;
  name: string;
  avatar: string;
  description: string;
  defaultTask: TaskType;
  modelBadge: string;
}[] = [
  {
    id: 'creative_storyteller',
    name: 'Penny the Storyteller',
    avatar: '🎭',
    description: 'Deep rhyming stories, character lore & custom book narration',
    defaultTask: 'complex',
    modelBadge: 'gemini-3.1-pro-preview',
  },
  {
    id: 'coloring_coach',
    name: 'Barnaby the Art Owl',
    avatar: '🎨',
    description: 'Crayon palettes, shading tips & color matching for kids',
    defaultTask: 'general',
    modelBadge: 'gemini-3.5-flash',
  },
  {
    id: 'theme_explorer',
    name: 'Sparky the Idea Dragon',
    avatar: '⚡',
    description: 'Lightning-fast theme ideas, rhymes & fun trivia',
    defaultTask: 'fast',
    modelBadge: 'gemini-3.1-flash-lite',
  },
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  childName,
  theme,
  onApplyTheme,
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatRole>('coloring_coach');
  const [taskType, setTaskType] = useState<TaskType>('general');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hoo-hoo! Hello there! 🦉 I'm **Barnaby the Art Owl**, your coloring companion! I can recommend dazzling crayon palettes for **${childName || 'your artist'}**'s **${theme || 'coloring adventures'}**, or you can switch to Penny for deep storybooks or Sparky for fast theme brainstorming! What would you like help with?`,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.5-flash',
      taskType: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Sync default taskType when role changes
  const handleRoleChange = (role: ChatRole) => {
    setSelectedRole(role);
    const roleDef = ROLES.find((r) => r.id === role);
    if (roleDef) {
      setTaskType(roleDef.defaultTask);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
      taskType,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Map for server
      const serverPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: serverPayload,
          taskType,
          roleType: selectedRole,
          childName: childName || 'Little Artist',
          theme: theme || 'fun coloring',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get a response');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
        modelUsed: data.modelUsed,
        taskType: data.taskType,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `Oops! My crayons slipped: ${err.message || 'Could not connect to Gemini'}. Please try again!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content: `New fresh page! How can I help you design coloring books today?`,
        timestamp: Date.now(),
        modelUsed: taskType === 'complex' ? 'gemini-3.1-pro-preview' : taskType === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {ROLES.find((r) => r.id === selectedRole)?.avatar || '🦉'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {ROLES.find((r) => r.id === selectedRole)?.name}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Gemini
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {ROLES.find((r) => r.id === selectedRole)?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear chat history"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role & Model Selector Ribbon */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex flex-col gap-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select AI Role &amp; Model</span>
            <span className="font-mono text-slate-500 text-[10px]">
              {taskType === 'complex'
                ? 'gemini-3.1-pro-preview'
                : taskType === 'fast'
                ? 'gemini-3.1-flash-lite'
                : 'gemini-3.5-flash'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`py-1.5 px-2 rounded-xl text-left border transition-all ${
                  selectedRole === r.id
                    ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-white/60 hover:bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">{r.avatar}</span>
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    {r.name.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {r.defaultTask}
                </div>
              </button>
            ))}
          </div>

          {/* Model Complexity Override Affordance */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 text-[11px]">Task Complexity:</span>
            <div className="flex gap-1">
              {(['fast', 'general', 'complex'] as TaskType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTaskType(t)}
                  className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all ${
                    taskType === t
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {t === 'fast' ? '⚡ Fast' : t === 'general' ? '🎨 General' : '🧠 Complex Pro'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {ROLES.find((r) => r.id === selectedRole)?.avatar || '🦉'}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Model badge and timestamp */}
                <div
                  className={`text-[10px] mt-2 flex items-center justify-between gap-2 ${
                    m.role === 'user' ? 'text-amber-100' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {m.modelUsed && (
                    <span className="font-mono bg-black/10 px-1.5 py-0.5 rounded text-[9px]">
                      {m.modelUsed}
                    </span>
                  )}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {ROLES.find((r) => r.id === selectedRole)?.avatar || '🦉'}
              </div>
              <div className="bg-slate-100 text-slate-600 rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Thinking with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            `Best colors for ${childName || 'Leo'}'s book?`,
            'Suggest 5 creative themes for kids',
            'Write a 2-line rhyme for space dinos',
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleSendMessage(promptText)}
              className="text-[11px] font-medium bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for themes, rhymes, or color palettes..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 focus:bg-white border border-transparent focus:border-amber-500 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
