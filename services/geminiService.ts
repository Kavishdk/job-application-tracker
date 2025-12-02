import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ParsedJDResponse } from "../types";

const modelName = "gemini-2.5-flash";

const jdSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING, description: "Name of the hiring company" },
    role: { type: Type.STRING, description: "Job title or role" },
    location: { type: Type.STRING, description: "Job location (Remote, City, etc.)" },
    salary: { type: Type.STRING, description: "Salary range or compensation details if available" },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of required technical skills and technologies"
    },
    experience: { type: Type.STRING, description: "Required years of experience or level (Junior, Senior)" },
    jobLink: { type: Type.STRING, description: "URL to the job posting if present in text" },
    source: { type: Type.STRING, description: "The platform where the job was found (e.g., LinkedIn, Indeed, Company Website)" },
    jobType: { type: Type.STRING, description: "Type of employment. Must be one of: 'Full Time', 'Intern', 'Intern + Full Time'" },
    summary: { type: Type.STRING, description: "A concise 2-sentence summary of the job description" }
  },
  required: ["company", "role", "skills", "summary"],
};

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const parseJobDescription = async (rawText: string): Promise<ParsedJDResponse> => {
  try {
    const ai = getAiClient();
    if (!ai) {
      throw new Error("API Key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Extract clean JSON from the following job description. If a field is not found, use an empty string or empty array.
      
      JOB DESCRIPTION:
      ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: jdSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsedData = JSON.parse(text) as ParsedJDResponse;
    return parsedData;

  } catch (error) {
    console.error("Error parsing JD with Gemini:", error);
    throw error;
  }
};