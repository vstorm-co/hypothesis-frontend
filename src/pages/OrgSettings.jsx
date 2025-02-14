import { useDispatch, useSelector } from "react-redux"
import OpenAi from '../assets/OpenAI-Logo.svg';
import Claude from '../assets/Claude.svg';
import Groq from '../assets/Groq.svg';
import editPen from '../assets/edit_pen.svg';
import angleDown from '../assets/angle-down.svg';
import { useEffect, useRef } from "react";
import { templatesActions } from "../store/templates-slice";
import { chatsActions } from "../store/chats-slice";
import { useSignal } from "@preact/signals";
import { AddUserModel, showToast, toggleDefaultModel, uiActions, updateUserModel, fetchAvailableProviders } from "../store/ui-slice";
import { AddUsersToOrganization, getOrganizationData, organizationsActions, setOrganizationImage, updateOrganization } from "../store/organizations-slice";
import { Link, route } from "preact-router";

export function OrgSettings() {
  const currentUser = useSelector(state => state.user.currentUser);
  const organization = useSelector(state => state.organizations.currentOrganization);
  const user = useSelector(state => state.user.currentUser);
  const models = useSelector(state => state.ui.models);
  const editModelMode = useSignal(false);
  const availableProviders = useSelector(state => state.ui.availableProviders);
  const dispatch = useDispatch();

  const orgName = useSignal('');
  const orgLogo = useSignal('');
  const newOrgLogoUrl = useSignal(null);

  const logoRef = useRef(null);
  const addModelModalRef = useRef(null);

  function outsideAddModelClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          showAddModel.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  outsideAddModelClickHanlder(addModelModalRef);

  const inviteUsers = useSignal('');
  const inviteAsAdmin = useSignal(false);
  const inviteUsersError = useSignal(false);

  const selectAddProvider = useSignal({ models: [] });
  const providerToCheck = useSignal('');
  const defaultModelToSelect = useSignal('');
  const showAddModel = useSignal(false);
  const showDynamicModels = useSignal(false);
  const selectNewAsDefault = useSignal(false);
  const apikey = useSignal('');

  const defaultProvidersList = [
    {
      provider: 'OpenAI',
      models: [
        
      ],
    },
    {
      provider: 'Claude',
      models: [
        
      ],
    },
    {
      provider: 'Groq',
      models: []
    }
  ]

  useEffect(async () => {
    await dispatch(templatesActions.setCurrentTemplate({}));
    await dispatch(chatsActions.setCurrentChat({}));

    let width = window.innerWidth;

    if (width < 960) {
      dispatch(uiActions.setExpandSideBar(false));
    }
  }, [])

  useEffect(async () => {
    if (currentUser.organization_uuid) {
      await dispatch(getOrganizationData(currentUser.organization_uuid));
    }
  }, [currentUser.organization_uuid])

  useEffect(() => {
    orgName.value = organization.name;

    const timeout = setTimeout(() => {
      if (!isUserAdmin()) {
        route('/_404')
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [organization])

  async function checkModels(){
    await dispatch(fetchAvailableProviders({provider: providerToCheck.value, key: apikey.value}));
    showDynamicModels.value = true;
  }

  async function addModel() {
    let model = {
      provider: providerToCheck.value,
      defaultSelected: defaultModelToSelect.value || availableProviders[0].models[0],
      api_key: apikey.value,
      user: user.id,
      organization_uuid: organization.uuid
    }

    await dispatch(AddUserModel(model));

    showAddModel.value = false;
    selectNewAsDefault.value = false;
  }

  async function updateModel() {
    let model = {
      uuid: selectAddProvider.value.uuid,
      provider: selectAddProvider.value.provider,
      defaultSelected: defaultModelToSelect.value,
      api_key: apikey.value,
      default: selectNewAsDefault.value,
      organization_uuid: organization.uuid
    }

    await dispatch(updateUserModel(model));
    dispatch(showToast({ content: 'Model Updated' }))

    showAddModel.value = false;
    selectNewAsDefault.value = false;
    selectAddProvider.value = { models: [] };
  }

  function LoadModelToEdit(model) {
    selectAddProvider.value = { ...model };
    apikey.value = model.api_key;
    defaultModelToSelect.value = model.defaultSelected
    selectNewAsDefault.value = model.default
    showAddModel.value = true;
    editModelMode.value = true;
  }

  function changeProviderDefaultSelected(model, defaultSelected) {
    dispatch(updateUserModel({ ...model, defaultSelected: defaultSelected }))
  }

  function handleDefault() {
    if (editModelMode.value) {
      selectAddProvider.value.default = true;
      dispatch(toggleDefaultModel(selectAddProvider.value.uuid));
      dispatch(showToast({ content: 'Model Set as Default' }))
    }
    selectNewAsDefault.value = true
  }

  function isUserAdmin() {
    let targetUser = organization.users.find(u => u.id === currentUser.user_id);
    return targetUser ? targetUser.is_admin : false;
  };

  function updateOrganizationData() {
    dispatch(updateOrganization({ uuid: organization.uuid, name: orgName.value }));

    if (newOrgLogoUrl.value) {
      let formData = new FormData();
      formData.append("picture", orgLogo.value)
      dispatch(setOrganizationImage({ uuid: organization.uuid, data: formData }));
    }
  };

  function handleUpdateOrgLogo(e) {
    orgLogo.value = e.target.files[0];

    let file = e.target.files[0];
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      newOrgLogoUrl.value = reader.result;
    }
  }

  function handleAddUsersToOrganization() {
    inviteUsersError.value = false;
    let emails = inviteUsers.value.split(",");

    emails.forEach(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        inviteUsersError.value = true;
      }
    });
    if (inviteUsersError.value) {
      return
    } else {
      let data;
      if (inviteAsAdmin.value) {

        data = {
          user_ids: '',
          admins_ids: emails,
        }
      } else {
        data = {
          user_ids: emails,
          admins_ids: '',
        }
      }
      dispatch(AddUsersToOrganization({ uuid: organization.uuid, data }))
    }
  }

  function handleInputApiKey(e){
    apikey.value = e.target.value;
    
    if (providerToCheck.value) {

      dispatch(uiActions.setAvailableProviders(defaultProvidersList));
    }
  }

  function handleShowCheckModels() { 
    dispatch(uiActions.setAvailableProviders(defaultProvidersList));
    apikey.value = '';
    showAddModel.value = true;
  }

  return (
    <div className={'relative w-full'}>
      <div className={'bg-white desktop:w-[780px] mx-auto px-4 desktop:px-8'}>
        <div className={'mx-auto'}>
          <div className={''}>
            <div className={'text-[#595959] font-bold text-lg leading-6 pt-4 pb-3 text-center border-b border-[#DBDBDB] flex items-center justify-between'}>
              Organization Settings
            </div>
          </div>
          <div className={'desktop:max-h-[91vh] max-h-[92vh] overflow-y-auto pt-8 pr-2.5'}>
            <div className={''}>
              <div className={'text-sm leading-6 font-bold'}>
                General
              </div>
              <div className={'mt-4 flex w-full gap-4'}>
                <div className={'w-1/2'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Organization Name
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                    <input onChange={(e) => { orgName.value = e.currentTarget.value; }} value={orgName.value} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r px-2 py-2 bg-[#FAFAFA]'} placeholder={''} type="text" />
                  </div>
                </div>
                <div className={'w-1/2'} >
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Organization Logo <span class="ml-0.5 font-normal">(optional)</span>
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'flex'}>
                    <img src={newOrgLogoUrl.value ? newOrgLogoUrl.value : `${import.meta.env.VITE_API_URL}${organization.picture}`} className="w-10 h-10 rounded-lg bg-white"></img>
                    <button onClick={() => { logoRef.current.click() }} type="button" className="bg-[#FAFAFA] text-sm leading-6 font-bold ml-4 px-2 text-[#747474]">Change Logo</button>
                    <input
                      type="file"
                      value={orgLogo.value}
                      className="hidden"
                      onChange={(e) => { handleUpdateOrgLogo(e) }}
                      ref={logoRef}
                    />
                  </div>
                </div>
              </div>
              <div className={'mt-4'}>
                <button onClick={() => updateOrganizationData()} type="submit" disabled={!isUserAdmin()} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                  Save General
                </button>
              </div>
            </div>

            <div className={'border-y border-[#DBDBDB] mt-4 pb-4'}>
              <div className={'text-sm leading-6 font-bold pt-4'}>
                Available Providers
              </div>
              <div className={'pb-4'}>
                {models?.length > 0 &&
                  <div className={'mt-4 flex flex-col gap-4 w-full pb-4'}>
                    {models.map(model => (
                      <div className={'border border-[#DBDBDB] rounded-lg p-4 w-full'}>
                        <div>
                          <div className={'flex gap-2 text-sm leading-6 items-center justify-between'}>
                            <div className={'flex gap-2'}>
                              <img src={OpenAi} className={'w-4 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                              <img src={Claude} className={'w-4 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
                              <img src={Groq} className={'w-4 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
                              <span className={'font-bold'}>{model.provider}</span> <span className={'text-[#595959] ' + (model.default ? '' : 'hidden')}>Default</span>
                              {/* <span className={'text-[#595959] '}>{model.uuid}</span> */}
                            </div>
                          </div>
                          <div className={'mt-4 flex gap-4'}>
                            <div className={'w-1/2'}>
                              <div className="text-xs font-bold text-[#747474] mb-1 flex">
                                Preferred Model
                              </div>

                              <div class="relative w-full">
                                <select onChange={(e) => changeProviderDefaultSelected(model, e.currentTarget.value)} className={"overflow-hidden truncate pr-4"} >
                                  {model.models.map(m => (
                                    <option value={m} selected={m === model.defaultSelected}>{m}</option>
                                  ))}
                                </select>
                                <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                              </div>
                            </div>
                            <div className={'w-1/2'}>
                              <div className="text-xs font-bold text-[#747474] mb-1 flex">
                                API key
                              </div>

                              <div className={'truncate text-sm leading-6 py-2'}>
                                {model.api_key}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                {models?.length === 0 || models === null &&
                  <div class="text-[#EF4444] text-[14px] leading-4 my-3">You need to add at least one model for Docdrop chat to work properly</div>
                }
                <button onClick={() => { handleShowCheckModels() }} type="submit" disabled={!isUserAdmin()} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                  Check Available Models
                </button>
              </div>
            </div>

            <div className={'mt-4'}>
              <div className={'text-sm leading-6 font-bold'}>
                Users
              </div>
              <div className={'mt-4 flex w-full pb-4'}>
                <div className={'w-1/2'}>
                  <div className="text-xs font-bold text-[#747474] mb-1">
                    <span>Add New Users</span> <span class="font-normal">(Comma-separated for multiple)</span>
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                    <input onInput={(e) => { inviteUsers.value = e.currentTarget.value }} value={inviteUsers.value} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r py-2 px-2 bg-[#FAFAFA]'} placeholder={'example@email.com, example2@email.com'} type="text" />
                  </div>
                  {inviteUsersError.value &&
                    <div className={'text-red-500 text-xs pl-1 mt-0.5 '}>
                      Some of these are not exactly an email address.
                    </div>
                  }
                  <div className={'flex items-center gap-2 mt-2 text-sm leading-6 shrink-0'}>
                    <label class="switch shrink-0">
                      <input onChange={(e) => inviteAsAdmin.value = !inviteAsAdmin.value} type="checkbox" checked={inviteAsAdmin.value} />
                      <span class="slider round"></span>
                    </label>
                    <span>Add as Admin?</span>
                  </div>
                  <button disabled={!isUserAdmin()} onClick={() => handleAddUsersToOrganization()} type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 mt-4 rounded flex items-center">
                    Send Invites
                  </button>
                </div>
                <div className={'w-1/2 border-l border-[#DBDBDB] ml-4 pl-4'} >
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Users <span class="ml-0.5 font-normal">({organization?.users.length})</span>
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'grid grid-cols-2 gap-1 text-sm leading-6'}>
                    {organization?.users.map((user, index) =>
                      <div className={'flex items-center gap-2 ' + (organization?.users.length === 1 ? 'col-span-2' : '')}>
                        <img src={user.picture} className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                        <div className={'truncate'}>
                          {user.name}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link href={'/organization-users'} className={"bg-[#595959] text-sm leading-6 font-bold text-white p-2 mt-4 rounded inline-block " + (isUserAdmin() ? '' : 'pointer-events-none opacity-50')}>
                    Edit Users
                  </Link>
                </div>
              </div>
            </div>

            <div className={'mt-4 border border-[#DBDBDB] rounded-lg border-dashed p-4'}>
              <div className={'text-sm leading-6 font-bold'}>
                Danger Zone
              </div>
              <div className={'text-[#747474] text-sm leading-6 mt-4'}>
                Deleting an organization will remove all users’ access and sign them out immediately.
              </div>
              <button type="submit" disabled={true} className="bg-[#EF4444] text-sm leading-6 font-bold text-white p-2 mt-4 rounded flex items-center">
                Delete Organization
              </button>
            </div>
          </div>
        </div>
        <div ref={addModelModalRef} className={'pb-8 bg-white rounded z-50 top-12 left-1/2 transform -translate-x-36 w-[640px] border shadow-xl ' + (showAddModel.value ? 'fixed' : 'hidden')}>
          <div className={'mx-auto'}>
            <div className={'px-8'}>
              <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
                Check Available Models
              </div>
              <div className={'mt-4'}>
              <div className={'overflow-hidden'}>
                  {!false && <div className={'w-1/2'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      Provider
                    </div>
                    <div className={'flex w-full gap-2 text-sm leading-6 font-bold'}>
                      {availableProviders.map(model => (
                        <div onClick={() => { providerToCheck.value = model.provider; }} className={'flex shrink-0 gap-1 py-2 pl-2 pr-3 rounded-lg cursor-pointer ' + (models?.find(m => m.provider === model.provider) ? 'bg-[#EBEBEB] opacity-50 pointer-events-none ' : ' ') + (providerToCheck.value === model.provider ? 'border-2 border-[#747474]' : 'border border-[#DBDBDB]')}>
                          <img src={OpenAi} className={'w-6 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                          <img src={Claude} className={'w-6 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
                          <img src={Groq} className={'w-6 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
                          {model.provider}
                        </div>
                      ))}
                    </div>
                  </div>}
                  
                  {providerToCheck.value &&
                    <div className={'mt-4'}>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        API Key
                      </div>
                      <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                        <input value={apikey.value} onInput={(e) => handleInputApiKey(e)} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r p-2 bg-[#FAFAFA]'} placeholder={'Enter API Key'} type="text" />
                      </div>
                    </div>
                  }
                </div>
                {availableProviders[0].models.length > 0 && 
                  <div className={'mt-4'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      Model
                    </div>

                    <div class="relative">
                      <select onChange={(e) => defaultModelToSelect.value = e.currentTarget.value} className={"overflow-hidden pr-6 "} >
                        {availableProviders[0].models.map(m => (
                          <option value={m} selected={m === defaultModelToSelect.value}>{m}</option>
                        ))}
                      </select>
                      <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                    </div>
                  </div>
                }
                <div className={'mt-4 pb-2 flex w-full justify-between items-center'}>
                  {availableProviders[0].models.length > 0 && 
                    <div className={'flex items-center gap-2 -mt-1 text-sm leading-6 shrink-0 '}>
                      <label class="switch">
                        <input onChange={() => handleDefault()} type="checkbox" checked={selectNewAsDefault.value} />
                        <span class="slider round"></span>
                      </label>
                      <span>Make Default</span>
                    </div>
                  }
                  <div className={'flex gap-1 justify-end'}>
                    <button onClick={() => { if(availableProviders[0].models.length > 0) addModel(); else checkModels();}} disabled={!providerToCheck.value || !apikey.value } type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">{availableProviders[0].models.length > 0 ? 'Add Provider Models' : 'Check API Key'} </button>
                    <button type="button" onClick={() => { showAddModel.value = false }} className="btn-second">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}