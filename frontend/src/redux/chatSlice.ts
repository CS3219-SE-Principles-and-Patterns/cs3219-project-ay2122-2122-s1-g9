import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface ChatState {
  messages: string[];
}

const initialState: ChatState = {
  messages: [],
};

// Sample slice
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      state.messages.push(action.payload.message);
    },
  },
});

export const { addNewMessage } = chatSlice.actions;

export const getMessages = (state: RootState): string[] => state.chat.messages;

export default chatSlice.reducer;
