import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SaveAsTemplate from './ToolBars/ChatToolbar/SaveAsTemplate';
import { useSignal } from '@preact/signals';

import docdrop from '../assets/images/docdrop.png';
import CopyAs from './ToolBars/ChatToolbar/CopyAs';
import restricted from '../assets/restricted.svg';
import refresh from '../assets/refesh.svg';
import arrow from '../assets/arrow.svg';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CloneChatFromHere } from './ToolBars/ChatToolbar/CloneChatFromHere';
import { EditMessage } from './ToolBars/ChatToolbar/EditMessage';
import { PromptInput } from './PromptInput';
import { route } from 'preact-router';
import { MessageData } from './MessageData';
import { Loading } from './Loading';
import { createAnnotations, deleteMessageAnnotations } from '../store/h-slice';
import { getChatsData } from '../store/chats-slice';


export function Message(props) {
  const currentChat = useSelector(state => state.chats.currentChat);
  const user = useSelector(state => state.user.currentUser);
  const guestMode = useSelector(state => state.user.guestMode);

  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showCopyAs, setShowCopyAs] = useState(false);

  const EditEnabled = useSignal(false);
  const newMessage = useSignal('');

  const dispatch = useDispatch();

  const showDeleteAnnotations = useSignal(false);
  const DeleteAnnotationsModal = useRef(null);

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          showDeleteAnnotations.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  outsideClickHanlder(DeleteAnnotationsModal);

  const MessageDataStyle = useSignal(null)
  const MessageDataVisible = useSignal(false);

  const UpdateMessage = useRef(null);

  let hideCopyAsHere = ['/auth', '/', '/refresh-token', '/_404']

  function toggleEdit() {
    if (!EditEnabled.value) {
      newMessage.value = props.Message.content;
    }
    EditEnabled.value = !EditEnabled.value;
  }

  async function callEditMessage(promptArray) {
    toggleEdit();

    let obj = {
      room_id: currentChat.uuid,
      date_from: props.Message.updated_at,
      organization_uuid: user.organization_uuid,
    };

    const sendRequest = async () => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/chat/messages`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(obj)
      }).then(res => res.json());

      return data;
    };

    try {
      const msg = await sendRequest();
      localStorage.setItem("ANT_PromptsToSend", JSON.stringify(promptArray));
    } catch (err) {
      console.log(err);
    }
  }

  function handlePillClick(e) {
    e.stopPropagation();
    const target = e.target.closest('.user-message .pill');

    if (target) {
      if (e.ctrlKey || e.metaKey) {
        window.open(`/templates/${target.dataset.content}`);
      } else {
        route(`/templates/${target.dataset.content}`);
      }
    }
  }

  function handleMessageData(e) {
    if (hideCopyAsHere.includes(window.location.pathname)) { return }
    if (MessageDataVisible.value) {
      MessageDataVisible.value = false;
    } else {
      let rect = e.target.getBoundingClientRect();
      if (rect.top > 470) {
        MessageDataStyle.value = {
          top: rect.top - 123,
          left: rect.left,
        }
      } else {
        MessageDataStyle.value = {
          top: rect.top + 43,
          left: rect.left,
        }
      }

      MessageDataVisible.value = true;
    }
  }

  function callDeleteAnnotations() {
    let ProfileData = JSON.parse(localStorage.getItem("ANT_hProfile"));

    let obj = {
      room_id: currentChat.uuid,
      api_key: ProfileData.token,
      url: props.Message.content_dict.source_url ? props.Message.content_dict.source_url : '#',
      annotation_ids: props.Message.content_dict.annotations.map(a => a.id),
      message_uuid: props.Message.uuid,
    };

    dispatch(deleteMessageAnnotations(obj));
    showDeleteAnnotations.value = false;
  }

  function generateAntLink() {
    props.Message.content_dict && props.Message.content_dict.source_url ? `` : '#'
    if (props.Message.content_dict) {
      if (props.Message.content_dict.source_url) {
        return `https://hyp.is/go?url=${encodeURIComponent(props.Message.content_dict.source_url)}&group=${props.Message.content_dict.group_id}`
      } else {
        return '#'
      }
    } else {
      return '#'
    }
  }

  async function tryAnnotateAgain() {
    let formData = { ...props.Message.content_dict.input };
    await dispatch(createAnnotations(formData));
    dispatch(getChatsData(currentChat.uuid))
  }

  if (props.Message.created_by === 'user') {
    return (
      <div className={'flex mt-2 group message-box'}>
        <div class={'bg-[#F2F2F2] max-w-[85%] mr-4 p-2 pr-3 relative rounded-lg ' + (EditEnabled.value ? 'w-full' : '')}>
          <div onMouseLeave={() => setShowSaveAs(false)} className="items-start">
            <div className="flex items-start">
              <img src={props.Message.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full shrink-0" />
              <div className={'self-center flex'}>
                <div onClick={e => handlePillClick(e)} className={(EditEnabled.value ? 'hidden' : '') + " mx-4 self-center overflow-hidden leading-6  inline-block break-all text-[#202020] text-sm user-message"} dangerouslySetInnerHTML={{ __html: props.Message.content_html ? props.Message.content_html : props.Message.content }}></div>
              </div>
              <div className={'max-w-[92%] w-full ml-4 p-2 pt-4 bg-white rounded  ' + (EditEnabled.value ? '' : 'hidden')}>
                <PromptInput
                  blockSending={false}
                  WSsendMessage={() => { }}
                  SubmitButtonText={'Save & Submit'}
                  handleSubmitButton={(value) => { callEditMessage(value.promptArray) }}
                  SecondButton={true}
                  SecondButtonText={'Cancel'}
                  handleSecondButton={() => toggleEdit()}

                  UseTemplatePosition={'left'}
                  UseFilePosition={'right'}
                  InitialInput={props.Message.content_html}
                  forceFocus={EditEnabled.value}
                  hideAnnotate={true}
                />
              </div>
              {/* <div className={(EditEnabled.value ? '' : 'hidden') + ' ml-4 border p-2 bg-[#FAFAFA] border-[#DBDBDB] rounded w-full flex items-center'}>
                <input onInput={(e) => updateNewMessageValue(e)} ref={UpdateMessage} value={props.Message.content} className={'text-sm text-[#202020] leading-6 focus:outline-none bg-[#FAFAFA] w-full'} type="text" />
              </div> */}
            </div>
          </div>
          {/* <div className={(EditEnabled.value ? '' : 'hidden') + ' w-full flex justify-end mt-2'}>
            <button onClick={() => toggleEdit()} type="submit" className="text-[#595959] text-sm leading-6 font-bold bg-transparent py-2 px-4 rounded">Cancel</button>
            <button onClick={() => { callEditMessage() }} type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded">Save & Submit</button>
          </div> */}
        </div>
        <div className={'ml-auto invisible sm:flex hidden items-start shrink-0 ' + (guestMode ? '' : 'group-hover:visible')}>
          <EditMessage toggleEdit={toggleEdit} />
          <SaveAsTemplate toggleShowSaveAs={tgl => setShowSaveAs(tgl)} showSaveAs={showSaveAs} msg={props.Message} />
          <CloneChatFromHere msg={props.Message} />
        </div>
      </div>
    )
  } else if (props.Message.created_by === 'bot') {
    return (
      <div onMouseLeave={() => setShowCopyAs(false)} className="flex mt-2">
        <div className="rounded flex p-2 w-full overflow-x-visible">
          <div class={'flex flex-col justify-between pb-4'}>
            <div onMouseEnter={e => handleMessageData(e)} onMouseLeave={e => handleMessageData(e)} className={"w-8 h-8 bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible ppya-avatar "}>
              <img src={docdrop} className="w-4" alt="" />
              <MessageData Visible={MessageDataVisible.value} Position={MessageDataStyle.value} Message={props.Message} />
              {/* <div className={(currentChat.messages[currentChat.messages.length - 1]?.uuid === props.Message.uuid ? 'bottom-10' : 'top-10') + ' absolute hidden py-2 px-3 bg-white w-[240px] z-50 left-0 rounded border text-xs ' + (hideCopyAsHere.includes(window.location.pathname) ? '' : 'group-hover:block')}>
                <div className={''}><span className={'font-bold text-[#747474]'}>Model:</span> GPT-4</div>
                <div className={'mt-2'}>
                  <span className={'font-bold text-[#747474]'}>Tokens:</span>
                  <ul className={'list-disc tokens mt-0.5'}>
                    <li>{props.Message.usage?.prompt_tokens_count} prompt tokens (${props.Message.usage?.prompt_value.toFixed(3)})</li>
                    <li>{props.Message.usage?.completion_tokens_count} completion tokens (${props.Message.usage?.completion_value.toFixed(3)})</li>
                    <li>{props.Message.usage?.total_tokens_count} total tokens (${props.Message.usage?.total_value.toFixed(3)})</li>
                  </ul>
                </div>
                {props.Message.elapsed_time && 
                  <div className={'mt-2'}><span className={'font-bold text-[#747474]'}>API Time:</span> {props.Message.elapsed_time.toFixed(2)} seconds</div>
                }
              </div> */}
            </div>
            {props.isLoading && 
                <div className='mt-4 ml-2'>
                  <Loading />
                </div>
              }
          </div>
          <div className={'flex group w-full'}>
            <div className={`ml-2 mt-2 text-[#202020] max-w-[97%] sm:max-w-[85%] text-sm bot-response response-${props.Message.uuid}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw], [rehypePrism, { ignoreMissing: true }]]} remarkRehypeOptions={{ passThrough: ['link'] }}>{props.Message.content}</ReactMarkdown>
            </div>
            
            <div className={'ml-auto shrink-0 hidden sm:block invisible ' + (hideCopyAsHere.includes(window.location.pathname) ? '' : 'sm:group-hover:visible')}>
              <CopyAs toggleShowCopyAs={tgl => setShowCopyAs(tgl)} showCopyAs={showCopyAs} msg={props.Message} chatUID={currentChat.uuid} />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (props.Message.created_by === 'annotation') {
    if (props.Message.content_dict) {
      if (props.Message.content_dict?.status) {
        return (
          <div className="flex my-2 border-[#DBDBDB] border border-dashed rounded-lg mr-4">
            <div className="rounded flex p-2 pb-3 w-full overflow-x-visible">
              <div onMouseEnter={e => handleMessageData(e)} onMouseLeave={e => handleMessageData(e)} class={''}>
                <div className={"w-8 h-8 bg-[#FAFAFA] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible border-[#DBDBDB] border ppya-avatar "}>
                  <img src={restricted} className="w-4" alt="" />
                  <MessageData Visible={MessageDataVisible.value} Position={MessageDataStyle.value} Message={props.Message} />
                </div>
              </div>
              <div className={'flex flex-col group w-full'}>
                <div className={'flex'}>
                  <div className={`ml-2 mt-2 text-[#202020] max-w-[99%] text-sm shrink-0 bot-response response-${props.Message.uuid}`}>
                    <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>{'**Error**: annotations with the following options were not created:'}</ReactMarkdown>
                  </div>
                  <div className={'w-full'}>
                    <div className={'flex gap-1 w-full justify-end'}>
                      <div className={'flex'}>
                        <button onClick={() => tryAnnotateAgain()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                          Try Again
                          <img src={refresh} className={'ml-2'} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {props.Message.content_dict.input &&
                  <div className={'ml-2'}>
                    <div>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        Prompt
                      </div>
                      <div className={'text-sm leading-6'}>
                        “{props.Message.content_dict.input.prompt}”
                      </div>
                    </div>
                    <div className={'mt-2'}>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        Source
                      </div>
                      <div className={'text-sm leading-6'}>
                        <a className={'underline'} href={`${props.Message.content_dict.input.url}`}>{props.Message.content_dict.input.url}</a>
                      </div>
                    </div>
                    <div className={'mt-2'}>
                      <div className="text-xs font-bold text-[#747474] mb-1 flex">
                        Reason
                      </div>
                      <div className={'text-sm leading-6'}>
                        {props.Message.content_dict.reason}
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="flex my-2 border-[#DBDBDB] border border-dashed rounded-lg mr-4">
            <div className="rounded flex p-2 pb-3 w-full overflow-x-visible">
              <div onMouseEnter={e => handleMessageData(e)} onMouseLeave={e => handleMessageData(e)} class={''}>
                <div className={"w-8 h-8 bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible ppya-avatar "}>
                  <img src={docdrop} className="w-3" alt="" />
                  <MessageData Visible={MessageDataVisible.value} Position={MessageDataStyle.value} Message={props.Message} />
                </div>
              </div>
              <div className={'flex flex-col group w-full'}>
                <div className={`ml-2 mt-2 text-[#202020] max-w-[99%] text-sm bot-response response-${props.Message.uuid}`}>
                  <ReactMarkdown rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}>{props.Message.content ? props.Message.content : 'Creating...'}</ReactMarkdown>
                </div>
                <div className={'w-full'}>
                  <div className={'flex gap-1 w-full justify-between'}>
                    <div className={'text-sm leading-6 text-[#747474] bg-[#EBEBEB] py-1 px-2 flex items-center rounded'}>
                      Only Visible to You
                    </div>
                    {props.Message.content != 'Creating...' && <div className={'flex'}>
                      <button onClick={() => { showDeleteAnnotations.value = true }} className={'flex items-center text-[#747474] cursor-pointer btn-second'}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 1C16 0.447715 15.5523 0 15 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H15C15.5523 2 16 1.55228 16 1ZM14 4H2C1.36895 4 0.895661 4.57732 1.01942 5.19612L3.01942 15.1961C3.1129 15.6635 3.52332 16 4 16H12C12.4767 16 12.8871 15.6635 12.9806 15.1961L14.9806 5.19612C15.1043 4.57732 14.631 4 14 4ZM12.78 6L11.18 14H4.819L3.219 6H12.78Z" fill="currentColor" />
                        </svg>
                        <span className={'font-semibold ml-2'}>Delete</span>
                      </button>
                      <a href={generateAntLink()} target="_blank" type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                        View Annotations
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="#FFFFFF" className={'ml-2'} xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 0C11.5128 0 11.9355 0.38604 11.9933 0.883379L12 1V7C12 7.55228 11.5523 8 11 8C10.4872 8 10.0645 7.61396 10.0067 7.11662L10 7V3.414L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0675907 11.3466 -0.0953203 10.7794 0.209705 10.3871L0.292893 10.2929L8.584 2H5C4.48716 2 4.06449 1.61396 4.00673 1.11662L4 1C4 0.487164 4.38604 0.0644928 4.88338 0.00672773L5 0H11Z" fill="#FFFFFF" />
                        </svg>
                      </a>
                    </div>}
                    {props.Message.content.length === 0 && <div className={'flex'}>
                      <button disabled={true} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                        Creating
                        <span className={'ml-2'}>
                          <Loading />
                        </span>
                      </button>
                    </div>}
                  </div>
                </div>
              </div>
            </div>

            {/* DELETE ANNOTATION MODAL  */}

            {props.Message.content_dict &&
              <div ref={DeleteAnnotationsModal} className={'fixed z-20 top-1/4 left-1/2 transform -translate-1/2 w-[320px] bg-[#202020] border border-[#595959] text-sm leading-6 rounded ' + (showDeleteAnnotations.value ? '' : 'hidden')}>
                {props.Message.content_dict.annotations &&
                  <div className={'p-4 text-white text-center'}>
                    Are you sure you want to delete <br />
                    {props.Message.content_dict.annotations.length > 1 ? props.Message.content_dict.annotations.length + ' annotations' : props.Message.content_dict.annotations.length + ' annotation'}
                    generated by Docdrop chat?
                  </div>}
                <div className={'flex gap-1 justify-center py-2 border-t border-[#595959]'}>
                  <button onClick={() => { showDeleteAnnotations.value = false }} type="button" className="btn-second light-gray">Cancel</button>
                  <button onClick={() => callDeleteAnnotations()} type="button" className="bg-[#EF4444] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center">Delete</button>
                </div>
              </div>
            }
          </div>
        )
      }
    }
  }
}