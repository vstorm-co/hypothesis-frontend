// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { filesActions } from "./files-slice";
import callApi from "../api";
import { route } from 'preact-router';

import { getOrganizationData } from "./organizations-slice";
import { hSliceActions } from "./h-slice";


let user = JSON.parse(localStorage.getItem('ANT_currentUser'));
let users = JSON.parse(localStorage.getItem('ANT_users'));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: user ? user : { access_token: null },
    users: users ? users : [],
    triedRefreshToken: false,
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
        state.currentUser.google_token = action.payload.google_access_token
        state.currentUser.google_refresh_token = action.payload.google_refresh_token

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

      console.log(action);
      console.log(usersTable);

      if (action.payload.access_token && !usersTable.find(u => u.organization_uuid === action.payload.organization_uuid && u.user_id === action.payload.user_id)) {
        let newUser = {
          user_id: action.payload.user_id,
          access_token: action.payload.access_token,
          email: action.payload.email,
          name: action.payload.name,
          picture: action.payload.picture,
          set_up: action.payload.set_up ? action.payload.set_up : false,
          google_token: action.payload.google_access_token ? action.payload.google_access_token : null,
          google_refresh_token: action.payload.google_refresh_token ? action.payload.google_refresh_token : null
        }

        usersTable.push(newUser);

        state.users = usersTable;
        localStorage.setItem('ANT_users', JSON.stringify(usersTable));
      }
    },
    setGoogleToken(state, action) {
      state.currentUser.google_token = action.payload.google_access_token;
      localStorage.setItem('ANT_currentUser', JSON.stringify({
        ...state.currentUser,
        google_token: action.payload.google_access_token,
      }));
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
    },
    setTriedRefreshToken(state, action) {
      state.triedRefreshToken = action.payload;
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
        dispatch(userActions.setCurrentUserOrganization(organizations[0]));
        dispatch(getOrganizationData(organizations[0].uuid));
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

    if (!state.user.triedRefreshToken) {
      try {
        const tokens = await callApi(`/auth/users/tokens?refresh_token=${state.user.currentUser.refresh_token}`, { method: 'PUT' })
        dispatch(userActions.setUserTokens(tokens));
        route('/')
      } catch (error) {
        console.log(error);
        dispatch(userActions.setTriedRefreshToken(true));
        dispatch(refreshUserToken());
      }
    } else {
      await dispatch(userActions.setUser({}));
      localStorage.clear();
      await dispatch(userActions.setUsers([]));
      await dispatch(hSliceActions.setInfo({}))
      dispatch(userActions.setTriedRefreshToken(false));
      route('/auth');
    }
  }
}


export const refreshGoogleToken = () => {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      if (state.user.currentUser.google_refresh_token === undefined) {
        return
      }
      const tokens = await callApi(`/auth/refresh-google-token?refresh_token=${state.user.currentUser.google_refresh_token}`, { method: 'PUT' })
      dispatch(userActions.setGoogleToken(tokens));
    } catch (error) {
      console.log(error);
    }
  }
}
