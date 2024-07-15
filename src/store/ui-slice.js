// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import callApi from "../api";

const copyAs = localStorage.getItem('ANT_defaultSaveAs');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    chatOptions: {
      show: false,
      position: null,
      data: null,
    },
    toast: {
      active: false,
      content: '',
    },
    adminBar: {
      active: false,
    },
    helpToolTipPosition: {
      top: '0px',
      left: '0px'
    },
    ToolTipContent: '',
    copyAs: copyAs ? copyAs : 'md',
    organizationCreated: null,
    hideSideBar: false,
    showToolbarHelp: false,
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

    availableProviders: [
      {
        provider: 'OpenAI',
        models: [
          'GPT-4o', 'GPT-4 Turbo', 'GPT-3.5 Turbo'
        ],
      },
      {
        provider: 'Claude',
        models: [
          '3.5 Sonnet', '3 Opus', '3 Sonnet', '3 Haiku'
        ],
      },
      // {
      //   provider: 'Groq',
      //   models: [
      //     'Llama 3',
      //   ],
      // },
    ],

    models: [
      {
        provider: 'OpenAI',
        models: [
          "gpt-4-1106-preview",
          "gpt-3.5-turbo-1106",
          "gpt-4-turbo-2024-04-09",
          "gpt-4o-2024-05-13",
        ],
        defaultSelected: 'gpt-4o-2024-05-13',
        key: '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',
        default: true,
      },
      {
        provider: 'Claude',
        models: [
          // "claude-3-haiku-20240307",
          "claude-3-sonnet-20240229",
          // "claude-3-opus-20240229",
        ],
        defaultSelected: 'claude-3-sonnet-20240229',
        key: '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',
        default: false,
      },
      // {
      //   provider: 'Groq',
      //   models: [
      //     'Llama 3',
      //   ],
      //   defaultSelected: 'Llama 3',
      //   key: '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',
      //   default: false,
      // },
    ],
    currentModel: {
      provider: 'OpenAI',
      models: [
        'GPT-4o', 'GPT-4 Turbo', 'GPT-3.5 Turbo'
      ],
      defaultSelected: 'GPT-4o',
    },
  },
  reducers: {
    toggleToast(state, action) {
      state.toast.active = action.payload.tgl;
      if (action.payload.content) {
        state.toast.content = action.payload.content;
      }
    },
    setModels(state, action) {
      state.models = action.payload
    },
    setHelpToolTipPosition(state, action) {
      state.helpToolTipPosition = { ...action.payload };
    },
    setCurrentModelSelected(state, action) {
      state.currentModel.defaultSelected = action.payload;
    },
    setCurrentModel(state, action) {
      state.currentModel = { ...action.payload };
    },
    setToolTipContent(state, action) {
      state.ToolTipContent = action.payload;
    },
    setChatsOptions(state, action) {
      state.chatOptions = { ...action.payload }
    },
    toggleFileUpdating(state, action) {
      state.fileUpdating = action.payload;
    },
    setFiltersVisibility(state, action) {
      state.searchFilters.visibility = action.payload.visibility;
    },
    setShowToolbarHelp(state, action) {
      state.showToolbarHelp = action.payload
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

export const fetchModels = () => {
  return async (dispatch) => {
    try {
      const models = await callApi('/models', {}, true);
      console.log(models);

    } catch (err) {
      console.log(err);
    }
  }
}