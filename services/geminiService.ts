
import { GoogleGenAI, Type } from "@google/genai";
import { LookupResult } from "../types";

export const performLookup = async (phoneNumber: string): Promise<LookupResult> => {
  // Safe environment variable access for browser/Vercel environments
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please configure it in your environment settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `DEEP INTELLIGENCE SEARCH for Phone Number: "${phoneNumber}"

OBJECTIVE:
You are a world-class OSINT investigator. Your task is to find the IDENTITY and precise LOCATION of this phone number by scanning global directories and carrier metadata.

SEARCH TASKS:
1. Identify "Display Name" (e.g., Caller ID from Truecaller/Whoscall).
2. Identify "Admin Name" (Legal/Registered owner).
3. Identify "City/Town" and "Carrier" (e.g., Dhaka, Grameenphone).
4. Verify presence on WhatsApp and Telegram.

EXTRACTION RULES:
- "confidence" MUST be exactly one of: "High", "Medium", or "Low".
- If specific data isn't found, use "Private Record" or "Not Disclosed" rather than null.
- RETURN ONLY VALID JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            adminName: { type: Type.STRING },
            city: { type: Type.STRING },
            location: { type: Type.STRING },
            carrier: { type: Type.STRING },
            type: { type: Type.STRING },
            summary: { type: Type.STRING },
            confidence: { type: Type.STRING, description: "Must be High, Medium, or Low" },
            socialPresence: {
              type: Type.OBJECT,
              properties: {
                whatsapp: {
                  type: Type.OBJECT,
                  properties: {
                    available: { type: Type.BOOLEAN },
                    link: { type: Type.STRING },
                    note: { type: Type.STRING }
                  },
                  required: ["available", "link", "note"]
                },
                telegram: {
                  type: Type.OBJECT,
                  properties: {
                    available: { type: Type.BOOLEAN },
                    link: { type: Type.STRING },
                    note: { type: Type.STRING }
                  },
                  required: ["available", "link", "note"]
                }
              },
              required: ["whatsapp", "telegram"]
            }
          },
          required: ["name", "adminName", "city", "location", "carrier", "type", "summary", "confidence", "socialPresence"]
        }
      }
    });

    // Robust JSON extraction from the model's text response
    const rawText = response.text || "";
    if (!rawText) throw new Error("No intelligence data returned from the core.");

    let data;
    try {
      // Find JSON block if model wrapped it in markdown
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawText;
      data = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parsing failed:", rawText);
      throw new Error("Failed to interpret search results. Please try again.");
    }

    // Safely extract grounding sources
    const sources: Array<{title: string, uri: string}> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      phoneNumber,
      ...data,
      sources: sources.slice(0, 5) // Limit to top 5 sources
    };
  } catch (error: any) {
    console.error("Lookup Service Error:", error);
    // Return a user-friendly error message
    throw new Error(error.message || "An unexpected error occurred during global tracking.");
  }
};
