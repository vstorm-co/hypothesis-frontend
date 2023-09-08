// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

let user = JSON.parse(localStorage.getItem('ANT_currentUser'));
let users = JSON.parse(localStorage.getItem('ANT_users'));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: user ? user : { access_token: null },
    users: users ? users : [],
  },
  reducers: {
    setUser(state, action) {
      if (action.payload.access_token) {
        state.currentUser.access_token = action.payload.access_token;
        state.currentUser.email = action.payload.email;
        state.currentUser.name = action.payload.name;
        state.currentUser.picture = action.payload.picture;

        localStorage.setItem('ANT_currentUser', JSON.stringify({ ...state.currentUser }));
      }
    },
    setUsers(state, action) {
      let users = JSON.parse(localStorage.getItem('ANT_users'));
      let usersTable = users ? users : [];

      if (action.payload.access_token) {
        usersTable.push({
          access_token: action.payload.access_token,
          email: action.payload.email,
          name: action.payload.name,
          picture: action.payload.picture,
        });

        state.users = usersTable;
        localStorage.setItem('ANT_users', JSON.stringify(usersTable));
      }

    },
    logoutUser(state, action) {
      state.access_token = '';
      state.email = '';
      state.name = '';
      state.picture = '';

      localStorage.removeItem('ANT_currentUser');
    }
  }
});

export const userActions = userSlice.actions;

export default userSlice;