import { useSelector } from "react-redux"
import openAi from '../assets/OpenAI-Logo.svg';
import editPen from '../assets/edit_pen.svg';
import angleDown from '../assets/angle-down.svg';

export function OrgSettings() {
  const currentUser = useSelector(state => state.user.currentUser)

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
          <div className={'max-h-[86vh] overflow-y-auto mt-8'}>
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
                <div className={'mt-4 flex w-full pb-4'}>
                  <div className={'border border-[#DBDBDB] rounded-lg p-4 w-full'}>
                    <div>
                      <div className={'flex gap-2 text-sm leading-6 items-center justify-between'}>
                        <div className={'flex gap-2'}>
                          <img src={openAi} alt="" /> <span className={'font-bold'}>OpenAI</span> <span className={'text-[#595959]'}>Default</span>
                        </div>
                        <div className={'p-2'}>
                          <img src={editPen} alt="" />
                        </div>
                      </div>
                      <div className={'mt-4 flex gap-4'}>
                        <div className={'w-1/2'}>
                          <div className="text-xs font-bold text-[#747474] mb-1 flex">
                            Group
                          </div>

                          <div class="relative">
                            <select className={"overflow-hidden pr-6 "} >
                              <option disabled selected value="placeholder" className={'text-[#747474]'}>GPT-4o</option>
                            </select>
                            <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                          </div>
                          {/* <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (profileInfo.groups?.filter(g => g.id != "__world__").length < 1 ? '' : 'hidden')}>
                          Create a group in order to make annotations
                        </div>
                        <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (groupValid.value ? 'hidden' : '')}>
                          You need to choose a group
                        </div> */}
                        </div>
                        <div className={'w-1/2'}>
                          <div className="text-xs font-bold text-[#747474] mb-1 flex">
                            API key
                          </div>

                          <div className={'truncate text-sm leading-6 py-2'}>
                            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
                          </div>
                          {/* <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (profileInfo.groups?.filter(g => g.id != "__world__").length < 1 ? '' : 'hidden')}>
                          Create a group in order to make annotations
                        </div>
                        <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (groupValid.value ? 'hidden' : '')}>
                          You need to choose a group
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={true} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
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
        </div>
        {/* <div className={'absolute z-20 top-72 left-1/2 transform -translate-x-1/2 w-[320px] bg-[#202020] border border-[#595959] text-sm leading-6 rounded ' + (showConfirmDeleteAnnotations.value ? '' : 'hidden')}>
          <div className={'p-4 text-white text-center'}>
            You are about to delete all existing annotations attached to this URL before generating new annotations.
          </div>
          <div className={'flex gap-1 justify-center py-2 border-t border-[#595959]'}>
            <button onClick={() => showConfirmDeleteAnnotations.value = false} type="button" className="btn-second light-gray">Cancel</button>
            <button onClick={() => handleSubmit()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center">I Understand</button>
          </div>
        </div> */}
      </div>
    </div >
  )
}