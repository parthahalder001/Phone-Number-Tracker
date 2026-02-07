
import { GoogleGenAI, Type } from "@google/genai";
import { LookupResult } from "../types";

export const performLookup = async (phoneNumber: string): Promise<LookupResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `DEEP INTELLIGENCE SEARCH for Phone Number: "${phoneNumber}"

OBJECTIVE:
You are an expert global directory investigator. Your goal is to find the IDENTITY and precise LOCATION of this phone number.

SEARCH TASKS (CRITICAL):
1. Extract the "Display Name" (Caller ID) as seen on Truecaller, Whoscall, and public directories.
2. Identify the "Admin Name" (Registered Owner) from carrier-linked records, subscription indices, or social profiles.
3. Identify the specific "City" or "Town" from telecommunication prefixes and public directory metadata.
4. Check activity on WhatsApp and Telegram.

EXTRACTION RULES:
- "name": The most common name used for caller ID.
- "adminName": The primary person or organization the number is registered under.
- "city": The specific city or urban area (e.g., "Dhaka", "Mumbai", "London").
- "location": The full state/region and country (e.g., "Bangladesh", "West Bengal, India").
- "carrier": The mobile network operator.
- "type": Connection category (Mobile, Landline, VoIP).
- "summary": A 2-sentence overview of the findings.

MANDATORY: If a name is visible in any public search snippet or directory, you MUST return it. Do NOT return "Unknown" if any identity trace exists. Use 'gemini-3-pro-preview' logic to solve the identity.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common display name" },
          adminName: { type: Type.STRING, description: "Legal or registered owner name" },
          city: { type: Type.STRING, description: "Specific city or municipality" },
          location: { type: Type.STRING, description: "State, Region, and Country" },
          carrier: { type: Type.STRING, description: "Network provider name" },
          type: { type: Type.STRING, description: "Mobile/Landline" },
          summary: { type: Type.STRING, description: "Findings summary" },
          confidence: { type: Type.STRING, description: "High, Medium, or Low" },
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

  const jsonStr = response.text;
  const data = JSON.parse(jsonStr);
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Directory Snippet",
    uri: chunk.web?.uri || ""
  })).filter((s: any) => s.uri !== "") || [];

  return {
    phoneNumber,
    ...data,
    sources
  };
};
