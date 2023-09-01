import { configureStore } from '@reduxjs/toolkit';

import chatsSlice from './chats-slice';
import userSlice from './user-slice';
import uiSlice from './ui-slice';

const store = configureStore({
  reducer: { chats: chatsSlice.reducer, user: userSlice.reducer, ui: uiSlice.reducer }
})

export default store;