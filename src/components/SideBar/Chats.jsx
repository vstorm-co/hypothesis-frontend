import { useSelector } from 'react-redux';
import { ChatBar } from './ChatBar';
import plus from '../../assets/plus.svg';
import { getChatsData, createChat } from "../../store/chats-slice";
import { useDispatch } from 'react-redux';
import { useEffect } from 'preact/hooks'



export function Chats() {
  const chats = useSelector(state => state.chats.chats);

  const dispatch = useDispatch();

  useEffect(() => {

  }, [])

  function callCreateChat() {
    dispatch(createChat('New Chat'));
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center">
        <div>Chats</div> <div class="ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px]">{chats.length}</div>
        <div onClick={callCreateChat} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {chats.map(chat => (
        <ChatBar ChatData={chat} />
      ))}
      <div className={'text-center text-sm mt-2 ' + (chats.length === 0 ? '' : 'hidden')}>
        No chats yet! go ahead create one
      </div>
    </div>
  )
}