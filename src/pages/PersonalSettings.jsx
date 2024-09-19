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
import { AddUserModel, fetchModels, showToast, toggleDefaultModel, uiActions, updateUserModel } from "../store/ui-slice";

export function PersonalSettings() {
  const currentUser = useSelector(state => state.user.currentUser);
  const organization = useSelector(state => state.organizations.currentOrganization);
  const models = useSelector(state => state.ui.models);
  const editModelMode = useSignal(false);
  const availableProviders = useSelector(state => state.ui.availableProviders);
  const dispatch = useDispatch();

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

  const selectAddProvider = useSignal({ models: [] });
  const defaultModelToSelect = useSignal('');
  const showAddModel = useSignal(false);
  const selectNewAsDefault = useSignal(false);
  const apikey = useSignal('');

  useEffect(async () => {
    await dispatch(templatesActions.setCurrentTemplate({}));
    await dispatch(chatsActions.setCurrentChat({}));
    dispatch(fetchModels());

    let width = window.innerWidth;

    if (width < 960) {
      dispatch(uiActions.setExpandSideBar(false));
    }
  }, [])

  async function addModel() {
    let model = {
      provider: selectAddProvider.value.provider,
      defaultSelected: defaultModelToSelect.value,
      api_key: apikey.value,
      default: selectNewAsDefault.value,
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

  return (
    <div className={'relative w-full'}>
      <div className={'bg-white desktop:w-[780px] mx-auto px-4 desktop:px-8'}>
        <div className={'mx-auto'}>
          <div className={''}>
            <div className={'text-[#595959] font-bold text-lg leading-6 pt-4 pb-3 text-center border-b border-[#DBDBDB] flex items-center justify-between'}>
              Personal Settings
            </div>
          </div>
          <div className={'desktop:max-h-[91vh] max-h-[92vh] overflow-y-auto pr-2.5'}>
            <div className={'mt-4 pb-4'}>
              <div className={'text-sm leading-6 font-bold pt-4'}>
                Models
              </div>
              <div className={'pb-4'}>
                {models.length > 0 &&
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
                            {isUserAdmin() &&
                              <div onClick={() => LoadModelToEdit(model)} className={'p-2 cursor-pointer'}>
                                <img src={editPen} alt="" />
                              </div>
                            }
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
                {models.length === 0 &&
                  <div class="text-[#EF4444] text-[14px] leading-4 my-3">You need to add at least one model for Papaya to work properly</div>
                }
                <button onClick={() => { showAddModel.value = true; editModelMode.value = false; }} type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                  Add Model
                </button>
              </div>
            </div>
          </div>
        </div>
        <div ref={addModelModalRef} className={'pb-8 bg-white rounded z-50 top-12 left-1/2 transform -translate-x-36 w-[640px] border shadow-xl ' + (showAddModel.value ? 'fixed' : 'hidden')}>
          <div className={'mx-auto'}>
            <div className={'px-8'}>
              <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
                {editModelMode.value ? 'Edit' : 'Add'} Model
              </div>
              <div className={'mt-4'}>
                {!editModelMode.value && <div className={'w-1/2'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Provider
                  </div>
                  <div className={'flex w-full gap-2 text-sm leading-6 font-bold'}>
                    {availableProviders.map(model => (
                      <div onClick={() => { selectAddProvider.value = model; defaultModelToSelect.value = model.models[0] }} className={'flex shrink-0 gap-1 py-2 pl-2 pr-3 rounded-lg cursor-pointer ' + (models.find(m => m.provider === model.provider) ? 'bg-[#EBEBEB] opacity-50 pointer-events-none ' : ' ') + (selectAddProvider.value.provider === model.provider ? 'border-2 border-[#747474]' : 'border border-[#DBDBDB]')}>
                        <img src={OpenAi} className={'w-6 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                        <img src={Claude} className={'w-6 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
                        <img src={Groq} className={'w-6 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
                        {model.provider}
                      </div>
                    ))}
                  </div>
                </div>}
                {editModelMode.value &&
                  <div className={'flex items-center gap-2'}>
                    <img src={OpenAi} className={'w-6 ' + (selectAddProvider.value.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                    <img src={Claude} className={'w-6 ' + (selectAddProvider.value.provider != 'Claude' ? 'hidden' : '')} alt="" />
                    <img src={Groq} className={'w-6 ' + (selectAddProvider.value.provider != 'Groq' ? 'hidden' : '')} alt="" />
                    {selectAddProvider.value.provider}
                  </div>
                }
                <div className={'overflow-hidden'}>
                  <div className={'mt-4'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      Model
                    </div>

                    <div class="relative">
                      <select disabled={selectAddProvider.value.models < 1} onChange={(e) => defaultModelToSelect.value = e.currentTarget.value} className={"overflow-hidden pr-6 "} >
                        {selectAddProvider.value.models.map(m => (
                          <option value={m} selected={m === defaultModelToSelect.value}>{m}</option>
                        ))}
                      </select>
                      <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                    </div>
                  </div>
                  <div className={'mt-4'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      API Key
                      {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                    </div>
                    <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                      <input value={apikey.value} onInput={(e) => apikey.value = e.currentTarget.value} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r p-2 bg-[#FAFAFA]'} placeholder={'Enter API Key'} type="text" />
                    </div>
                  </div>
                </div>
                <div className={'mt-4 pb-2 flex w-full justify-between items-center'}>
                  <div className={'flex items-center gap-2 -mt-1 text-sm leading-6 shrink-0 ' + ((editModelMode.value && selectAddProvider.value.default) ? 'pointer-events-none opacity-50' : '')}>
                    <label class="switch">
                      <input onChange={() => handleDefault()} type="checkbox" checked={selectNewAsDefault.value} />
                      <span class="slider round"></span>
                    </label>
                    <span>Make Default</span>
                  </div>
                  <div className={'flex gap-1 justify-end'}>
                    <button type="button" onClick={() => { showAddModel.value = false }} className="btn-second">Cancel</button>
                    <button onClick={() => { if (editModelMode.value) updateModel(); else addModel() }} disabled={selectAddProvider.value.models.length < 1} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">{editModelMode.value ? 'Save Changes' : 'Add Model'} </button>
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