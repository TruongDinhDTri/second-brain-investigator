import React, { useState, useEffect } from 'react';
import { ICONS } from './constants';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { ChatMessage, SearchStatus } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notionKey, setNotionKey] = useState<string>('');

  useEffect(() => {
    const savedKey = localStorage.getItem('notion_api_key');
    if (savedKey) setNotionKey(savedKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'idle') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Convert current messages to history format for API
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await sendMessageToGemini(
        history, 
        userMsg.content, 
        (newStatus) => setStatus(newStatus as SearchStatus),
        notionKey // Pass the key
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        data: response.notes
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I lost the connection to the archive (or the API call failed). Please check your settings or try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="flex h-screen bg-notion-dark text-notion-text font-sans overflow-hidden selection:bg-notion-blue/30">
      
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        onSave={(key) => setNotionKey(key)} 
      />

      {/* Sidebar (Mobile Toggleable) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-notion-sidebar transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-white/5 flex flex-col`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg text-white">
            <ICONS.Brain />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white">Investigator</h1>
            <p className="text-[10px] text-notion-dim uppercase tracking-widest">Second Brain</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
           <div className="flex items-center justify-between mb-4 px-2">
             <span className="text-xs font-bold text-notion-dim uppercase tracking-wider">Recent Dives</span>
           </div>
           
           {/* Mock History Items */}
           <div className="space-y-1">
             {['Faith & Mountains', 'React Server Components', 'The Void Sketch'].map((item, i) => (
               <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all truncate">
                 {item}
               </button>
             ))}
           </div>
        </div>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/10">
                <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover opacity-80" />
             </div>
             <div className="flex-1">
                <div className="text-sm font-medium text-white">Wiganz</div>
                <div className="text-xs text-notion-dim">Software Engineer</div>
             </div>
           </div>
           
           {/* Settings Button */}
           <button 
             onClick={() => setSettingsOpen(true)}
             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-notion-dim hover:text-white hover:bg-white/5 rounded-md transition-all"
           >
             <ICONS.Settings />
             Settings & Keys
           </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-notion-dark/80 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="text-notion-dim hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="font-serif font-bold">Investigator</span>
          <div className="w-6"></div>
        </div>

        {/* Chat Area */}
        <ChatInterface messages={messages} status={status} />

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-notion-dark via-notion-dark to-transparent">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="relative flex items-center gap-4 bg-notion-sidebar border border-white/10 rounded-xl p-2 pl-4 shadow-2xl focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10 transition-all">
              <div className={`text-notion-dim transition-colors ${status !== 'idle' ? 'animate-spin text-notion-blue' : 'group-focus-within:text-white'}`}>
                {status !== 'idle' ? <ICONS.Loader /> : <ICONS.Search />}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search your 1M+ notes (e.g., 'What did I say about impossible limits?')"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-notion-dim/50 h-10"
                disabled={status !== 'idle'}
              />
              <button 
                type="submit"
                disabled={!input.trim() || status !== 'idle'}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
              >
                <ICONS.ArrowRight />
              </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-notion-dim/40 font-mono">
                    {status === 'idle' 
                      ? (notionKey ? 'Connected to Notion API' : 'Demo Mode • No Notion Key') 
                      : 'Agent Thinking...'}
                </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;