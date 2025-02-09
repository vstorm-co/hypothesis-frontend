import { configureStore } from '@reduxjs/toolkit';

import chatsSlice from './chats-slice';
import userSlice from './user-slice';
import uiSlice from './ui-slice';
import organizationsSlice from './organizations-slice';
import templatesSlice from './templates-slice';
import filesSlice from './files-slice.js';
import hSlice from './h-slice';

const store = configureStore({
  reducer: {
    chats: chatsSlice.reducer,
    user: userSlice.reducer,
    ui: uiSlice.reducer,
    organizations: organizationsSlice.reducer,
    templates: templatesSlice.reducer,
    files: filesSlice.reducer,
    h: hSlice.reducer,
  }
})

export default store;