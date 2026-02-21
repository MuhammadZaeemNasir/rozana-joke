import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function App() {
  const messages = useState<Message[]>([
    { role: 'bot', content: 'اسلام علیکم! آج کا جوک سناؤں؟ 😄' }
  ]);
  const input = useState('');
  const isLoading = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, );

  const handleSend = async () => {
    if (!input[0 0 0 1]('');
    messages[1 1](true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages[0]
        })
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const botReply = data.reply || "معذرت، کچھ غلط ہو گیا۔";

      messages[1](prev => );
    } catch (error) {
      messages[1 ...prev, { role: 'bot', content: "اوہو! انٹرنیٹ کا مسئلہ لگتا ہے۔ دوبارہ کوشش کریں بھئی۔" } 1](false);
    }
  };

  const resetChat = () => {
    messages[1]([{ role: 'bot', content: 'اسلام علیکم! آج کا جوک سناؤں؟ 😄' }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-orange-100 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-2xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-orange-600">روزانہ جوک بوٹ</h1>
            <p className="text-sm text-gray-500 font-medium">مزے دار اردو جوک</p>
          </div>
        </div>
        <button onClick={resetChat} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-orange-600" title="چیٹ ری سیٹ کریں">
          <RefreshCcw className="w-5 h-5" />
        </button>
      </header>

      <main className="w-full max-w-2xl flex-1 bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-orange-100">
          <AnimatePresence initial={false}>
            {messages[0].map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn("flex w-full gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", msg.role === 'user' ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600")}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn("max-w-[80%] px-5 py-3 rounded-2xl text-lg leading-relaxed", msg.role === 'user' ? "bg-orange-500 text-white rounded-tr-none text-right" : "bg-gray-50 text-gray-800 rounded-tl-none text-right")} dir="rtl">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading[0] && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-400" />
              </div>
              <div className="bg-gray-50 px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="text-sm text-gray-400 font-medium">جوک سوچ رہا ہوں...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-orange-50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input[0]}
              onChange={(e) => input[1](e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="یہاں جوک پوچھو..."
              dir="rtl"
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-14 text-lg focus:ring-2 focus:ring-orange-500 transition-all outline-none placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!input[0 0]}
              className="absolute right-3 p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-orange-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
