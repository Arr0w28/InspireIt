// api.tsx
import axios from "axios";

const BASE_URL ="http://34.172.161.191:8000"//process.env.REACT_APP_BASE_URL //"http://34.172.161.191:8000"; // Adjust if needed
console.log(BASE_URL)
export const fetchGenerate = async () => {
  const response = await axios.get(`${BASE_URL}/generate/`);
  return response.data;
};

export const submitGenerate = async (domains: string[], specifications: string) => {
  const response = await axios.post(`${BASE_URL}/generate/submit/`, { domains, specifications });
  return response.data;
};

export const postRecommend = async (paperData: {
  title: string;
  summary: string;
  drawbacks: string[];
  opportunities: string[];
}) => {
  const response = await axios.post(`${BASE_URL}/recommend/suggested/`, paperData);
  return response.data;
};

// ✅ New function to call the extra suggestions API
export const generateWithSuggestions = async (origDetails: {
  title: string;
  summary: string;
  drawbacks: string[];
  opportunities: string[];
}, specifications: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/generate/submit/extra-suggestions/`, {
      origDetails,
      specifications,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating extra suggestions:", error);
    throw error;
  }
};

export const sendChatMessage = async (message: string) => {
  try {
    console.log(message);
    const response = await axios.post(`${BASE_URL}/chatbot/`, { message });
    return response.data; // Should return the chatbot response
  } catch (error) {
    console.error("Chatbot API error:", error);
    return { response: "Failed to fetch chatbot response." };
  }
};

