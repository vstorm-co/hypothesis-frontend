// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "./user-slice";

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization`, {
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
    console.log("AAA");
    const user = JSON.parse(localStorage.getItem('ANT_currentUser'))
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization/user-organizations`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch organizations.');
      }
      const organizations = await response.json();

      organizations.forEach(org => {
        const newUserWithOrganization = {
          user_id: user.user_id,
          access_token: user.access_token,
          email: user.email,
          name: user.name,
          picture: user.picture,
          set_up: true,
          organization_name: org.name,
          organization_uuid: org.uuid, // Add organization UUID
          organization_logo: org.picture, // Add organization logo
        };

        dispatch(userActions.setUsers(newUserWithOrganization));
      })

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
