import { useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypePrism from '@mapbox/rehype-prism';


import bot from '../assets/bot.svg';

export function Message(props) {
  const dispatch = useDispatch();

  if (props.Message.created_by === 'user') {
    return (
      <div className="flex my-4">
        <div className="bg-[#F2F2F2] rounded flex items-center p-2">
          <div className="w-8 h-8 bg-black rounded-full mr-2 text-sm leading-6"></div> <div className="ml-2">{props.Message.content}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex my-4">
        <div className="rounded flex p-2">
          <div className="w-8 h-8 border border-[#DBDBDB] rounded-full mr-2 flex items-center justify-center shrink-0"><img src={bot} className="w-4" alt="" /></div>
          <div className="ml-2 mt-1">
            <ReactMarkdown rehypePlugins={[rehypePrism]}>{props.Message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }



}