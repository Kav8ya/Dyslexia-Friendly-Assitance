import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Configure the API to use our proxy
const genAI = new GoogleGenerativeAI(API_KEY, {
  baseUrl: '/api/generative'
});

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

export const analyzeResponse = async (
  userResponse: string,
  expectedAnswer: string,
  exerciseType: string,
  retryCount = 0
): Promise<{
  isCorrect: boolean;
  feedback: string;
}> => {
  try {
    const prompt = `
      As a dyslexia tutor, analyze this response:
      
      Exercise Type: ${exerciseType}
      Expected Answer: ${expectedAnswer}
      User's Response: ${userResponse}
      
      Evaluate the response considering:
      1. Content accuracy
      2. Key points covered
      3. Understanding of the concept
      
      Provide:
      1. A boolean indicating if the response is acceptable (true/false)
      2. Constructive feedback for the user
      
      Format your response exactly as:
      {
        "isCorrect": boolean,
        "feedback": "your feedback here"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        isCorrect: parsed.isCorrect,
        feedback: parsed.feedback
      };
    } catch (e) {
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error: any) {
    // Check if it's a rate limit error (429)
    if (error.message?.includes('429') && retryCount < MAX_RETRIES) {
      console.warn(`Rate limit hit, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      const delay = BASE_DELAY * Math.pow(2, retryCount); // Exponential backoff
      await sleep(delay);
      return analyzeResponse(userResponse, expectedAnswer, exerciseType, retryCount + 1);
    }

    // If we've exhausted retries or it's not a rate limit error, throw to trigger fallback
    throw error;
  }
};