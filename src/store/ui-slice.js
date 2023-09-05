// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: {
      active: false,
      content: '',
    },
    adminBar: {
      active: false,
    }
  },
  reducers: {
    toggleToast(state, action) {
      state.toast.active = action.payload.tgl;
      if (action.payload.content) {
        state.toast.content = action.payload.content;
      }
    },
    toggleAdminBar(state, action) {
      state.adminBar.active = action.payload.tgl;
    }
  }
});

export const uiActions = uiSlice.actions;

export default uiSlice;

export const showToast = (payload) => {
  return async (dispatch) => {
    dispatch(uiActions.toggleToast({ tgl: true, content: payload.content }));
    setTimeout(() => {
      dispatch(uiActions.toggleToast({ tgl: false }))
    }, 3000);
  }
}