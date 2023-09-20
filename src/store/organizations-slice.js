// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: {
    organizations: [],  // it is only for global user -> is_admin==True in auth table
    currentOrganization: null,
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch organizations.');
      }
      const organizations = await response.json();
      dispatch(organizationsActions.setOrganizations(organizations));
    } catch (error) {
      // Handle error
    }
  }
}

export const getUserOrganizationsData = () => {
    return async (dispatch) => {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user-organizations`, {
            headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
            'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch organizations.');
        }
        const organizations = await response.json();
        dispatch(organizationsActions.setUserOrganizations(organizations));
        } catch (error) {
        // Handle error
        }
    }
}

export const createNewOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to create a new organization.');
      }
      const organization = await response.json();
      dispatch(organizationsActions.createOrganizationSuccess(organization));
    } catch (error) {
      // Handle error
    }
  }
}

export const updateCurrentOrganization = (payload) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations/${payload.uuid}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to update the organization.');
      }
      const updatedOrganization = await response.json();
      dispatch(organizationsActions.updateOrganizationSuccess(updatedOrganization));
    } catch (error) {
      // Handle error
    }
  }
}

export const deleteCurrentOrganization = (organizationUuid) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations/${organizationUuid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete the organization.');
      }
      dispatch(organizationsActions.deleteOrganizationSuccess({ organizationUuid }));
    } catch (error) {
      // Handle error
    }
  }
}
