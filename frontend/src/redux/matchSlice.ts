import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface MatchState {
  isQueuing: boolean;
  sessionId: string | null;
}

const initialState: MatchState = {
  isQueuing: false,
  sessionId: null,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setIsQueuing: (state, action) => {
      state.isQueuing = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
  },
});

export const { setIsQueuing, setSessionId } = matchSlice.actions;

export const getIsQueuing = (state: RootState) => state.match.isQueuing;

export default matchSlice.reducer;
