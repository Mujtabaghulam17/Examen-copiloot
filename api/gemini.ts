import { GoogleGenAI } from "@google/genai";
import type { GenerateContentParameters, GenerateContentResponse } from '@google/genai';

export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MAX_RETRIES = 3;

// A generic retry wrapper for generateContent
export const generateContentWithRetry = async (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            // It's important to create a new AI instance if API key can change,
            // but for now we assume it's static during the app lifecycle.
            const response = await ai.models.generateContent(params);
            return response;
        } catch (error) {
            console.warn(`Gemini API call failed (attempt ${attempt}/${MAX_RETRIES}):`, error);
            if (attempt === MAX_RETRIES) {
                console.error("All retry attempts failed.", error);
                throw error; // Re-throw the error after the final attempt
            }
            // Exponential backoff
            const delay = 1000 * Math.pow(2, attempt - 1);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    // This part should not be reachable, but is needed for TS to be happy
    throw new Error("generateContentWithRetry failed unexpectedly.");
};
