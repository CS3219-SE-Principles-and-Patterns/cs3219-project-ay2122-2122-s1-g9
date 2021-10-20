import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface ChatState {
  isVisible: boolean;
}

const initialState: ChatState = {
  isVisible: true,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsVisible: (state, action) => {
      state.isVisible = action.payload;
    },
  },
});

export const { setIsVisible } = chatSlice.actions;

export const getIsVisible = (state: RootState) => state.chat.isVisible;

export default chatSlice.reducer;
