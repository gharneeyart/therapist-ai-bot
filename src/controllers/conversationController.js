import { Conversation } from "../models/conversation.js";

// Updated conversation history functions using Mongoose
async function getConversationHistory(userId, limit = 20) {
    if (!userId) {
        console.error('No userId provided to getConversationHistory');
        return [];
    }

    try {
        const conversation = await Conversation.findOne({ userId });
        if (conversation?.messages?.length) {
            return conversation.messages.slice(-Math.abs(limit));
        }
        return [];
    } catch (error) {
        console.error(`Error fetching conversation history for userId ${userId}:`, error);
        return [];
    }
}

async function addMessageToHistory(userId, message) {
    if (!userId || !message) {
        console.error('Missing required parameters in addMessageToHistory');
        return;
    }

    if (typeof message !== 'object' || !message.role || !message.content) {
        console.error('Invalid message format in addMessageToHistory', message);
        return;
    }
   
    if (!["user", "model"].includes(message.role)) {
        console.error("Invalid role in message:", message.role);
        throw new Error("Role must be 'user' or 'model'");
    }

    try {
        await Conversation.findOneAndUpdate(
            { userId },
            {
                $push: {
                    messages: {
                        $each: [message],
                        $slice: -1000
                    }
                },
                $set: { lastInteraction: new Date() }
            },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error(`Error adding message to history for userId ${userId}:`, error);
    }
}

export { getConversationHistory, addMessageToHistory };