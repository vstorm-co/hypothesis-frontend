// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: 'ui',
  initialState: {
    files: [],
  },
  reducers: {
    setFiles(state, action) {
      state.files = action.payload;
    }
  }
});

export const filesActions = filesSlice.actions;

export default fileSlice;