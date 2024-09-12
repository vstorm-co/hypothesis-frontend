// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "./user-slice";
import { showToast } from "./ui-slice";
import callApi from "../api";

import { getUserOrganizationsData } from "./user-slice";

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
      dispatch(getOrganizationData(payload.organization_uuid));
    } catch (err) {
      console.log(err);
    }
  }
}

export const setUsersAdmins = (payload) => {
  return async (dispatch) => {
    try {
      const organization = await callApi(`/organization/add-organization-permissions/${payload.organization_uuid}`, {
        method: 'POST',
        body: JSON.stringify({ user_ids: payload.user_ids, admin_ids: payload.admin_ids }),
      })
      dispatch(getOrganizationData(payload.organization_uuid));

    } catch (err) {
      console.log(err);
    }
  }
}

export const revokeUsersAdmins = (payload) => {
  return async (dispatch) => {
    try {
      const organization = await callApi(`/organization/revoke-organization-permissions/${payload.organization_uuid}`, {
        method: 'POST',
        body: JSON.stringify({ user_ids: payload.user_ids, admin_ids: payload.admin_ids }),
      })
      dispatch(getOrganizationData(payload.organization_uuid));

    } catch (err) {
      console.log(err);
    }
  }
}

export const updateOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const updatedOrganization = await callApi(`/organization/${payload.uuid}`, {
        method: 'PUT',
        body: JSON.stringify({ name: payload.name }),
      }, true);
      dispatch(getOrganizationData(payload.uuid));
      dispatch(getUserOrganizationsData());
      dispatch(showToast({ content: 'General Data Saved' }));
    } catch (err) {
      console.log(err)
    }
  }
}

export const AddUsersToOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const response = await callApi(`/organization/add-organization-permissions/${payload.uuid}`, {
        method: 'POST',
        body: JSON.stringify(payload.data)
      })
      dispatch(getOrganizationData(payload.uuid));
      dispatch(getUserOrganizationsData());
      dispatch(showToast({ content: 'Users added to organization' }));
    } catch (err) {
      console.log(err);
    }
  }
}

export const setOrganizationImage = (payload) => {
  return async (dispatch) => {
    try {
      const updatedOrganization = await callApi(`/organization/set-image/${payload.uuid}`, {
        method: 'POST',
        body: payload.data,
      }, true, true);
      dispatch(getOrganizationData(payload.uuid));
      dispatch(getUserOrganizationsData());
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
