// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import callApi from "../api";
import { route } from 'preact-router';


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
        state.currentUser.user_id = action.payload.user_id;
        state.currentUser.access_token = action.payload.access_token;
        state.currentUser.refresh_token = action.payload.refresh_token;
        state.currentUser.email = action.payload.email;
        state.currentUser.name = action.payload.name;
        state.currentUser.picture = action.payload.picture;

        localStorage.setItem('ANT_currentUser', JSON.stringify({ ...state.currentUser }));
      } else {
        state.currentUser = {}
      }
    },
    setUserTokens(state, action) {
      state.currentUser.access_token = action.payload.access_token;
      state.currentUser.refresh_token = action.payload.refresh_token;
      localStorage.setItem('ANT_currentUser', JSON.stringify({
        ...state.currentUser,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
      }));
    },
    setCurrentUserOrganization(state, action) {
      state.currentUser.organization_logo = action.payload.picture;
      state.currentUser.organization_uuid = action.payload.uuid;
      state.currentUser.organization_name = action.payload.name;
    },
    setUsers(state, action) {
      let users = JSON.parse(localStorage.getItem('ANT_users'));
      let usersTable = users ? users : [];

      if (action.payload.access_token && !usersTable.find(u => u.organization_uuid === action.payload.organization_uuid && u.user_id === action.payload.user_id)) {
        let newUser = {
          user_id: action.payload.user_id,
          access_token: action.payload.access_token,
          email: action.payload.email,
          name: action.payload.name,
          picture: action.payload.picture,
          set_up: action.payload.set_up ? action.payload.set_up : false,
        }

        usersTable.push(newUser);

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

      if (state.currentUser.email === action.payload.email && state.currentUser.organization_uuid === action.payload.organization_uuid) {
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

export const getUserOrganizationsData = () => {
  return async (dispatch) => {
    try {
      const organizations = await callApi('/organization/user-organizations')
      if (organizations.length > 0) {
        dispatch(userActions.setCurrentUserOrganization(organizations[0]))
      } else {
        dispatch(userActions.setCurrentUserOrganization({ picture: null, name: null, uuid: null }))
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const refreshUserToken = () => {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      const tokens = await callApi(`/auth/users/tokens?refresh_token=${state.user.currentUser.refresh_token}`, { method: 'PUT' })
      dispatch(userActions.setUserTokens(tokens));
      route('/')
    } catch (error) {
      console.log(error);
    }
  }
}