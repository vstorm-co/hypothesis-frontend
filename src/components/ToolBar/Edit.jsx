import { useStore } from '../../state/store';
import { useLocation } from 'preact-iso';

import pen from '../../assets/pen.svg';
import check from '../../assets/check.svg';


export function Edit(props) {
  const [state, dispatch] = useStore();

  function selectedChat() {
    return state.chats.find(chat => chat.selected);
  }

  function editChatTitle(event) {
    // @ts-ignore
    dispatch('EDIT_TITLE', { chatId: selectedChat().id, newTitle: event.target.value })
  }

  return (
    <div className="relative">
      <div onClick={props.onToggle} className={"p-1 border border-[#DBDBDB] rounded-t cursor-pointer"}>
        <div className={"p-2 " + (props.show ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4" src={pen} alt="edit" />
        </div>
      </div>
      <div className={"absolute border rounded -right-[15.5rem] -top-2 bg-white " + (props.show ? '' : 'hidden')}>
        <div class="border-b p-2">
          <div class="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input value={selectedChat().title} onChange={(event) => { editChatTitle(event) }} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
        </div>
        <div class="p-2">
          <div class="text-xs font-bold text-[#747474] mb-1">
            Visibility
          </div>
          <div class="flex py-1 border-b">
            <img src={check} alt="checkmark" class="w-4" /> <div class="text-sm leading-6">Just me</div>
          </div>
          <div class="flex py-1">
            <img src={check} alt="checkmark" class="w-4" /> <div class="text-sm leading-6">Organization</div>
          </div>
        </div>
      </div>
    </div>
  )
}