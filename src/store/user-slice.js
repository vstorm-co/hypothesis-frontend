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
        state.currentUser.set_up = action.payload.set_up ? action.payload.set_up : false;
        state.currentUser.organization_name = action.payload.organization_name ? action.payload.organization_name : null;
        state.currentUser.organization_uuid = action.payload.organization_uuid ? action.payload.organization_uuid : null;
        state.currentUser.organization_logo = action.payload.organization_logo ? action.payload.organization_logo : null;

        localStorage.setItem('ANT_currentUser', JSON.stringify({ ...state.currentUser }));
      }
      // console.log("AAAA");
    },
    updateCurrentUser(state, action) {
      // update user in ANT_users
      let users = JSON.parse(localStorage.getItem('ANT_users'));
      let usersTable = users ? users : [];

      // update user with the same email and organization_uuid
      let targetUser = usersTable.find(user => user.email === action.payload.email && user.organization_uuid === action.payload.organization_uuid);
      const index = usersTable.indexOf(targetUser);

      if (index !== -1) {
        usersTable[index].name = action.payload.name;
        usersTable[index].picture = action.payload.picture;
        usersTable[index].set_up = action.payload.set_up;
        usersTable[index].organization_logo = action.payload.organization_logo;
      }

      state.users = usersTable;
      localStorage.setItem('ANT_users', JSON.stringify(usersTable));
    },
    setUsers(state, action) {
      let users = JSON.parse(localStorage.getItem('ANT_users'));
      let usersTable = users ? users : [];

      if (action.payload.access_token && !usersTable.find(u => u.organization_uuid === action.payload.organization_uuid)) {
        usersTable.push({
          access_token: action.payload.access_token,
          email: action.payload.email,
          name: action.payload.name,
          picture: action.payload.picture,
          set_up: action.payload.set_up ? action.payload.set_up : false,
          organization_name: action.payload.organization_name ? action.payload.organization_name : null,
          organization_uuid: action.payload.organization_uuid ? action.payload.organization_uuid : null,
          organization_logo: action.payload.organization_logo ? action.payload.organization_logo : null,
        });

        state.users = usersTable;
        localStorage.setItem('ANT_users', JSON.stringify(usersTable));
      }

    },
    logoutUser(state, action) {
      let users = state.users;

      // remove all users with given email from list of users
      let newUsers = users.filter(user => user.email !== action.payload.email);
      state.users = newUsers;

      localStorage.setItem('ANT_users', JSON.stringify(newUsers));

      if (state.currentUser.email === action.payload.email) {
        state.currentUser.access_token = '';
        state.currentUser.email = '';
        state.currentUser.name = '';
        state.currentUser.picture = '';

        localStorage.removeItem('ANT_currentUser');
      }
    }
  }
});

export const userActions = userSlice.actions;

export default userSlice;