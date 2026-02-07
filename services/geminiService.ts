
import { GoogleGenAI, Type } from "@google/genai";
import { LookupResult } from "../types";

export const performLookup = async (phoneNumber: string): Promise<LookupResult> => {
  // Accessing the API key from environment variables
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY খুঁজে পাওয়া যায়নি। দয়া করে Vercel-এর Settings > Environment Variables-এ গিয়ে 'API_KEY' যোগ করুন।");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are a professional global phone number investigator. 
Perform a deep search for the number: "${phoneNumber}".

Your goal is to find:
1. The most common display name (Caller ID from public records).
2. The legal name of the registered owner/admin if available.
3. The specific city or town where this number is registered.
4. The country and region.
5. The mobile network carrier name.
6. Check if this number is likely active on WhatsApp or Telegram.

Provide a high-quality summary of your findings.
MANDATORY: Return the results in JSON format only. If some details are private, return "Not Disclosed".`;

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
            confidence: { type: Type.STRING },
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

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    
    // Extract search sources for transparency
    const sources: Array<{title: string, uri: string}> = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Public Record Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      phoneNumber,
      ...data,
      sources
    };
  } catch (error: any) {
    console.error("Lookup Error:", error);
    throw new Error(error.message || "সার্ভারে সমস্যা হচ্ছে। দয়া করে একটু পর আবার চেষ্টা করুন।");
  }
};
