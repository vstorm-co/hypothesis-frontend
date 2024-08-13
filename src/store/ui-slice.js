// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import callApi from "../api";

// const copyAs = localStorage.getItem('ANT_defaultSaveAs');

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
    copyAs: 'md',
    organizationCreated: null,
    hideSideBar: false,
    expandSidebar: true,
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
    ],

    models: [

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
      state.models = action.payload;
    },
    setAvailableProviders(state, action) {
      state.availableProviders = action.payload;
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
    setExpandSideBar(state, action) {
      state.expandSidebar = action.payload;
    },
    toggleChatsLoading(state, action) {
      state.chatsLoading = action.payload;
    },
    toggleTemplatesLoading(state, action) {
      state.templatesLoading = action.payload;
    },
    setCopyAs(state, action) {
      state.copyAs = action.payload;
    },
    changeCopyAs(state, action) {
      state.copyAs = action.payload.method;

      let arr = JSON.parse(localStorage.getItem('ANT_defaultSaveAs'));
      if (arr === null) {
        arr = [];
        arr[0] = action.payload;
      } else {
        let target = arr.find(c => c.uuid === action.payload.uuid);
        console.log(target);
        if (target != undefined) {
          arr[arr.indexOf(target)].method = action.payload.method;
        } else {
          arr.push(action.payload);
        }
      }

      localStorage.setItem('ANT_defaultSaveAs', JSON.stringify(arr));
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
      const models = await callApi('/user-models', {}, true);
      if (models.length) {
        dispatch(uiActions.setModels(models));
        dispatch(uiActions.setCurrentModel(models.find(m => m.default)));
      }
      console.log(models);
    } catch (err) {
      console.log(err);
    }
  }
}

export const fetchAvailableProviders = () => {
  return async (dispatch) => {
    try {
      const providers = await callApi('/user-models/available-models', {}, true);
      dispatch(uiActions.setAvailableProviders(providers));
    } catch (err) {
      console.log(err);
    }
  }
}

export const AddUserModel = (payload) => {
  return async (dispatch) => {
    try {
      const model = await callApi('/user-models', { method: 'POST', body: JSON.stringify(payload) }, true);

      if (payload.default) {
        try {
          const tgl = await callApi(`/user-models/${model.uuid}/toggle-default`, { method: 'POST' }, true);
        } catch (err) {
          console.log(err);
        }
      }

      dispatch(fetchModels())
    } catch (err) {
      console.log(err);
    }
  }
}

export const updateUserModel = (payload) => {
  return async (dispatch) => {
    try {
      let modelToUpdate = {
        provider: payload.provider,
        defaultSelected: payload.defaultSelected,
        api_key: payload.api_key,
        default: payload.default,
      }
      const model = await callApi(`/user-models/${payload.uuid}`, { method: 'PUT', body: JSON.stringify(modelToUpdate) }, true);

      dispatch(fetchModels())
    } catch (err) {
      console.log(err);
    }
  }
}

export const toggleDefaultModel = (payload) => {
  return async (dispatch) => {
    try {
      const toggle = await callApi(`/user-models/${payload}/toggle-default`, { method: 'POST' }, true);

      dispatch(fetchModels())
    } catch (err) {
      console.log(err);
    }
  }
}