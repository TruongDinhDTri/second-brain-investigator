import { NotionNote } from '../types';

const MOCK_TOPICS = [
  {
    keywords: ['impossible', 'faith', 'limit', 'belief', 'miracle', 'mountain'],
    generate: (id: string): NotionNote[] => [
      {
        id: `note-${id}-1`,
        title: "Nothing is Impossible (Sermon Notes)",
        icon: "🏔️",
        excerpt: "Faith isn't about ignoring reality, it's about superseding it. If you can speak to the mountain...",
        relevanceReason: "Direct concept match: Discusses the nature of the impossible through a spiritual lens.",
        lastEdited: "Oct 24, 2023",
        tags: ["Faith", "Sunday Service"],
        type: "Prayer"
      },
      {
        id: `note-${id}-2`,
        title: "Recursion & Infinity limits",
        icon: "💻",
        excerpt: "We often think stack overflow is an impossible wall, but tail call optimization proves otherwise. Limits are often architectural choices.",
        relevanceReason: "Metaphorical match: Explores technical limits and how to bypass them.",
        lastEdited: "Jan 12, 2024",
        tags: ["CS Concepts", "Algorithms"],
        type: "Code"
      },
      {
        id: `note-${id}-3`,
        title: "The Canvas of the Void",
        icon: "🎨",
        excerpt: "To create art is to pull something out of nothing. It is the ultimate act of defiance against the impossible.",
        relevanceReason: "Artistic perspective: Viewing creation as an act of overcoming nothingness.",
        lastEdited: "Mar 05, 2023",
        tags: ["Art Theory", "Musings"],
        type: "Journal"
      },
      {
        id: `note-${id}-4`,
        title: "Project: Lazarus (Reviving the Legacy Code)",
        icon: "⚡",
        excerpt: "They said refactoring this monolith was impossible. Day 4: Found the seam in the dependency graph.",
        relevanceReason: "Professional context: Overcoming a specific 'impossible' engineering challenge.",
        lastEdited: "Nov 15, 2023",
        tags: ["Work", "Refactoring"],
        type: "Code"
      },
      {
        id: `note-${id}-5`,
        title: "Quote Collection: Limits",
        icon: "❝",
        excerpt: "The only way to discover the limits of the possible is to go beyond them into the impossible. - Arthur C. Clarke",
        relevanceReason: "Direct quote match in your commonplace book.",
        lastEdited: "Dec 01, 2022",
        tags: ["Commonplace", "Quotes"],
        type: "Note"
      }
    ]
  },
  // Default fallback if no keywords match strictly
  {
    keywords: ['default'],
    generate: (id: string): NotionNote[] => [
      {
        id: `note-${id}-gen-1`,
        title: "Journal: The quiet mornings",
        icon: "☕",
        excerpt: "There is a clarity at 5AM that doesn't exist at 5PM. The code flows different.",
        relevanceReason: "Vibe match: Matches your reflective and productive persona.",
        lastEdited: "Yesterday",
        tags: ["Journal", "Routine"],
        type: "Journal"
      },
      {
        id: `note-${id}-gen-2`,
        title: "React Server Components Draft",
        icon: "⚛️",
        excerpt: "Thinking about how to structure the new dashboard. Client vs Server boundaries are blurring.",
        relevanceReason: "Technical relevance: Related to your work as a Software Engineer.",
        lastEdited: "Last Week",
        tags: ["Dev", "React"],
        type: "Code"
      },
      {
        id: `note-${id}-gen-3`,
        title: "Sketching the Invisible",
        icon: "✏️",
        excerpt: "Trying to draw the feeling of hope. It looks like a sunrise but inverted.",
        relevanceReason: "Artistic match: From your sketchbook notes.",
        lastEdited: "2 weeks ago",
        tags: ["Art", "Sketches"],
        type: "Note"
      }
    ]
  }
];

export const mockSearchNotion = async (query: string): Promise<NotionNote[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerQuery = query.toLowerCase();
  
  // Find matching topic generator
  const match = MOCK_TOPICS.find(topic => 
    topic.keywords.some(k => lowerQuery.includes(k))
  );

  const generator = match ? match.generate : MOCK_TOPICS[MOCK_TOPICS.length - 1].generate;
  
  // Return generated notes
  return generator(Date.now().toString());
};

const mapNotionResultToNote = (page: any): NotionNote => {
  const icon = page.icon?.emoji || "📄";
  
  // Try to find the title property
  let title = "Untitled";
  if (page.properties) {
    const titleProp = Object.values(page.properties).find((p: any) => p.id === 'title') as any;
    if (titleProp && titleProp.title && titleProp.title.length > 0) {
      title = titleProp.title.map((t: any) => t.plain_text).join('');
    }
  }

  // Identify type based on properties or default to Note
  let type: NotionNote['type'] = 'Note';
  const tags: string[] = [];

  // Rudimentary tag extraction from 'Multi-select' or 'Select' properties
  Object.values(page.properties || {}).forEach((prop: any) => {
    if (prop.type === 'multi_select') {
      prop.multi_select.forEach((opt: any) => tags.push(opt.name));
    } else if (prop.type === 'select' && prop.select) {
      tags.push(prop.select.name);
    }
  });

  return {
    id: page.id,
    title,
    icon,
    excerpt: `Found in Notion workspace. Click 'Open' to read full content. (ID: ${page.id.slice(0,6)})`,
    relevanceReason: "Found via direct Notion API search.",
    lastEdited: new Date(page.last_edited_time).toLocaleDateString(),
    tags: tags.slice(0, 3), // Limit tags
    type,
    url: page.url // Assuming page.url exists
    
  };
};

// services/notionService.ts

// 1. Point to your Python Bridge (Make sure server.py is running!)
const BRIDGE_URL = "http://localhost:8000/api/search"; 

export const searchNotion = async (query: string, apiKey?: string): Promise<NotionNote[]> => {
  // Note: We don't even need the apiKey here anymore because 
  // your server.py holds the key! But we keep the signature to not break things.
  
  try {
    console.log(`🔌 Connecting to Python Bridge for: '${query}'...`);

    // 2. Talk to localhost:8000 instead of api.notion.com
    const response = await fetch(BRIDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Bridge Error: ${response.status}`);
    }

    const data = await response.json();
    
    // 3. Map the REAL data
    // (This logic assumes your server.py returns the raw Notion response)
    const pages = data.results.filter((r: any) => r.object === 'page');
    return pages.map(mapNotionResultToNote);

  } catch (error) {
    console.error("❌ Real connection failed:", error);
    throw error; // Throw the error so we know it failed, instead of showing mocks!
  }
};
