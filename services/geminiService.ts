
import { GoogleGenAI, Type } from "@google/genai";
import { LookupResult } from "../types";

export const performLookup = async (phoneNumber: string): Promise<LookupResult> => {
  // Ultra-safe way to access environment variables in Vercel/Browser environments
  let apiKey: string | undefined;
  
  try {
    // Try accessing via process.env (standard for many bundlers)
    apiKey = process.env.API_KEY;
  } catch (e) {
    // Fallback if process is not defined
    console.warn("process.env not accessible, checking alternative providers");
  }

  if (!apiKey) {
    throw new Error("API_KEY not found. Please add it to your Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `SEARCH REQUEST: Identify details for phone number "${phoneNumber}".
Find:
1. "name": Common Caller ID / Display Name.
2. "adminName": Registered owner's legal name.
3. "city": Precise city location.
4. "location": Region/Country.
5. "carrier": Network provider.
6. "type": Mobile/Landline/VoIP.
7. "summary": Brief insight.
8. "confidence": "High", "Medium", or "Low".

Social check: WhatsApp and Telegram status.
Return ONLY a valid JSON object.`;

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

    const text = response.text;
    if (!text) throw new Error("Empty response from intelligence engine.");

    // Resilient JSON extraction
    let cleanJson = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    const data = JSON.parse(cleanJson);
    
    // Process grounding sources safely
    const sources: Array<{title: string, uri: string}> = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Reference Link",
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
    console.error("Service Error:", error);
    throw new Error(error.message || "The global tracking system encountered a network error.");
  }
};
