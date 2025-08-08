const GEMINI_API_KEY = 'AIzaSyDnPM2M905GRbQO5tRkeL4ai2qhVj7WnlI';

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateContent(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      system_instruction: {
        "act": "like buddy and friendly way",
        "expertise": "iexpert in every field"
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export default generateContent;
