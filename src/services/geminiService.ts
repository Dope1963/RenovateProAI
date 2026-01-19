
import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize } from "../types";

// Helper to ensure API Key is present
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Image Analysis (Project Description) - Uses gemini-3-flash-preview for better availability
export const analyzeImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Suggest a renovation plan for this area to modernize it and increase value. Focus ONLY on the suggested changes (materials, colors, fixtures, style). Do NOT describe the current condition of the room." }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Error analyzing image.";
  }
};

// 2. Smart Project Description (Thinking Mode) - Uses gemini-3-flash-preview
export const generateSmartDescription = async (details: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional renovation project scope of work based on these notes: ${details}. Include estimated timelines and trade requirements.`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // allocating thinking budget
      }
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Thinking Error:", error);
    return "Error generating smart description.";
  }
};

// 3. Image Generation - Defaults to gemini-2.5-flash-image for 1K, upgrades to gemini-3-pro-image-preview for 2K/4K
export const generateAfterImage = async (
  base64BeforeImage: string, 
  prompt: string, 
  size: ImageSize = ImageSize.Resolution_1K
): Promise<string | null> => {
  try {
    const ai = getClient();
    
    // Determine model based on resolution request
    // gemini-2.5-flash-image is the general purpose model (supports 1:1, 4:3, etc but not specific resolutions like 2K/4K config)
    // gemini-3-pro-image-preview supports high-res and is stricter on permissions
    const isHighRes = size !== ImageSize.Resolution_1K;
    const model = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const config: any = {
      imageConfig: {
        aspectRatio: "4:3"
      }
    };

    // Only add imageSize for the Pro model which supports it
    if (isHighRes) {
      config.imageConfig.imageSize = size;
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: `A photorealistic renovation after photo based on the input image. ${prompt}` },
           { inlineData: { mimeType: 'image/jpeg', data: base64BeforeImage } },
        ],
      },
      config
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};

// 4. Image Editing (Refinement) - Uses gemini-2.5-flash-image
export const refineImage = async (base64Image: string, instruction: string): Promise<string | null> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Edit this image: ${instruction}. Maintain photorealism.` },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Refinement Error:", error);
    throw error;
  }
};
