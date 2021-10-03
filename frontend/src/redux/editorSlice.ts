import { createSlice } from '@reduxjs/toolkit';
import { Position } from 'monaco-editor';

interface EditorState {
  value: string;
  position: Position | null;
  peerPosition: Position | null;
}

const initialState: EditorState = {
  value: '',
  position: null,
  peerPosition: null,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setPeerPosition: (state, action) => {
      state.peerPosition = action.payload;
    },
  },
});

export const { setValue, setPosition, setPeerPosition } = editorSlice.actions;

export default editorSlice.reducer;
