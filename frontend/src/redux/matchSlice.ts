import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface MatchState {
  isQueuing: boolean;
  sessionId: string | null;
  qnsId: string | null;
}

const initialState: MatchState = {
  isQueuing: false,
  sessionId: null,
  qnsId: null,
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
  },
});

export const { setIsQueuing, setQnsId, setSessionId } = matchSlice.actions;

export const getIsQueuing = (state: RootState) => state.match.isQueuing;
export const getSessionId = (state: RootState) => state.match.sessionId;
export const getQnId = (state: RootState) => state.match.sessionId;

export default matchSlice.reducer;
