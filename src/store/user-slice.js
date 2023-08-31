// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

let user = JSON.parse(localStorage.getItem('ANT_user'));

const userSlice = createSlice({
  name: 'user',
  initialState: user ? user : { access_token: null },
  reducers: {
    setUser(state, action) {
      state.access_token = action.payload.access_token;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.picture = action.payload.picture;

      localStorage.setItem('ANT_user', JSON.stringify({ ...state }));
    },
    logoutUser(state, action) {
      state.access_token = '';
      state.email = '';
      state.name = '';
      state.picture = '';

      localStorage.removeItem('ANT_user');
    }
  }
});

export const userActions = userSlice.actions;

export default userSlice;