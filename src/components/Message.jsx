import { useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';
import { SaveAsTemplate } from './ToolBars/ChatToolbar/SaveAsTemplate';

import papaya from '../assets/images/papaya.png';
import CopyAs from './ToolBars/ChatToolbar/CopyAs';
import { useState } from 'preact/hooks';

export function Message(props) {
  const dispatch = useDispatch();

  const [showCopyAs, setShowCopyAs] = useState(false);

  if (props.Message.created_by === 'user') {
    return (
      <div className="flex items-start my-4 group">
        <div className="bg-[#F2F2F2] rounded-lg flex items-start p-2 pr-3 max-w-3xl">
          <img src={props.Message.sender_picture} className="w-8 h-8 border border-[#DBDBDB] rounded-full" />
          <div className="ml-4 self-center text-[#202020] text-sm" title={props.Message.content} dangerouslySetInnerHTML={{ __html: props.Message.content_html ? props.Message.content_html : props.Message.content }}></div>
        </div>
        <div className={'ml-auto hidden group-hover:flex items-center shrink-0'}>
          <SaveAsTemplate msg={props.Message} />
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
          <div className={`ml-2 mt-1 text-[#202020] max-w-[85%] text-sm bot-response response-${props.Message.uuid}`}>
            <ReactMarkdown rehypePlugins={[rehypePrism]}>{props.Message.content}</ReactMarkdown>
          </div>
          <div className={'ml-auto shrink-0 hidden group-hover:block'}>
            <CopyAs toggleShowCopyAs={tgl => setShowCopyAs(tgl)} showCopyAs={showCopyAs} msg={props.Message} />
          </div>
        </div>
      </div>
    )
  }
}