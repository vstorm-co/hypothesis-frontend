import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SaveAsTemplate from './ToolBars/ChatToolbar/SaveAsTemplate';
import { useSignal } from '@preact/signals';

import papaya from '../assets/images/papaya.png';
import CopyAs from './ToolBars/ChatToolbar/CopyAs';
import arrow from '../assets/arrow.svg';
import { useRef, useState } from 'preact/hooks';
import { CloneChatFromHere } from './ToolBars/ChatToolbar/CloneChatFromHere';
import { EditMessage } from './ToolBars/ChatToolbar/EditMessage';
import { PromptInput } from './PromptInput';
import { route } from 'preact-router';
import { MessageData } from './MessageData';
import { Loading } from './Loading';


export function Message(props) {
  const currentChat = useSelector(state => state.chats.currentChat);
  const user = useSelector(state => state.user.currentUser);

  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showCopyAs, setShowCopyAs] = useState(false);

  const EditEnabled = useSignal(false);
  const newMessage = useSignal('');

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

  if (props.Message.created_by === 'user') {
    return (
      <div className={'flex mt-2 group message-box'}>
        <div class={'bg-[#F2F2F2] max-w-[85%] mr-4 p-2 pr-3 relative rounded-lg ' + (EditEnabled.value ? 'w-full' : '')}>
          <div onMouseLeave={() => setShowSaveAs(false)} className="items-start">
            <div className="flex items-start">
              <img src={props.Message.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full shrink-0" />
              <div className={'self-center py-1'}>
                <div onClick={e => handlePillClick(e)} className={(EditEnabled.value ? 'hidden' : '') + " mx-4 self-center overflow-hidden inline-block break-all text-[#202020] text-sm user-message"} dangerouslySetInnerHTML={{ __html: props.Message.content_html ? props.Message.content_html : props.Message.content }}></div>
              </div>
              <div className={'max-w-[92%] w-full ml-4 p-2 bg-white rounded  ' + (EditEnabled.value ? '' : 'hidden')}>
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
        <div className={'ml-auto invisible group-hover:visible flex items-start shrink-0'}>
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
          <div class={''}>
            <div onMouseEnter={e => handleMessageData(e)} onMouseLeave={e => handleMessageData(e)} className={"w-8 h-8 bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible ppya-avatar "}>
              <img src={papaya} className="w-3" alt="" />
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
          </div>
          <div className={'flex group w-full'}>
            <div className={`ml-2 mt-2 text-[#202020] max-w-[85%] text-sm bot-response response-${props.Message.uuid}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw], [rehypePrism, { ignoreMissing: true }]]} remarkRehypeOptions={{ passThrough: ['link'] }}>{props.Message.content}</ReactMarkdown>
            </div>
            <div className={'ml-auto shrink-0 invisible ' + (hideCopyAsHere.includes(window.location.pathname) ? '' : 'group-hover:visible')}>
              <CopyAs toggleShowCopyAs={tgl => setShowCopyAs(tgl)} showCopyAs={showCopyAs} msg={props.Message} />
            </div>
          </div>
        </div>
      </div>
    )
  } else if (props.Message.created_by === 'annotation') {
    return (
      <div className="flex my-2 border-[#DBDBDB] border border-dashed rounded-lg mr-4">
        <div className="rounded flex p-2 pb-3 w-full overflow-x-visible">
          <div onMouseEnter={e => handleMessageData(e)} onMouseLeave={e => handleMessageData(e)} class={''}>
            <div className={"w-8 h-8 bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible ppya-avatar "}>
              <img src={papaya} className="w-3" alt="" />
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
                  <a href={props.Message.content_dict && props.Message.content_dict.source_url ? `https://hyp.is/go?url=${encodeURIComponent(props.Message.content_dict.source_url)}&group=${props.Message.content_dict.group_id}` : '#'} target="_blank" type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
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
      </div>
    )
  }
}