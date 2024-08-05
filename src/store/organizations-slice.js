// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "./user-slice";
import callApi from "../api";

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: {
    organizations: [],  // it is only for global user -> is_admin==True in auth table
    currentOrganization: { users: [] },
    userOrganizations: [],
  },
  reducers: {
    setOrganizations(state, action) {
      state.organizations = action.payload;
    },
    setUserOrganizations(state, action) {
      state.userOrganizations = action.payload;
    },
    setCurrentOrganization(state, action) {
      state.currentOrganization = JSON.parse(JSON.stringify(action.payload));
    },
    createOrganizationSuccess(state, action) {
      state.organizations.push(action.payload);
    },
    updateOrganizationSuccess(state, action) {
      const orgIndex = state.organizations.findIndex(org => org.uuid === action.payload.uuid);
      if (orgIndex !== -1) {
        state.organizations[orgIndex] = action.payload;
      }
    },
    deleteOrganizationSuccess(state, action) {
      state.organizations = state.organizations.filter(org => org.uuid !== action.payload.organizationUuid);
      state.currentOrganization = null;
    },
  },
});

export const organizationsActions = organizationsSlice.actions;

export default organizationsSlice;

export const getOrganizationsData = () => {
  return async (dispatch) => {
    try {
      const organizations = await callApi(`/organization`);
      dispatch(organizationsActions.setOrganizations(organizations));
    } catch (err) {
      console.log(err);
    }
  }
}

export const getOrganizationData = (payload) => {
  return async (dispatch) => {
    try {
      const organization = await callApi(`/organization/${payload}`, {}, true);
      dispatch(organizationsActions.setCurrentOrganization(organization));
      console.log(organization);
    } catch (err) {
      console.log(err);
    }
  }
}

export const createNewOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const organization = await callApi('/organizations', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      dispatch(organizationsActions.createOrganizationSuccess(organization));
    } catch (err) {
      console.log(err);
    }
  }
}

export const updateCurrentOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const updatedOrganization = await callApi(`/organizations/${payload.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      dispatch(organizationsActions.updateOrganizationSuccess(updatedOrganization));
    } catch (err) {
      console.log(err)
    }
  }
}

export const deleteCurrentOrganization = (organizationUuid) => {
  return async (dispatch) => {
    try {
      const organization = callApi(`/organizations/${organizationUuid}`, {
        method: 'DELETE',
      })
      dispatch(organizationsActions.deleteOrganizationSuccess({ organizationUuid }));
    } catch (err) {
      console.log(err);
    }
  }
}
