import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('notion_api_key');
    if (savedKey) setApiKey(savedKey);
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('notion_api_key', apiKey);
    onSave(apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-notion-card border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ICONS.Settings /> Notion Integration
          </h2>
          <button onClick={onClose} className="text-notion-dim hover:text-white transition-colors">
            <ICONS.Close />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-notion-dim uppercase tracking-wider mb-2">
              Internal Integration Token
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_..."
              className="w-full bg-notion-hover border border-white/10 rounded-lg px-4 py-3 text-white placeholder-notion-dim/50 focus:outline-none focus:border-notion-blue focus:ring-1 focus:ring-notion-blue transition-all"
            />
            <p className="mt-2 text-xs text-notion-dim">
              This key is stored locally. You must create an integration at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-notion-blue hover:underline">Notion Developers</a> and share your pages with it.
            </p>
            <p className="mt-1 text-xs text-yellow-500/80">
              Note: Direct browser calls to Notion API may be blocked by CORS unless you use a proxy or disable CORS security in your dev environment.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-notion-dim hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-notion-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              Save Connection
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SettingsModal;