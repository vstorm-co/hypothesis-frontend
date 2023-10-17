import { getOrganizationsData } from '../store/organizations-slice.js';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';

import papaya from '../assets/images/papaya.png';

import { signal, useSignal } from "@preact/signals";
import { uiActions } from "../store/ui-slice.js";

const loading = signal(true);

function toggleLoading() {
  loading.value = !loading.value;
}


export const SetUp = (props) => {
  const organizationCreated = useSelector(state => state.ui.organizationCreated)
  const user = useSelector(state => state.user.currentUser);
  const DomainOrgs = useSignal([]);
  const dispatch = useDispatch();

  if (!user.access_token) {
    route('/auth');
  }

  getOrganizationsData(user.access_token);

  const [orgName, setOrgName] = useState('');
  const [orgLogo, setOrgLogo] = useState('');

  const handleAddPersonal = async () => {

    let redirectToChat = localStorage.getItem("redirect_to_chat");
    if (redirectToChat?.length > 0) {
      route(`/chats/${redirectToChat}`);
      localStorage.removeItem("redirect_to_chat");
    } else {
      route('/');
    }

    dispatch(uiActions.setHideSideBar(false));
  }

  const handleUpdateOrganization = async () => {
    try {
      const organizationData = {
        name: orgName,
      };

      // Send a POST request to create the organization
      const response = await fetch(`${import.meta.env.VITE_API_URL}/organization/${DomainOrgs.value[0].uuid}`, {
        method: 'PUT',
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

      let imgData = new FormData();

      imgData.append("picture", orgLogo);
      console.log(imgData);

      const response_img = await fetch(`${import.meta.env.VITE_API_URL}/organization/set-image/${DomainOrgs.value[0].uuid}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('ANT_currentUser')).access_token}`,
        },
        body: imgData,
      });

      if (!response.ok) {
        throw new Error('Failed to create the organization.');
      }

      const img = await response_img.json();

      getDomainOrganizations();

      toggleLoading();
    } catch (error) {
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

      setOrgName(DomainOrgs.value[0].name);
      setOrgLogo(DomainOrgs.value[0].picture);
    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  }

  useEffect(() => {
    getDomainOrganizations();
  }, [])

  return (
    <div className={'flex flex-col w-full bg-[#202020]'}>
      <div className={'mx-auto w-[720px]'}>
        <div className={'py-9 flex items-center'}>
          <img src={papaya} className={'w-6'} alt="" />
          <h1 className={'font-bold ml-2 text-lg leading-6 text-white'}>Papaya</h1>
          <div className={'text-sm leading-6 ml-4 text-[#747474]'}>
            Your Team and AI Everywhere
          </div>
        </div>
        <div className="bg-white px-8 pb-8 rounded">
          <div
            className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB] mb-4'}>
            Add Account
          </div>
          <div className={''}>
            <div className={''}>
              <div
                className={'text-[#202020] font-bold text-sm leading-6 mt-4 mb-2'}>
                Your Details
              </div>
              <div className={'border border-[#DBDBDB] rounded-lg w-[240px]'}>
                <div className={'flex flex-row items-center px-2'}>
                  <img src={user.picture} alt="" className={'w-8 h-8 rounded-full'} />
                  <div className={'ml-4 py-2'}>
                    <div className={'text-sm leading-6'}>{user.name}</div>
                    <div className={'text-xs text-[#747474]'}>{user.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={'flex flex-col mt-6'}>
              <div className={'text-[#202020] font-bold text-sm leading-6 mt-2'}>
                Organization Details
              </div>
              <div className={'text-sm text-gray-400'}>
                You can customize your organization with a name and logo for others to easily find you.
              </div>
              <div className={'mt-1'}>
                {DomainOrgs.value.map(org => (
                  <div className={'border border-[#DBDBDB] rounded-lg w-[240px]'}>
                    <div className={'flex flex-row items-center px-2'}>
                      <img src={user.picture} alt="" className={'w-8 h-8 rounded-full'} />
                      <div className={'ml-4 py-2'}>
                        <div className={'text-sm leading-6 font-bold'}>{org.name}</div>
                        <div className={'text-xs text-[#747474]'}>Click to Edit</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* (organizationCreated && organizationCreated.created) */}
              {/* organizationCreated.created  */}
              {true &&
                <div className={'flex mt-4 ' + (true ? '' : 'hidden')}>
                  <div className={'flex flex-col w-1/3 rounded-lg py-2'}>
                    <div className={'text-xs text-[#747474] mb-1 font-bold'}>Organization Name</div>
                    <input
                      type="text"
                      className="bg-gray-200 placeholder:text-[#747474] focus:outline-none w-full p-2 rounded border border-gray-300"
                      placeholder="Enter name..."
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                  </div>

                  {/* Organization Logo */}
                  <div className={'flex flex-col rounded-lg ml-4 py-2 w-1/3'}>
                    <div className={'text-xs text-[#747474] mb-1 font-bold'}>Organization Logo (Optional)</div>
                    <div className="relative rounded-md shadow-sm">
                      <div className={'w-full h-[41px] border-dashed border-2 rounded border-gray-200 flex justify-center items-center cursor-pointer'}>
                        <span className={'text-sm'}>
                          Click here to upload
                        </span>
                      </div>
                      <input
                        type="file"
                        value={orgLogo}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className={' ml-4 flex items-end py-2'}>
                    <button
                      onClick={() => { handleUpdateOrganization() }}
                      className={'bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center'}>
                      Save
                    </button>
                  </div>
                </div>
              }
            </div>



            <div className={'flex mt-16 justify-end'}>
              <button
                onClick={() => handleAddPersonal()}
                className={'bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1.5 rounded flex items-center'}>
                Continue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
