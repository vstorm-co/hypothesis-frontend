// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
  },
  reducers: {
    setTemplates(state, action) {
      state.templates = action.payload;
    }
  }
})

export const templatesActions = templatesSlice.actions;

export default templatesSlice;

export const getTemplatesData = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/template`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json());

      return data;
    }

    const templates = await sendRequest();

    dispatch(templatesActions.setTemplates(templates));
  }
}

export const createTemplate = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/template`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      return data;
    };

    const template = await sendRequest();
    dispatch(getTemplatesData());
  }
} 