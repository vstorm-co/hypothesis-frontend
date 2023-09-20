import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "preact-iso";
import {useState} from 'preact/hooks';
import {getOrganizationsData, organizationsActions} from '../store/organizations-slice.js';
import {userActions} from '../store/user-slice.js';


import logo from '../assets/org-logo.svg';
import {signal} from "@preact/signals";

const loading = signal(true);

function toggleLoading() {
    loading.value = !loading.value;
}


export const SetUp = (props) => {
    const user = useSelector(state => state.user.currentUser);
    const location = useLocation();
    const dispatch = useDispatch();

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
                organization_uuid: organization.uuid, // Add organization UUID
                organization_logo: organization.picture, // Add organization logo
            };

            // Dispatch an action to add the new user to the users state
            dispatch(userActions.setUsers(newUserWithOrganization));
            dispatch(userActions.setUser(newUserWithOrganization));

            console.log("current user: ", user)
            console.log("current organization: ", currentOrganization)

            toggleLoading();
            location.route('/');
        } catch (error) {
            // Handle error
            console.error('Error creating organization:', error);
        }
    };


    return (
        <div className={'flex flex-col w-full mx-4'}>
            <div className="mx-auto 2xl:max-w-[930px] max-w-[860px] w-full">
                {/* Row 1 */}
                <div
                    className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB] mb-4'}>
                    Add New Account
                </div>

                {/* Row 2 */}
                <div className={'flex flex-row'}>
                    {/* Left Column */}
                    <div className={'flex flex-col w-1/2 border-r border-[#DBDBDB] py-5 px-3'}>
                        <div
                            className={'text-[#595959] font-bold text-lg leading-6 py-5'}>
                            Set-up as Personal
                        </div>
                        <div className={'text-sm text-gray-400 pb-5'}>
                            Personal accounts are great are great when you don't intend to collaborate or just
                            wanting to try things out.
                        </div>
                        <div className={'border rounded-lg p-4 pt-0'}>
                            <div className={'flex flex-row items-center mt-5'}>
                                <img src={user.picture} alt="" className={'w-10 h-10 rounded-full'}/>
                                <div className={'ml-4'}>
                                    <div className={'text-sm leading-6 font-bold'}>{user.name}</div>
                                    <div className={'text-xs text-[#747474]'}>{user.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className={'flex mt-5'}>
                            <button
                                onClick={() => handleAddPersonal()}
                                className={'bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center'}>
                                Add as Personal
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={'flex flex-col w-1/2 py-5 px-3'}>
                        <div className={'text-[#595959] font-bold text-lg leading-6 py-5'}>
                            Set-up as Organization
                        </div>
                        <div className={'text-sm text-gray-400'}>
                            Organizations allow you to invite other users and control the visibility
                            of chats and templates.
                        </div>

                        {/* Organization Name */}
                        <div className={'flex flex-col mt-4 rounded-lg p-2 w-full'}>
                            <div className={'text-sm text-gray-400 leading-6'}>Organization Name</div>
                            <input
                                type="text"
                                className="bg-gray-200 placeholder:text-[#747474] focus:outline-none ml-2 w-full p-2 rounded border border-gray-300"
                                placeholder="Enter name..."
                                onChange={(e) => setOrgName(e.target.value)}
                            />
                        </div>

                        {/* Organization Logo */}
                        <div className={'flex flex-col mt-4 rounded-lg p-2 w-full'}>
                            <div className={'text-sm text-gray-400 leading-6'}>Organization Logo (Optional)</div>
                            <div className="relative rounded-md shadow-sm ml-2">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <img src={logo} alt="Placeholder SVG" className="h-5 w-5"/>
                                </span>
                                <input
                                    type="text"
                                    className="bg-gray-200 placeholder:text-[#747474] focus:outline-none py-2 pl-10 pr-3 rounded-md border border-gray-300 w-full"
                                    placeholder="Enter URL..."
                                    onChange={(e) => setOrgLogo(e.target.value)}
                                />
                            </div>
                        </div>


                        {/* Add as Organization Button */}
                        <div className={'flex mt-5'}>
                            <button
                                onClick={() => handleAddOrganization()}
                                className={'bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center'}>
                                Add as Organization
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
