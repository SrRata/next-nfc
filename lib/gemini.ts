// import { GoogleGenAI } from "@google/genai";

// // Initialization of the Gemini AI client
// // The API key is injected by the platform into the environment
// export const ai = new GoogleGenAI({ 
//   apiKey: process.env.GEMINI_API_KEY as string 
// });

// export const CHAT_MODEL = "gemini-3-flash-preview";



// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ 
  // Usamos NEXT_PUBLIC_ para que el cliente (browser) pueda leerla
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string 
});

export const CHAT_MODEL = "gemini-3-flash-preview";