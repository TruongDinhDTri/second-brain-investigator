export interface NotionNote {
  id: string;
  title: string;
  icon: string;
  excerpt: string;
  relevanceReason: string; // The "spark" or "why it matches"
  lastEdited: string;
  tags: string[];
  type: 'Note' | 'Journal' | 'Code' | 'Prayer';
  // 👈 ADD THIS NEW PROPERTY 
  url: string;
}

export interface AgentResponse {
  message: string; // The persona's spoken words
  notes: NotionNote[]; // The structured data found
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string; // Display text
  data?: NotionNote[]; // If assistant found notes
  isThinking?: boolean;
}

export type SearchStatus = 'idle' | 'analyzing' | 'deep-diving' | 'organizing' | 'complete';
