import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Define the message type
export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: string;
}

// Define the state structure
interface ChatState {
  messagesByPage: {
    [page: string]: ChatMessage[];
  };
}

// Initial state
const initialState: ChatState = {
  messagesByPage: {}
};

// Create the slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Add a single message to a specific page
    addMessage: (state, action: PayloadAction<{ page: string; message: ChatMessage }>) => {
      const { page, message } = action.payload;
      
      // Initialize the messages array for this page if it doesn't exist
      if (!state.messagesByPage[page]) {
        state.messagesByPage[page] = [];
      }
      
      // Add the message
      state.messagesByPage[page].push(message);
    },
    
    // Clear messages for a specific page
    clearMessages: (state, action: PayloadAction<string>) => {
      const page = action.payload;
      state.messagesByPage[page] = [];
    },
    
    // Clear all messages
    clearAllMessages: (state) => {
      state.messagesByPage = {};
    }
  }
});

// Export actions
export const { 
  addMessage, 
  clearMessages, 
  clearAllMessages 
} = chatSlice.actions;

// Create selectors
export const selectChatMessages = (state: RootState, page: string) => 
  state.chat.messagesByPage[page] || [];


// Export reducer
export default chatSlice.reducer; 