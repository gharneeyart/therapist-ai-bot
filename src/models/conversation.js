import mongoose from "mongoose";

// Define Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [{
    role: {
      type: String,
      required: true,
      enum: ['user', 'model']
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastInteraction: {
    type: Date,
    default: Date.now
  }
});

// Create Conversation Model
const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation };