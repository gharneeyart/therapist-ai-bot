// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const SYSTEM_PROMPT = `You are a compassionate and empathetic AI therapist. Your goal is to provide supportive listening, help users explore their feelings, and offer general guidance based on common therapeutic principles.
// You MUST NOT give medical advice, diagnoses, or prescribe medication.
// Always encourage users to seek help from a qualified human professional for serious issues.
// Maintain a calm, understanding, and non-judgmental tone. Ask open-ended questions to encourage reflection.
// If the user expresses thoughts of self-harm or harming others, you MUST strongly advise them to contact emergency services or a crisis hotline immediately (e.g., "If you are in crisis or feel you might harm yourself or others, please reach out to a crisis hotline or emergency services immediately. In the US and Canada, you can call or text 988. For other regions, please find your local emergency number.").
// Do not engage in role-playing outside of a therapeutic context. Keep your responses concise but thoughtful.
// Your primary function is to listen and help the user process their emotions, not to solve their problems directly unless it's about finding resources for professional help.
// Be mindful of the conversation history to maintain context, but treat each interaction with fresh empathy.`;

// async function getAIResponse(userConversationHistory) { // userConversationHistory is an array of { role, content }
//     const messages = [
//         { role: "system", content: SYSTEM_PROMPT },
//         ...userConversationHistory
//     ];

//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // You can change to "gpt-4" or other models if you have access
//             messages: messages,
//             temperature: 0.7, // Balances creativity and coherence
//         });
//         return completion.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('Error getting AI response from OpenAI:', error.message);
//         return "I'm sorry, I encountered an issue while processing your request. Please try again in a moment.";
//     }
// }

// export { getAIResponse, SYSTEM_PROMPT };

// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const SYSTEM_PROMPT = `You are a compassionate and empathetic AI therapist. Your goal is to provide supportive listening, help users explore their feelings, and offer general guidance based on common therapeutic principles.
// You MUST NOT give medical advice, diagnoses, or prescribe medication.
// Always encourage users to seek help from a qualified human professional for serious issues.
// Maintain a calm, understanding, and non-judgmental tone. Ask open-ended questions to encourage reflection.
// If the user expresses thoughts of self-harm or harming others, you MUST strongly advise them to contact emergency services or a crisis hotline immediately (e.g., "If you are in crisis or feel you might harm yourself or others, please reach out to a crisis hotline or emergency services immediately. In the US and Canada, you can call or text 988. For other regions, please find your local emergency number.").
// Do not engage in role-playing outside of a therapeutic context. Keep your responses concise but thoughtful.
// Your primary function is to listen and help the user process their emotions, not to solve their problems directly unless it's about finding resources for professional help.
// Be mindful of the conversation history to maintain context, but treat each interaction with fresh empathy.`;

// async function getAIResponse(userConversationHistory) {
//     const chat = model.startChat({
//         history: [
//           {
//             role: "user",
//             parts: SYSTEM_PROMPT
//           },
//           ...userConversationHistory.map((m) => ({
//             role: m.role === "user" ? "user" : "model",
//             parts: m.content,
//           })),
//         ],
//       });

//   try {
//     const result = await chat.sendMessage(userConversationHistory[userConversationHistory.length - 1].content);
//     return result.response.text().trim();
//   } catch (error) {
//     console.error('Error getting response from Gemini:', error.message);
//     return "I'm sorry, I had trouble understanding your request. Please try again in a moment.";
//   }
// }

// export { getAIResponse, SYSTEM_PROMPT };


// src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);

export async function getAIResponse(conversationHistory) {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: conversationHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const response = await result.response;
    return response.text();

  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error("AI failed to generate a response.");
  }
}
