// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { route } from 'preact-router';

import callApi from "../api";

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    useTemplates: [],
    currentTemplate: {},
    size: 5,
    info: {
      total: 6,
    }
  },
  reducers: {
    setTemplates(state, action) {
      state.templates = action.payload.items;
      state.info.total = action.payload.total;
    },
    setUseTemplates(state, action) {
      state.useTemplates = action.payload.items;
    },
    setSize(state, action) {
      state.size = action.payload;
    },
    setCurrentTemplate(state, action) {
      state.currentTemplate = action.payload
    },
    setCurrentTemplateName(state, action) {
      state.currentTemplate.name = action.payload
    }
  }
})

export const templatesActions = templatesSlice.actions;

export default templatesSlice;

export const getTemplatesData = (payload) => {
  return async (dispatch, getState) => {
    try {
      const useTemplates = await callApi(`/template`);
      dispatch(templatesActions.setUseTemplates(useTemplates));
    } catch (err) {
      console.log(err)
    }

    let state = getState();
    let url = ``;

    if (state.ui.searchFilters.visibility === 'all') {
      url = `/template?`
    } else if (state.ui.searchFilters.visibility === 'just_me') {
      url = `${url}/chat/template/?visibility=just_me`
    } else if (state.ui.searchFilters.visibility === 'organization') {
      if (state.user.currentUser.organization_uuid) {
        url = `${url}/chat/template/?visibility=organization&organization_uuid=${state.user.currentUser.organization_uuid}`
      } else {
        url = `${url}/chat/template/?visibility=just_me`
      }
    }

    if (state.ui.searchFilters.searchFor) {
      url = `${url}&name__like=${state.ui.searchFilters.searchFor}`;
    }

    if (state.templates.size) {
      url = `${url}&size=${state.templates.size}`;
    };

    url = `${url}&order_by=visibility,-created_at`;

    try {
      const templates = await callApi(url);
      dispatch(templatesActions.setTemplates(templates));
    } catch (err) {
      console.log(err)
    }
  }
}

export const createTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const template = await callApi(`/template`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      route(`/templates/${template.uuid}`);
      dispatch(selectTemplate(template.uuid));
      dispatch(getTemplatesData());
    } catch (err) {
      console.log(err)
    }
  }
}

export const selectTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const template = await callApi(`/template/${payload}`);
      dispatch(templatesActions.setCurrentTemplate(template));
    } catch (err) {
      console.log(err);
      route('/404')
    }
  }
}

export const updateTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const template = await callApi(`/template/${payload.uuid}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      dispatch(templatesActions.setCurrentTemplate(template));
      dispatch(getTemplatesData());
    } catch (err) {
      console.log(err);
    }
  }
}

export const deleteTemplate = (payload) => {
  return async (dispatch) => {
    try {
      const response = await callApi(`/template/${payload}`, {
        method: 'DELETE'
      });
      dispatch(getTemplatesData());
      dispatch(templatesActions.setCurrentTemplate({}));
    } catch (err) {
      console.log(err);
    }

  }
}