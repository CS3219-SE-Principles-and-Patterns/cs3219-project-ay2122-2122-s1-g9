import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface ChatState {
  isVisible: boolean;
  hasNewMessage: boolean;
}

const initialState: ChatState = {
  isVisible: true,
  hasNewMessage: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsVisible: (state, action) => {
      state.isVisible = action.payload;
    },
    setHasNewMessage: (state, action) => {
      state.hasNewMessage = action.payload;
    },
  },
});

export const { setIsVisible, setHasNewMessage } = chatSlice.actions;

export const getIsVisible = (state: RootState) => state.chat.isVisible;
export const getHasNewMessage = (state: RootState) => state.chat.hasNewMessage;

export default chatSlice.reducer;
