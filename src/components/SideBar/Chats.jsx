import { ChatBar } from './ChatBar';
import { useStore } from '../../state/store';

import plus from '../../assets/plus.svg'


export function Chats() {
  const state = useStore()[0];
  return (
    <div className="mt-4">
      <div className="text-xs font-bold mb-2">
        Chats
      </div>
      {state.chats.map(chat => (
        <ChatBar ChatData={chat} />
      ))}
      <div className="flex items-center py-3 px-2 rounded cursor-pointer hover:bg-[#595959]">
        <img src={plus} alt="" />
        <div className="text-sm leading-6 ml-[10px]">
          New Chat
        </div>
      </div>
    </div>
  )
}