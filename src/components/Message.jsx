import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';
import SaveAsTemplate from './ToolBars/ChatToolbar/SaveAsTemplate';
import { useSignal } from '@preact/signals';

import papaya from '../assets/images/papaya.png';
import CopyAs from './ToolBars/ChatToolbar/CopyAs';
import { useRef, useState } from 'preact/hooks';
import { CloneChatFromHere } from './ToolBars/ChatToolbar/CloneChatFromHere';
import { EditMessage } from './ToolBars/ChatToolbar/EditMessage';
import { PromptInput } from './PromptInput';


export function Message(props) {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat);
  const user = useSelector(state => state.user.currentUser);

  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showCopyAs, setShowCopyAs] = useState(false);

  const EditEnabled = useSignal(false);
  const newMessage = useSignal('');

  const UpdateMessage = useRef(null);

  let hideCopyAsHere = ['/auth', '/']

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
      props.handleUpdateMessage(promptArray);
    } catch (err) {
      console.log(err);
    }
  }

  if (props.Message.created_by === 'user') {
    return (
      <div className={'flex my-4 group'}>
        <div class={'bg-[#F2F2F2] max-w-[85%] overflow-hidden mr-4 p-2 pr-3 rounded-lg ' + (EditEnabled.value ? 'w-full' : '')}>
          <div onMouseLeave={() => setShowSaveAs(false)} className="items-start">
            <div className="flex items-start">
              <img src={props.Message.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full shrink-0" />
              <div className={'self-center py-1'}>
                <div className={(EditEnabled.value ? 'hidden' : '') + " mx-4 self-center inline-block break-all text-[#202020] text-sm"} dangerouslySetInnerHTML={{ __html: props.Message.content_html ? props.Message.content_html : props.Message.content }}></div>
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

                  InitialInput={props.Message.content_html}
                  forceFocus={EditEnabled.value}
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
        <div className={'ml-auto hidden group-hover:flex items-start shrink-0'}>
          <EditMessage toggleEdit={toggleEdit} />
          <SaveAsTemplate toggleShowSaveAs={tgl => setShowSaveAs(tgl)} showSaveAs={showSaveAs} msg={props.Message} />
          <CloneChatFromHere msg={props.Message} />
        </div>
      </div>
    )
  } else {
    return (
      <div onMouseLeave={() => setShowCopyAs(false)} className="flex my-4">
        <div className="rounded flex p-2 w-full overflow-x-visible">
          <div className="w-8 h-8 border bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0 relative overflow-visible cursor-pointer group">
            <img src={papaya} className="w-3" alt="" />
            <div className={'absolute hidden group-hover:block py-2 px-3 bg-white w-[240px] top-10 z-50 left-0 rounded border text-xs'}>
              <div className={''}><span className={'font-bold text-[#747474]'}>Model:</span> GPT-4</div>
              <div className={'mt-2'}>
                <span className={'font-bold text-[#747474]'}>Tokens:</span>
                <ul className={'list-disc tokens mt-0.5'}>
                  <li>{props.Message.usage?.prompt_tokens_count} prompt tokens (${props.Message.usage?.prompt_value.toFixed(3)})</li>
                  <li>{props.Message.usage?.completion_tokens_count} completion tokens (${props.Message.usage?.completion_value.toFixed(3)})</li>
                  <li>{props.Message.usage?.total_tokens_count} total tokens (${props.Message.usage?.total_value.toFixed(3)})</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={'flex group w-full'}>
            <div className={`ml-2 mt-2 text-[#202020] max-w-[85%] text-sm bot-response response-${props.Message.uuid}`}>
              <ReactMarkdown rehypePlugins={[rehypePrism]}>{props.Message.content}</ReactMarkdown>
            </div>
            <div className={'ml-auto shrink-0 hidden ' + (hideCopyAsHere.includes(window.location.pathname) ? '' : 'group-hover:block')}>
              <CopyAs toggleShowCopyAs={tgl => setShowCopyAs(tgl)} showCopyAs={showCopyAs} msg={props.Message} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}