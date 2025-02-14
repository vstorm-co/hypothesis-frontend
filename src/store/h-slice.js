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
    defaultScafoldPrompt: '',
  },
  reducers: {
    setInfo(state, action) {
      state.profileInfo = action.payload;
    },
    setDefaultScafoldPrompt(state, action) {
      state.defaultScafoldPrompt = action.payload
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
    } catch (err) {
      console.log(err);
    }
  }
}

export const getDefaultScafoldPrompt = (data) => {
  return async (dispatch) => {
    try {
      const prompt = await callApi(`/template/annotations-default-template/`, {
        method: 'GET',
      });

      console.log(prompt);
      dispatch(hSliceActions.setDefaultScafoldPrompt(prompt.content));
    } catch (err) {
      console.log(err);
    }
  }
}

export const deleteMessageAnnotations = (data) => {
  return async (dispatch) => {
    try {
      const response = await callApi(`/annotations`, {
        method: 'DELETE',
        body: JSON.stringify(data)
      });

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}