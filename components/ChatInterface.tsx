import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import MemoryCard from './MemoryCard';
import { ICONS } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  status: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, status }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
      {/* Intro Placeholder */}
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 select-none pointer-events-none mt-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <ICONS.Brain />
          </div>
          <h2 className="text-2xl font-serif font-light text-notion-text mb-2">Second Brain Investigator</h2>
          <p className="text-sm text-notion-dim max-w-md">
            I have access to your 1,000,000+ notes. Ask me anything vague, and I'll find the deep connections.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${msg.role === 'assistant' ? 'items-start' : 'items-end'}`}>
          
          {/* Message Bubble */}
          <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-2xl shadow-sm border ${
            msg.role === 'user' 
              ? 'bg-notion-hover border-transparent text-white rounded-br-none' 
              : 'bg-black/20 border-white/5 text-notion-text rounded-bl-none backdrop-blur-sm'
          }`}>
            <div className="flex items-center gap-3 mb-2 opacity-50 text-xs uppercase tracking-widest font-bold">
              {msg.role === 'user' ? 'You' : 'Investigator'}
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>

          {/* Results Grid (Only for Assistant) */}
          {msg.data && msg.data.length > 0 && (
            <div className="w-full pl-0 md:pl-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {msg.data.map((note) => (
                  <MemoryCard key={note.id} note={note} />
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                 <button className="text-xs text-notion-dim hover:text-white flex items-center gap-1 transition-colors">
                    View all {msg.data.length} matches in Notion <ICONS.ArrowRight />
                 </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Status Indicator */}
      {status !== 'idle' && status !== 'complete' && (
        <div className="flex items-center gap-3 text-notion-dim text-sm animate-pulse pl-4">
            <div className="text-notion-blue"><ICONS.Loader /></div>
            <span className="capitalize font-mono">{status.replace('-', ' ')}...</span>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default ChatInterface;
