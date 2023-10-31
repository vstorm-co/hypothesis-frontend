import { useState, useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from "react-redux";
import { signal, useSignal } from "@preact/signals";
import { route } from 'preact-router';

import papaya from '../assets/images/papaya.png';

import { getOrganizationsData } from '../store/organizations-slice.js';
import { showToast, uiActions } from "../store/ui-slice.js";
import { Toast } from '../components/Toast.jsx';

const loading = signal(true);
const editOrganization = signal(false);

function toggleLoading() {
  loading.value = !loading.value;
}

function toggleEditOrganization() {
  editOrganization.value = !editOrganization.value
}

export const SetUp = (props) => {
  const user = useSelector(state => state.user.currentUser);
  const DomainOrgs = useSignal([]);
  const dispatch = useDispatch();

  const organizationCreated = useSelector(state => state.ui.organizationCreated)

  if (!user.access_token) {
    route('/auth');
  }

  getOrganizationsData(user.access_token);

  const logoRef = useRef();

  const [orgName, setOrgName] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [orgLogoUrl, setorgLogoUrl] = useState('');

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

      dispatch(showToast({ content: 'Organization details saved' }))
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

      if (!orgLogo) {
        setOrgLogo(DomainOrgs.value[0].picture);
      }
    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  }

  useEffect(() => {
    getDomainOrganizations();
  }, [])

  const handleUploadClick = () => {
    logoRef.current.click()
  }

  const handleUpdateOrgLogo = (e) => {
    setOrgLogo(e.target.files[0]);

    let file = e.target.files[0];
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setorgLogoUrl(reader.result);
    }
  }

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
        <div className="bg-white px-8 pb-8 rounded relative">
          <div className={'absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2'}>
            <Toast />
          </div>
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

            <div className={'flex flex-col mt-8'}>

              {/* (organizationCreated && organizationCreated.created) */}
              {/* organizationCreated.created  */}
              {(organizationCreated && !organizationCreated.created) &&
                <div>
                  <div className={'text-[#202020] font-bold text-sm leading-6'}>
                    Join Organization
                  </div>
                  <div className={'text-sm text-[#595959]  mt-2'}>
                    It looks likes other co-workers from <span className={'font-semibold'}>{orgName}</span> are already using Papaya. Join them!
                  </div>
                </div>
              }
              {(organizationCreated && organizationCreated.created) &&
                <div className={'flex flex-col'}>
                  <div className={'text-[#202020] font-bold text-sm leading-6'}>
                    Organization Details
                  </div>
                  <div className={'text-sm text-[#595959] mt-2'}>
                    You can customize your organization with a name and logo for others to easily find you.
                  </div>
                  <div className={'mt-4'}>
                    {DomainOrgs.value.map(org => (
                      <div onClick={() => toggleEditOrganization()} className={'border border-[#DBDBDB] rounded-lg w-[240px] cursor-pointer'}>
                        <div className={'flex flex-row items-center px-2'}>
                          {orgLogoUrl &&
                            <img src={orgLogoUrl} alt="" className={'w-8 h-8 rounded-full'} />
                          }
                          {!orgLogoUrl &&
                            <img src={`${import.meta.env.VITE_API_URL}${orgLogo}`} alt="" className={'w-8 h-8 rounded-full'} />
                          }
                          <div className={'ml-4 py-2'}>
                            <div className={'text-sm leading-6 font-bold'}>{org.name}</div>
                            <div className={'text-xs text-[#747474]'}>Click to Edit</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={'flex mt-4 overflow-hidden duration-300 ' + (editOrganization.value ? 'max-h-[100px]' : 'max-h-0')}>
                    <div className={'flex flex-col w-1/3 rounded-lg py-2'}>
                      <div className={'text-xs text-[#747474] mb-1 font-bold'}>Name</div>
                      <input
                        type="text"
                        className="bg-gray-200 placeholder:text-[#747474] focus:outline-none w-full p-2 rounded border border-gray-300"
                        placeholder="Enter name..."
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>

                    <div className={'flex flex-col rounded-lg ml-4 py-2 w-1/3'}>
                      <div className={'text-xs text-[#747474] mb-1 font-bold'}>Organization Logo (Optional)</div>
                      <div className="relative rounded-md shadow-sm">
                        <div onClick={() => handleUploadClick()} className={'w-full px-2 py-1 border-2 rounded border-gray-200 flex items-center cursor-pointer overflow-hidden'}>
                          {orgLogoUrl &&
                            <img src={orgLogoUrl} alt="" className={'w-8 h-8 rounded-full'} />
                          }
                          {!orgLogoUrl &&
                            <img src={`${import.meta.env.VITE_API_URL}${orgLogo}`} alt="" className={'w-8 h-8 rounded-full'} />
                          }
                          <span className={'text-[#595959] text-xs ml-2'}>
                            Click here to change
                          </span>
                        </div>
                        <input
                          type="file"
                          value={orgLogo}
                          className="hidden"
                          onChange={(e) => handleUpdateOrgLogo(e)}
                          ref={logoRef}
                        />
                      </div>
                    </div>
                    <div className={'ml-4 flex items-end py-2'}>
                      <button
                        onClick={() => { handleUpdateOrganization() }}
                        className={'bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center'}>
                        Save
                      </button>
                    </div>
                  </div>

                </div>
              }
            </div>
            <div className={'flex mt-16 justify-center'}>
              <button
                onClick={() => handleAddPersonal()}
                className={'bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center'}>
                Start Using Papaya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
