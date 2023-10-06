// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { route } from 'preact-router';

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    currentTemplate: {}
  },
  reducers: {
    setTemplates(state, action) {
      state.templates = action.payload;
    },
    setCurrentTemplate(state, action) {
      state.currentTemplate = action.payload
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
    route(`/templates/${template.uuid}`);
    dispatch(getTemplatesData());
  }
}

export const selectTemplate = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/template/${payload}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',

        },
      }).then(res => res.json());

      return data;
    };

    const template = await sendRequest();

    dispatch(templatesActions.setCurrentTemplate(template));
  }
}

export const updateTemplate = (payload) => {
  return async (dispatch) => {
    let user = JSON.parse(localStorage.getItem('ANT_currentUser'));
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/template/${payload.uuid}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      return data;
    };

    const template = await sendRequest();
    dispatch(templatesActions.setCurrentTemplate(template));
    dispatch(getTemplatesData());
  }
}

export const deleteTemplate = (payload) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/template/${payload}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',

        },
      }).then(res => res.json());

      return data;
    };

    const response = await sendRequest();
    dispatch(getTemplatesData());
    dispatch(templatesActions.setCurrentTemplate({}));
  }
}