import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface MatchState {
  isQueuing: boolean;
  sessionId: string | null;
  qnsId: string | null;
  hasChangeQnRequest: boolean;
}

const initialState: MatchState = {
  isQueuing: false,
  sessionId: null,
  qnsId: null,
  hasChangeQnRequest: false,
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
    setHasChangeQnRequest: (state, action) => {
      state.hasChangeQnRequest = action.payload;
    },
  },
});

export const { setIsQueuing, setQnsId, setSessionId, setHasChangeQnRequest } =
  matchSlice.actions;

export const getIsQueuing = (state: RootState) => state.match.isQueuing;
export const getSessionId = (state: RootState) => state.match.sessionId;
export const getQnsId = (state: RootState) => state.match.qnsId;
export const getHasChangeQnRequest = (state: RootState) =>
  state.match.hasChangeQnRequest;

export default matchSlice.reducer;
