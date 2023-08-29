import { configureStore } from '@reduxjs/toolkit';

import chatsSlice from './chats-slice';
import userSlice from './user-slice';

const store = configureStore({
  reducer: { chats: chatsSlice.reducer, user: userSlice.reducer }
})

export default store;