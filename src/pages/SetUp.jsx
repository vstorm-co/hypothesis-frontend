// @ts-nocheck
import { useState, useEffect, useRef } from 'preact/hooks';
import { useSelector, useDispatch } from "react-redux";
import { signal, useSignal } from "@preact/signals";
import { route } from 'preact-router';
import OpenAi from '../assets/OpenAI-Logo.svg';
import Claude from '../assets/Claude.svg';
import Groq from '../assets/Groq.svg';
import angleDown from '../assets/angle-down.svg';

import docdrop from '../assets/images/docdrop.png';

import { getOrganizationsData } from '../store/organizations-slice.js';
import { AddUserModel, showToast, uiActions, fetchModels, fetchAvailableProviders } from "../store/ui-slice.js";
import { Toast } from '../components/Toast.jsx';
import { getChatsData } from '../store/chats-slice';
import { getTemplatesData } from '../store/templates-slice';
import { getUserOrganizationsData, userActions } from '../store/user-slice';
import { Loading } from '../components/Loading';

const loading = signal(true);
const editOrganization = signal(false);

function toggleLoading() {
  loading.value = !loading.value;
}

function toggleEditOrganization() {
  editOrganization.value = !editOrganization.value
}

export const SetUp = (props) => {
  const models = useSelector(state => state.ui.models);
  const user = useSelector(state => state.user.currentUser);
  const availableProviders = useSelector(state => state.ui.availableProviders);
  const DomainOrgs = useSignal([]);

  const modelsLoading = useSignal(true);

  const apikey = useSignal('');
  const defaultModelToSelect = useSignal('');
  const selectAddProvider = useSignal({ models: [] });
  const modelValid = useSignal(true);

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

    modelValid.value = apikey.value.length != 0 && defaultModelToSelect.value.length != 0 && selectAddProvider.value.provider;

    if (!modelValid.value && (models?.length === 0 || models === null)) {
      return
    }

    let model = {
      provider: selectAddProvider.value.provider,
      defaultSelected: defaultModelToSelect.value,
      api_key: apikey.value,
      default: true,
    }

    if (DomainOrgs.value[0]) {
      handleUpdateOrganization()
    }

    await dispatch(getUserOrganizationsData());
    await dispatch(getChatsData());
    await dispatch(getTemplatesData());
    await dispatch(uiActions.setHideSideBar(false));

    if (selectAddProvider.value.provider) {
      await dispatch(AddUserModel(model));
    }

    dispatch(userActions.setGuestMode(false));

    let redirectToChat = localStorage.getItem("redirect_to_chat");
    if (redirectToChat?.length > 0) {
      route(`/chats/${redirectToChat}`);
      localStorage.removeItem("redirect_to_chat");
    } else {
      route('/');
    }
  }

  const handleUpdateOrganization = async () => {
    try {
      const organizationData = {
        name: orgName,
      };

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

      if (DomainOrgs.value.length > 0) {
        setOrgName(DomainOrgs.value[0].name);

        if (!orgLogo) {
          setOrgLogo(DomainOrgs.value[0].picture);
        }
      }

    } catch (error) {
      // Handle error
      console.error('Error creating organization:', error);
    }
  }

  useEffect(async () => {
    await getDomainOrganizations();
    dispatch(uiActions.setHideSideBar(true));
    await dispatch(fetchModels());
    modelsLoading.value = false;
    await dispatch(fetchAvailableProviders());
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
    <div className={'flex flex-col w-full min-h-[100vh] overflow-auto bg-[#202020]'}>
      <div className={'mx-auto w-[720px]'}>
        <div className={'py-9 flex items-center'}>
          <img src={docdrop} className={'w-6'} alt="" />
          <h1 className={'font-bold ml-2 text-lg leading-6 text-white'}>Docdrop chat</h1>
          <div className={'text-sm leading-6 ml-4 text-[#747474]'}>
            Your Team and AI Everywhere
          </div>
        </div>
        <div className="bg-white px-8 pb-8 rounded relative">
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
              {(organizationCreated && !organizationCreated.created) &&
                <div>
                  <div className={'text-[#202020] font-bold text-sm leading-6'}>
                    Join Organization
                  </div>
                  <div className={'text-sm text-[#595959]  mt-2'}>
                    It looks likes other co-workers from <span className={'font-semibold'}>{orgName}</span> are already using Docdrop chat. Join them!
                  </div>
                </div>
              }

              {(organizationCreated && organizationCreated.created) &&
                <div>
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
                            {!orgLogoUrl && orgLogo &&
                              <img src={`${import.meta.env.VITE_API_URL}${orgLogo}`} alt="" className={'w-8 h-8 rounded-full'} />
                            }
                            {!orgLogo &&
                              <div className={'w-8 h-8 flex items-center justify-center rounded-full bg-[#FAFAFA] text-xl'}>
                                {org.name[0]}{org.name[1]}
                              </div>
                            }
                            <div className={'ml-4 py-2'}>
                              <div className={'text-sm leading-6 font-bold'}>{orgName ? orgName : org.name}</div>
                              <div className={'text-xs text-[#747474]'}>Click to Edit</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={'flex mt-4 overflow-hidden duration-300 ' + (editOrganization.value ? 'max-h-[100px]' : 'max-h-0')}>
                      <div className={'flex flex-col w-1/2 rounded-lg py-2'}>
                        <div className={'text-xs text-[#747474] mb-1 font-bold'}>Name</div>
                        <input
                          type="text"
                          className="bg-[#FAFAFA] placeholder:text-[#747474] focus:outline-none w-full p-2 rounded border border-gray-300"
                          placeholder="Enter name..."
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                        />
                      </div>

                      <div className={'flex flex-col rounded-lg ml-4 py-2 w-1/2'}>
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
                    </div>

                  </div>
                </div>
              }
              {organizationCreated === null &&
                <div>
                  <div className={'text-[#202020] font-bold text-sm leading-6'}>
                    Nice to see you again!
                  </div>
                  <div className={'text-sm text-[#595959]  mt-2'}>
                    It's been a while! Amazing to have you back.
                  </div>
                </div>
              }
              {/* {modelsLoading &&
                <div className="flex py-4 items-center justify-center">
                  <Loading />
                </div>
              } */}
              {models?.length === 0 && !modelsLoading &&
                <div className={'flex flex-col mt-6'}>
                  <div className={'text-[#202020] font-bold text-sm leading-6'}>
                    Model
                  </div>
                  <div className={'text-sm leading-6 text-[#595959] mt-2'}>
                    In order to use Docdrop chat you must select a default model and provide API credentials. You can always add additional models or make changes later in the Organization Settings page.
                  </div>

                  {!modelValid.value &&
                    <div class="text-[#EF4444] text-sm leading-6 mt-2">You have to configure AI model</div>
                  }

                  <div className={'mt-4'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      Provider
                    </div>
                    <div className={'flex w-full gap-2 text-sm leading-6 font-bold'}>
                      {availableProviders.map(model => (
                        <div onClick={() => { selectAddProvider.value = model; defaultModelToSelect.value = model.models[0] }} className={'flex shrink-0 gap-1 py-2 pl-2 pr-3 rounded-lg cursor-pointer ' + (selectAddProvider.value.provider === model.provider ? 'border-2 border-[#747474]' : 'border border-[#DBDBDB]')}>
                          <img src={OpenAi} className={'w-6 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                          <img src={Claude} className={'w-6 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
                          <img src={Groq} className={'w-6 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
                          {model.provider}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={'overflow-hidden flex gap-4'}>
                    <div className={'mt-4 flex-1'}>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        Preffered Model
                      </div>

                      <div class="relative">
                        <select disabled={selectAddProvider.value.models.length === 0} onChange={(e) => defaultModelToSelect.value = e.currentTarget.value} className={"overflow-hidden border-[#DBDBDB] pr-6 py-2.5"} >
                          {selectAddProvider.value.models.map(m => (
                            <option value={m}>{m}</option>
                          ))}
                        </select>
                        <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                      </div>
                    </div>
                    <div className={'mt-4 flex-1'}>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        API Key

                      </div>
                      <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                        <input value={apikey.value} onInput={(e) => apikey.value = e.currentTarget.value} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r p-2 bg-[#FAFAFA]'} placeholder={'Enter API Key'} type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className={'flex mt-16 justify-center'}>
              <button
                onClick={() => handleAddPersonal()}
                className={'bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center'}>
                Start Using Docdrop chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
