import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am your AI assistant. How can I help you achieve your goals today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast, onProgressGoals, dailyTasks, settingsForm } = useApp();

  const getDashboardContext = () => {
    const activeGoals = onProgressGoals.map(g => `- ${g.title} (${g.progress}% progress, due ${g.dueDate})`).join('\n');
    const tasks = dailyTasks.map(t => `- ${t.title} [${t.startTime} - ${t.endTime}] (${t.done ? 'COMPLETED' : 'PENDING'})`).join('\n');
    return `USER: ${settingsForm.name}\n\nACTIVE GOALS:\n${activeGoals || 'No active goals'}\n\nTODAY'S TACTICAL TASKS:\n${tasks || 'No tasks for today'}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const dashboardContext = getDashboardContext();
      
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: { 
          messages: [...messages, userMsg].filter(m => m.role !== 'system'),
          context: dashboardContext
        }
      });

      if (error) throw error;

      if (data && data.choices && data.choices.length > 0) {
        const aiMsg: Message = data.choices[0].message;
        setMessages(prev => [...prev, aiMsg]);
        
        await supabase.from('chat_messages').insert([
           { role: 'user', content: userMsg.content },
           { role: 'assistant', content: aiMsg.content }
        ]);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      addToast('error', `Chat Error: ${err.message || 'Connection failed'}`);
      setMessages(prev => [...prev, { role: 'assistant', content: `Operation failed: ${err.message || 'I cannot connect to my cognitive core right now.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-[#022c22] rounded-full shadow-lg flex items-center justify-center text-[#bef264] hover:scale-110 transition-transform z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <iconify-icon icon="solar:chat-round-dots-bold-duotone" width="28" height="28" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-8 right-8 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#dcfce7] flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-[#022c22] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#bef264] flex items-center justify-center text-[#022c22]">
              <iconify-icon icon="solar:cpu-bolt-bold-duotone" width="18" height="18" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">AI Assistant</h3>
              <p className="text-[#bef264]/80 text-[10px] uppercase font-bold tracking-widest mt-0.5">Powered by Groq</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <iconify-icon icon="solar:clipboard-remove-linear" width="24" height="24" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f0fdf4]/50 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#bef264] text-[#022c22] rounded-br-none border border-[#86efac]' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-[#dcfce7] shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#dcfce7] rounded-bl-none rounded-2xl px-4 py-3 flex gap-1 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#022c22]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#022c22]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#022c22]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#dcfce7]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#bef264] focus:border-transparent text-[#022c22] placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#022c22] text-[#bef264] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#022c22]/90 transition-colors"
            >
              <iconify-icon icon="solar:play-bold" width="16" height="16" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
