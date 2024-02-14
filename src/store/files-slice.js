// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import callApi from "../api";


const filesSlice = createSlice({
  name: 'ui',
  initialState: {
    files: [],
    loading: false,
  },
  reducers: {
    setFiles(state, action) {
      state.files = action.payload;
    },
    toggleFilesLoading(state, action){
      state.loading = action.payload;
    }
  }
});

export const filesActions = filesSlice.actions;

export default filesSlice;

export const getFiles = () => {
  return async (dispatch) => {
    try {
      const files = await callApi(`/user-files`);

      dispatch(filesActions.setFiles(files));
    } catch (err) {
      console.log(err);
    }
  }
}

export const uploadFile = (data) => {
  return async (dispatch) => {
    dispatch(filesActions.toggleFilesLoading(true));
    try {
      const file = await callApi(`/user-files`, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      dispatch(getFiles());
      dispatch(filesActions.toggleFilesLoading(false));
      return file;
    } catch (err) {
      console.log(err);
    }
  }
} 