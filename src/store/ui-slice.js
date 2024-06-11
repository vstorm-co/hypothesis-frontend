// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const copyAs = localStorage.getItem('ANT_defaultSaveAs');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: {
      active: false,
      content: '',
    },
    adminBar: {
      active: false,
    },
    copyAs: copyAs ? copyAs : 'md',
    organizationCreated: null,
    hideSideBar: false,
    chatsExpanded: true,
    templatesExpanded: false,
    chatsLoading: false,
    templatesLoading: false,
    searchFilters: {
      visibility: 'all',
      sortBy: '-updated_at',
      searchFor: '',
    },
    fileUpdating: false,
  },
  reducers: {
    toggleToast(state, action) {
      state.toast.active = action.payload.tgl;
      if (action.payload.content) {
        state.toast.content = action.payload.content;
      }
    },
    toggleFileUpdating(state, action) {
      state.fileUpdating = action.payload;
    },
    setFiltersVisibility(state, action) {
      state.searchFilters.visibility = action.payload.visibility;
    },
    setFiltersSearch(state, action) {
      state.searchFilters.searchFor = action.payload.searchFor;
    },
    setFiltersSortBy(state, action) {
      state.searchFilters.sortBy = action.payload;
    },
    setChatsExpanded(state, action) {
      state.chatsExpanded = action.payload;
    },
    setTemplatesExpanded(state, action) {
      state.templatesExpanded = action.payload;
    },
    toggleAdminBar(state, action) {
      state.adminBar.active = action.payload.tgl;
    },
    setOrganizationCreated(state, action) {
      state.organizationCreated = action.payload;
    },
    setHideSideBar(state, action) {
      state.hideSideBar = action.payload;
    },
    toggleChatsLoading(state, action) {
      state.chatsLoading = action.payload;
    },
    toggleTemplatesLoading(state, action) {
      state.templatesLoading = action.payload;
    },
    changeCopyAs(state, action) {
      state.copyAs = action.payload

      localStorage.setItem('ANT_defaultSaveAs', action.payload);
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