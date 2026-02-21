/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'اسلام علیکم! آج کا جوک سناؤں؟ 😄' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history })
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'معذرت، کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#2d3436] font-sans selection:bg-emerald-100" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-emerald-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-emerald-900">اردو جوک بوٹ</h1>
              <p className="text-xs text-emerald-600 font-medium">ہمیشہ آپ کے چہرے پر مسکراہٹ لانے کے لیے تیار!</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'model', text: 'اسلام علیکم! آج کا جوک سناؤں؟ 😄' }])}
            className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-600"
            title="چیٹ ری سیٹ کریں"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-3xl mx-auto pt-24 pb-32 px-4">
        <div 
          ref={scrollRef}
          className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                  msg.role === 'user' ? "bg-indigo-500" : "bg-emerald-500"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-lg leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-white border border-emerald-50 text-emerald-950 rounded-tl-none"
                )}>
                  <div className="markdown-body prose prose-emerald max-w-none">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-emerald-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                <span className="text-emerald-600 text-sm font-medium">بوٹ سوچ رہا ہے...</span>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-emerald-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="یہاں اپنا پیغام لکھیں..."
              className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute left-2 p-3 rounded-xl transition-all",
                input.trim() && !isLoading 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95" 
                  : "bg-emerald-100 text-emerald-300 cursor-not-allowed"
              )}
            >
              <Send className="w-6 h-6 rotate-180" />
            </button>
          </div>
          <p className="text-center text-[10px] text-emerald-400 mt-2 font-medium">
            اردو جوک بوٹ - آپ کی خوشی، ہماری ترجیح
          </p>
        </div>
      </footer>
    </div>
  );
}
