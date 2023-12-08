import { useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';
import SaveAsTemplate from './ToolBars/ChatToolbar/SaveAsTemplate';
import { useSignal } from '@preact/signals';

import papaya from '../assets/images/papaya.png';
import CopyAs from './ToolBars/ChatToolbar/CopyAs';
import { useState } from 'preact/hooks';
import { CloneChatFromHere } from './ToolBars/ChatToolbar/CloneChatFromHere';
import { EditMessage } from './ToolBars/ChatToolbar/EditMessage';


export function Message(props) {
  const dispatch = useDispatch();

  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showCopyAs, setShowCopyAs] = useState(false);

  const EditEnabled = useSignal(false);

  let hideCopyAsHere = ['/auth', '/']

  function toggleEdit() {
    EditEnabled.value = !EditEnabled.value;
  }

  if (props.Message.created_by === 'user') {
    return (
      <div className={'flex group'}>
        <div class={'bg-[#F2F2F2] max-w-[720px] p-2 pr-3 rounded-lg ' + (EditEnabled.value ? 'w-full' : '')}>
          <div onMouseLeave={() => setShowSaveAs(false)} className="items-start">
            <div className="flex items-start max-w-3xl">
              <img src={props.Message.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full shrink-0" />
              <div className={(EditEnabled.value ? 'hidden' : '') + " ml-4 self-center text-[#202020] text-sm"} title={props.Message.content} dangerouslySetInnerHTML={{ __html: props.Message.content_html ? props.Message.content_html : props.Message.content }}></div>
              <div className={(EditEnabled.value ? '' : 'hidden') + ' ml-4 border p-2 bg-[#FAFAFA] border-[#DBDBDB] rounded w-full flex items-center'}>
                <input value={props.Message.content} className={'text-sm text-[#202020] leading-6 focus:outline-none bg-[#FAFAFA] w-full'} type="text" />
              </div>
            </div>
          </div>
          <div className={(EditEnabled.value ? '' : 'hidden') + ' w-full flex justify-end mt-2'}>
            <button onClick={() => toggleEdit()} type="submit" className="text-[#595959] text-sm leading-6 font-bold bg-transparent py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded">Save & Submit</button>
          </div>
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
      <div onMouseLeave={() => setShowCopyAs(false)} className="flex my-4 group">
        <div className="rounded flex p-2 w-full">
          <div className="w-8 h-8 border bg-[#202020] rounded-full mr-2 flex items-center justify-center shrink-0">
            <img src={papaya} className="w-3" alt="" />
          </div>
          <div className={`ml-2 mt-2 text-[#202020] max-w-[85%] text-sm bot-response response-${props.Message.uuid}`}>
            <ReactMarkdown rehypePlugins={[rehypePrism]}>{props.Message.content}</ReactMarkdown>
          </div>
          <div className={'ml-auto shrink-0 hidden ' + (hideCopyAsHere.includes(window.location.pathname) ? '' : 'group-hover:block')}>
            <CopyAs toggleShowCopyAs={tgl => setShowCopyAs(tgl)} showCopyAs={showCopyAs} msg={props.Message} />
          </div>
        </div>
      </div>
    )
  }
}