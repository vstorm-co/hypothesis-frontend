// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import callApi from "../api";
import callhApi from "../hapi";


const hSlice = createSlice({
  name: 'ui',
  initialState: {
    profileInfo: {},
    logs: [],
    showLogs: false,
    formVisible: false,
  },
  reducers: {
    setInfo(state, action) {
      state.profileInfo = action.payload;
    },
    resetInfo(state, action) {
      state.profileInfo = {}
    },
    addLogs(state, action) {
      state.logs.push(action.payload);
    },
    toggleFormVisible(state, action) {
      state.formVisible = action.payload;
    },
    toggleShowLogs(state, action) {
      state.showLogs = action.payload;
    }
  }
});

export const hSliceActions = hSlice.actions;

export default hSlice;

export const getProfileInfo = (data) => {
  return async (dispatch) => {
    try {
      const info = await callhApi(`/profile`, {}, data.token);
      localStorage.setItem("ANT_hProfile", JSON.stringify(data));

      dispatch(hSliceActions.setInfo(info));
    } catch (err) {
      console.log(err);
    }
  }
}

export const createAnnotations = (data) => {
  return async (dispatch) => {
    try {
      const info = await callApi(`/annotations`, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      console.log(done);
    } catch (err) {
      console.log(err);
    }
  }
}