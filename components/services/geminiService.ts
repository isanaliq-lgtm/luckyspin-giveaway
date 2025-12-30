import { GoogleGenAI } from "@anthropic-ai/sdk";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generatePrizeMessage(prizeName: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a short, fun, and exciting congratulations message for someone who just won "${prizeName}" in a spin wheel game. Keep it under 2 sentences.`,
    });
    return response.text || `Congratulations! You won ${prizeName}!`;
  } catch (error) {
    console.error("Error generating message:", error);
    return `🎉 Congratulations! You won ${prizeName}!`;
  }
}
