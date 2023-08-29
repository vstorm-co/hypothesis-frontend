import { ChatBar } from './ChatBar';
import { useStore } from '../../state/store';

import plus from '../../assets/plus.svg'


export function Chats() {
  const [state, dispatch] = useStore();

  function createChat() {
    dispatch('CREATE_CHAT', "New Chat");
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center">
        <div>Chats</div> <div class="ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px]">{state.chats.length}</div>
        <div onClick={createChat} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {state.chats.map(chat => (
        <ChatBar ChatData={chat} />
      ))}
    </div>
  )
}