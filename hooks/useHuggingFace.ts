import { useState } from "react";

// File: hooks/useHuggingFace.ts
import axios from "axios";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models";
const HUGGING_FACE_API_KEY = "YOUR_HUGGING_FACE_API_KEY"; // Replace with your actual API key

export const useHuggingFace = () => {
  const getAIResponse = async (userMessage: string) => {
    try {
      const response = await axios.post(
        `${HUGGING_FACE_API_URL}/your-model-name`, // Replace with the model name you want to use
        { inputs: userMessage },
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extract the generated text from the response
      const aiResponse = response.data[0]?.generated_text || "I'm not sure how to respond.";
      return aiResponse.trim();
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw new Error("Failed to fetch AI response.");
    }
  };

  return { getAIResponse };
};
