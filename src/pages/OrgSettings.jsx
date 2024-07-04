import { useDispatch, useSelector } from "react-redux"
import OpenAi from '../assets/OpenAI-Logo.svg';
import Claude from '../assets/Claude.svg';
import Groq from '../assets/Groq.svg';
import editPen from '../assets/edit_pen.svg';
import angleDown from '../assets/angle-down.svg';
import { useEffect } from "react";
import { templatesActions } from "../store/templates-slice";
import { chatsActions } from "../store/chats-slice";
import { useSignal } from "@preact/signals";
import { uiActions } from "../store/ui-slice";

export function OrgSettings() {
  const currentUser = useSelector(state => state.user.currentUser);
  const models = useSelector(state => state.ui.models);
  const availableProviders = useSelector(state => state.ui.availableProviders);
  const dispatch = useDispatch();

  const selectAddProvider = useSignal({ models: [] });
  const defaultModelToSelect = useSignal('');
  const showAddModel = useSignal(false);
  const selectNewAsDefault = useSignal(false);
  const apikey = useSignal('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');

  useEffect(() => {
    dispatch(templatesActions.setCurrentTemplate({}));
    dispatch(chatsActions.setCurrentChat({}));
  }, [])

  function addModel() {
    let model = { ...selectAddProvider.value, default: selectNewAsDefault.value, defaultSelected: defaultModelToSelect.value.length === 0 ? selectAddProvider.value.models[0] : defaultModelToSelect.value, key: apikey.value };
    let modelsArr = JSON.parse(JSON.stringify(models));

    if (selectNewAsDefault.value) {
      modelsArr.map(m => m.default = false);
    }

    modelsArr.push(model);

    dispatch(uiActions.setModels(modelsArr));
    showAddModel.value = false;
    selectNewAsDefault.value = false;
  }

  function changeProviderDefaultSelected(provider, defaultSelected) {
    let modelsArr = JSON.parse(JSON.stringify(models));

    modelsArr[modelsArr.indexOf(modelsArr.find(m => m.provider === provider))].defaultSelected = defaultSelected;
    dispatch(uiActions.setModels(modelsArr));
  }

  return (
    <div className={'relative w-full'}>
      <div className={'pb-8 bg-white w-[780px] mx-auto'}>
        <div className={'mx-auto'}>
          <div className={''}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-3 text-center border-b border-[#DBDBDB] flex items-center justify-between'}>
              Organization Settings
              <button type="submit" disabled={true} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                Save Changes
              </button>
            </div>
          </div>
          <div className={'max-h-[86vh] overflow-y-auto pt-8 pr-1'}>
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
                    <input className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r py-2 bg-[#FAFAFA]'} placeholder={''} type="text" />
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
                    <img src={currentUser.organization_uuid && currentUser.organization_logo ? `${import.meta.env.VITE_API_URL}${currentUser.organization_logo}` : currentUser.picture} className="w-10 h-10 bg-white"></img>
                    <button type="button" className="bg-[#FAFAFA] text-sm leading-6 font-bold ml-4 px-2 text-[#747474]">Remove Logo</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={'border-y border-[#DBDBDB] mt-4 pb-4'}>
              <div className={'text-sm leading-6 font-bold pt-4'}>
                Models
              </div>
              <div className={'pb-4'}>
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
                          </div>
                          <div className={'p-2'}>
                            <img src={editPen} alt="" />
                          </div>
                        </div>
                        <div className={'mt-4 flex gap-4'}>
                          <div className={'w-1/2'}>
                            <div className="text-xs font-bold text-[#747474] mb-1 flex">
                              Model
                            </div>

                            <div class="relative">
                              <select onChange={(e) => changeProviderDefaultSelected(model.provider, e.currentTarget.value)} className={"overflow-hidden pr-6 "} >
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
                              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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => showAddModel.value = true} type="submit" disabled={false} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                  Add Model
                </button>
              </div>
            </div>

            <div className={'mt-4'}>
              <div className={'text-sm leading-6 font-bold'}>
                Users
              </div>
              <div className={'mt-4 flex w-full pb-4'}>
                <div className={'w-1/2'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Invite New Users <span class="ml-0.5 font-normal">(Comma-separated for multiple)</span>
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (true ? '' : 'border-[#EF4444]')}>
                    <input className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r py-2 bg-[#FAFAFA]'} placeholder={''} type="text" />
                  </div>
                  <div className={'flex items-center gap-2 mt-2 text-sm leading-6 shrink-0'}>
                    <label class="switch">
                      <input type="checkbox" checked={true} />
                      <span class="slider round"></span>
                    </label>
                    <span>Add as Admin?</span>
                  </div>
                  <button type="submit" disabled={true} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 mt-4 rounded flex items-center">
                    Send Invites
                  </button>
                </div>
                <div className={'w-1/2 border-l border-[#DBDBDB] ml-4 pl-4'} >
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Users <span class="ml-0.5 font-normal">(4)</span>
                    {/* {!urlValid.value &&
                    <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                  } */}
                  </div>
                  <div className={'grid grid-cols-2 gap-1 text-sm leading-6'}>
                    <div className='flex items-center gap-2'>
                      <img src="" className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                      Erik Bode
                    </div>
                    <div className='flex items-center gap-2'>
                      <img src="" className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                      Jared Pendergraft
                    </div>
                    <div className='flex items-center gap-2'>
                      <img src="" className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                      Cameron Chaplin
                    </div>
                    <div className='flex items-center gap-2'>
                      <img src="" className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                      Josh Hirte
                    </div>
                  </div>
                  <button type="submit" disabled={true} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 mt-4 rounded flex items-center">
                    Edit Users
                  </button>
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
        <div className={'pb-8 bg-white rounded z-50 top-12 left-1/2 transform -translate-x-36 w-[640px] border shadow-xl ' + (showAddModel.value ? 'fixed' : 'hidden')}>
          <div className={'mx-auto'}>
            <div className={'px-8'}>
              <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
                Add Model
              </div>
              <div className={'mt-4'}>
                <div className={'w-1/2'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Provider
                  </div>
                  <div className={'flex w-full gap-2 text-sm leading-6 font-bold'}>
                    {availableProviders.map(model => (
                      <div onClick={() => selectAddProvider.value = model} className={'flex shrink-0 gap-1 py-2 pl-2 pr-3 rounded-lg cursor-pointer ' + (models.find(m => m.provider === model.provider) ? 'bg-[#EBEBEB] opacity-50 pointer-events-none ' : ' ') + (selectAddProvider.value.provider === model.provider ? 'border-2 border-[#747474]' : 'border border-[#DBDBDB]')}>
                        <img src={OpenAi} className={'w-6 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
                        <img src={Claude} className={'w-6 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
                        <img src={Groq} className={'w-6 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
                        {model.provider}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={'overflow-hidden'}>
                  <div className={'mt-4'}>
                    <div className="text-xs font-bold text-[#747474] mb-1 flex">
                      Model
                    </div>

                    <div class="relative">
                      <select onChange={(e) => defaultModelToSelect.value = e.currentTarget.value} className={"overflow-hidden pr-6 "} >
                        {selectAddProvider.value.models.map(m => (
                          <option value={m}>{m}</option>
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
                  <div className={'flex items-center gap-2 -mt-1 text-sm leading-6 shrink-0'}>
                    <label class="switch">
                      <input onChange={() => selectNewAsDefault.value = !selectNewAsDefault.value} type="checkbox" checked={selectNewAsDefault.value} />
                      <span class="slider round"></span>
                    </label>
                    <span>Make Default</span>
                  </div>
                  <div className={'flex gap-1 justify-end'}>
                    <button type="button" onClick={() => { showAddModel.value = false }} className="btn-second">Cancel</button>
                    <button onClick={() => addModel()} disabled={selectAddProvider.value.models.length < 1} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Add Model</button>
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