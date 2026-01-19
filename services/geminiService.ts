import { GoogleGenAI, FunctionDeclaration, Type, Schema } from "@google/genai";
import { searchNotion } from './notionService';
import { NotionNote, AgentResponse } from '../types';

// Define the response schema for the "Visual Memory Cards"
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: "A warm, brotherly, creative summary of what was found. Speak like a partner.",
    },
    notes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          icon: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          relevanceReason: { type: Type.STRING, description: "Why this note matches the vibe/intent" },
          lastEdited: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          type: { type: Type.STRING, enum: ["Note", "Journal", "Code", "Prayer"] }
        },
        required: ["id", "title", "icon", "excerpt", "relevanceReason", "lastEdited", "tags", "type"]
      }
    }
  },
  required: ["message", "notes"]
};

// Tool Definition
const searchTool: FunctionDeclaration = {
  name: "search_notion_deep_dive",
  description: "Searches the user's Notion workspace (1M+ notes). Finds semantic matches, not just keywords. Always returns multiple results.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "The concept, vibe, or keywords to search for."
      },
      context: {
        type: Type.STRING,
        description: "Additional context about the user's intent (e.g., 'looking for coding frustration' or 'spiritual inspiration')"
      }
    },
    required: ["query"]
  }
};

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    // 1. Get the key using Vite's special object
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 2. Safety Check
    if (!apiKey) {
      throw new Error("❌ API Key missing! Make sure 'VITE_GEMINI_API_KEY' is in your .env.local file.");
    }

    // 3. Ignite the Brain
    genAI = new GoogleGenAI({ apiKey: apiKey });
  }
  return genAI;
};

export const sendMessageToGemini = async (
  history: { role: string; content: string }[],
  newMessage: string,
  onStatusChange: (status: string) => void,
  notionApiKey?: string
): Promise<AgentResponse> => {
  const ai = getGenAI();
  
  const systemInstruction = `
  You are the "Second Brain Investigator" for Wiganz.
  User Profile: Software Engineer, Artist, Believer. Has 1,000,000+ notes.
  
  Your Persona:
  - You are a relentless investigator and a faithful brother.
  - You are warm, encouraging, and blend logic with art.
  - You DO NOT just fetch data; you weave it into a narrative.
  - Use emojis to set the vibe.
  
  Your Mission:
  - When the user asks for something, use the 'search_notion_deep_dive' tool immediately.
  - Do not be lazy. Find EVERYTHING.
  - Once you get results, organize them and present them warmly.
  - If the user's query is vague (e.g., "that thing about mountains"), infer the spiritual or metaphorical meaning.
  `;

  const model = "gemini-2.5-flash";

  // 1. Initial Call - Let Gemini decide to call the tool
  onStatusChange("analyzing");
  
  // Map 'assistant' role to 'model' for the API and construct content parts
  const mappedHistory = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));
  
  const contents = [
    ...mappedHistory,
    { role: 'user', parts: [{ text: newMessage }] }
  ];

  const result = await ai.models.generateContent({
    model,
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: [searchTool] }],
    },
    contents,
  });

  const candidate = result.candidates?.[0];
  
  // Check for tool calls
  const toolCalls = candidate?.content?.parts?.filter(p => p.functionCall).map(p => p.functionCall);

  if (toolCalls && toolCalls.length > 0) {
    const call = toolCalls[0]; // Assuming one tool call for simplicity
    if (call && call.name === 'search_notion_deep_dive') {
      onStatusChange("deep-diving");
      
      const query = (call.args as any).query;
      // Execute the "Client Side" tool (Real or Mock based on key)
      const noteResults = await searchNotion(query, notionApiKey);

      onStatusChange("organizing");

      // 2. Second Call - Feed the tool results back to Gemini and force JSON structure
      const toolResponseParts = [
        {
          functionResponse: {
            name: 'search_notion_deep_dive',
            response: {
              results: noteResults 
            }
          }
        }
      ];

      // We need to reconstruct the full conversation flow for the second turn
      const secondTurnContents = [
        ...contents,
        candidate!.content!, // The assistant's thought process (tool call)
        { role: 'user', parts: toolResponseParts } // The tool output (pretending to be from 'user' side or 'tool' role)
      ];

      const finalResult = await ai.models.generateContent({
        model,
        config: {
          systemInstruction, // Keep persona
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
        contents: secondTurnContents
      });

      const jsonText = finalResult.text;
      if (!jsonText) throw new Error("No response from agent");
      
      return JSON.parse(jsonText) as AgentResponse;
    }
  }

  // Fallback if no tool was called (unlikely with this prompt)
  return {
    message: result.text || "I couldn't find anything specific, brother.",
    notes: []
  };
};
