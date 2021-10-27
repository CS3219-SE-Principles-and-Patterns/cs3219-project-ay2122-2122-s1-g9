import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface MatchState {
  isQueuing: boolean;
  sessionId: string | null;
  qnsId: string | null;
  isDefaultCodeWriter: boolean;
}

const initialState: MatchState = {
  isQueuing: false,
  sessionId: null,
  qnsId: null,
  isDefaultCodeWriter: false,
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
    setQnsId: (state, action) => {
      state.qnsId = action.payload;
    },
    setIsDefaultCodeWriter: (state, action) => {
      state.isDefaultCodeWriter = action.payload;
    },
  },
});

export const { setIsQueuing, setQnsId, setSessionId, setIsDefaultCodeWriter } =
  matchSlice.actions;

export const getIsQueuing = (state: RootState) => state.match.isQueuing;
export const getSessionId = (state: RootState) => state.match.sessionId;
export const getQnsId = (state: RootState) => state.match.qnsId;
export const getIsDefaultCodeWriter = (state: RootState) =>
  state.match.isDefaultCodeWriter;

export default matchSlice.reducer;
