import React from 'react';
import { NotionNote } from '../types';
import { ICONS } from '../constants';

interface MemoryCardProps {
  note: NotionNote;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ note }) => {
  return (
    <div className="group relative bg-notion-card border border-white/5 hover:border-notion-blue/50 rounded-xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
      {/* Absolute "Open" button that appears on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <a 
            href={note.url} // 👈 Is this exact property name used?
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-notion-blue text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-500/50"
        >
            <ICONS.Notion />
            Open
        </a>
      </div>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-3xl select-none filter grayscale group-hover:grayscale-0 transition-all">
            {note.icon}
          </div>
          <div className="flex-1 pr-16">
            <h3 className="font-semibold text-white text-lg leading-tight mb-1 group-hover:text-notion-blue transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-notion-dim">
              <span className="bg-white/5 px-1.5 py-0.5 rounded">{note.type}</span>
              <span>•</span>
              <span>{note.lastEdited}</span>
            </div>
          </div>
        </div>

        {/* Quote/Excerpt */}
        <div className="relative pl-4 border-l-2 border-white/10 group-hover:border-notion-blue/50 transition-colors mb-4">
          <p className="font-serif text-notion-text/90 italic text-sm leading-relaxed">
            "{note.excerpt}"
          </p>
        </div>

        {/* Relevance "Spark" */}
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex items-start gap-2">
            <div className="text-yellow-500 mt-0.5">
              <ICONS.Sparkles />
            </div>
            <p className="text-xs text-notion-dim font-medium leading-snug">
              <span className="text-yellow-500/80 uppercase tracking-wider text-[10px] mr-1">Match:</span>
              {note.relevanceReason}
            </p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
            {note.tags.map(tag => (
                <span key={tag} className="text-[10px] text-notion-dim bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
                    #{tag}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
