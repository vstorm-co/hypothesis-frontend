import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "preact-iso";
import { useState, useEffect } from 'preact/hooks';
import { getOrganizationsData, organizationsActions } from '../store/organizations-slice.js';
import { userActions } from '../store/user-slice.js';


import logo from '../assets/org-logo.svg';
import { signal, useSignal } from "@preact/signals";

const loading = signal(true);

function toggleLoading() {
  loading.value = !loading.value;
}


export const SetUp = (props) => {
  const user = useSelector(state => state.user.currentUser);
  const organizationCreated = useSelector(state => state.ui.organizationCreated)
  const location = useLocation();
  const dispatch = useDispatch();
  const DomainOrgs = useSignal([]);

  let currentOrganization = useSelector(state => state.organizations.currentOrganization);
  let userOrganizations = useSelector(state => state.organizations.userOrganizations);

  // check if user is logged in
  if (!user.access_token) {
    location.route('/auth');
  }

  // get user organizations
  // in case in future we would like to inform user that
  // he already has an organization and redirect him to it
  getOrganizationsData(user.access_token);

  // State variables for organization picture and logo
  const [orgName, setOrgName] = useState(''); // Initial value can be an empty string
  const [orgLogo, setOrgLogo] = useState('');

  // Function to handle adding as a personal account
  const handleAddPersonal = async () => {
    const updateUserSetUp = {
      ...user,
      set_up: true,
    }
    dispatch(userActions.setUser(updateUserSetUp));
    dispatch(userActions.updateCurrentUser(updateUserSetUp));
    location.route('/');
  }

  // Function to handle adding as an organization
  const handleAddOrganization = async () => {
    // Update set up status
    const updateUserSetUp = {
      ...user,
      set_up: true,
    }
    dispatch(userActions.updateCurrentUser(updateUserSetUp));

    try {
      // Create an object with the organization data
      const organizationData = {
        name: orgName,
        picture: orgLogo,
      };

      // Send a POST request to create the organization
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create the organization.');
      }

      const organization = await response.json();

      // Dispatch an action to update the Redux store with the new organization
      dispatch(organizationsActions.createOrganizationSuccess(organization));

      // Set the current organization
      dispatch(organizationsActions.setCurrentOrganization(organization));

      // Create a new user object with the organization information
      const newUserWithOrganization = {
        access_token: user.access_token,
        email: user.email,
        name: user.name,
        picture: user.picture,
        set_up: true,
        organization_name: organization.name,
        organization_uuid: organization.uuid, // Add organization UUID
        organization_logo: organization.picture, // Add organization logo
      };

      // Dispatch an action to add the new user to the users state
      dispatch(userActions.setUsers(newUserWithOrganization));
      dispatch(userActions.setUser(newUserWithOrganization));

      toggleLoading();
      location.route('/');
    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  };

  const getDomainOrganizations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization/domain-organizations`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the organization.');
      }

      const organizations = await response.json();

      DomainOrgs.value = [...organizations];
    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  }

  const addUserToDomainOrg = async (org) => {
    // Update set up status
    const updateUserSetUp = {
      ...user,
      set_up: true,
    }
    dispatch(userActions.updateCurrentUser(updateUserSetUp));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization/add-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organization_uuid: org.uuid }),
      });

      if (!response.ok) {
        throw new Error('Failed to create the organization.');
      }

      const organization = await response.json();

      // Create a new user object with the organization information
      const newUserWithOrganization = {
        access_token: user.access_token,
        email: user.email,
        name: user.name,
        picture: user.picture,
        set_up: true,
        organization_name: org.name,
        organization_uuid: org.uuid, // Add organization UUID
        organization_logo: org.picture, // Add organization logo
      };

      // Dispatch an action to add the new user to the users state
      dispatch(userActions.setUsers(newUserWithOrganization));
      dispatch(userActions.setUser(newUserWithOrganization));

      location.route('/');
    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  }

  useEffect(() => {
    getDomainOrganizations();
  }, [])

  return (
    <div className={'flex flex-col w-full mx-4'}>
      <div className="mx-auto 2xl:max-w-[930px] max-w-[860px] w-full">
        {/* Row 1 */}
        <div
          className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB] mb-4'}>
          Add New Account
        </div>

        {/* Row 2 */}
        <div className={''}>
          {/* Left Column */}
          <div className={'pt-2'}>
            <div
              className={'text-[#595959] font-bold text-lg leading-6 my-2'}>
              Personal account
            </div>
            <div className={'text-sm text-gray-400 pb-5'}>
              This is your Personal Account. Its great when you don't intend to collaborate or just
              wanting to try things out.
            </div>
            <div className={'border rounded-lg p-4 pt-0'}>
              <div className={'flex flex-row items-center mt-5'}>
                <img src={user.picture} alt="" className={'w-10 h-10 rounded-full'} />
                <div className={'ml-4'}>
                  <div className={'text-sm leading-6 font-bold'}>{user.name}</div>
                  <div className={'text-xs text-[#747474]'}>{user.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={'flex flex-col py-5'}>
            <div className={'text-[#595959] font-bold text-lg leading-6 mt-2'}>
              Organizations
            </div>
            <div className={'text-sm text-gray-400'}>
              Organizations allow you to invite other users and control the visibility
              of chats and templates.
              {organizationCreated &&
                <div className={'text-sm text-gray-400 mt-2'}>
                  <div className={(organizationCreated.created ? '' : 'hidden')}>
                    This is first account registered on this domain. Therefore we created a organisation for you.
                  </div>
                  <div className={(organizationCreated.created ? 'hidden' : '')}>
                    Below Organizations are registered on your domain. Therefore you are automatically added to them.
                  </div>
                </div>}
            </div>

            <div className={'mt-1'}>

              {DomainOrgs.value.map(org => (
                <div className={'border rounded-lg p-2 pt-0'}>
                  <div className={'flex flex-row items-center mt-2'}>
                    <img src={org.picture} alt="" className={'w-10 h-10 rounded-full'} />
                    <div className={'ml-4'}>
                      <div className={'text-sm leading-6 font-bold'}>{org.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={'flex mt-5'}>
            <button
              onClick={() => handleAddPersonal()}
              className={'bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center'}>
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
