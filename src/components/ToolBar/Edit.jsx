
import dots from '../../assets/dots.svg';
import check from '../../assets/check.svg';
import { useSelector, useDispatch } from 'react-redux';
import { chatsActions, updateChat } from '../../store/chats-slice';

export function Edit(props) {
  const chats = useSelector(state => state.chats.chats);
  const dispatch = useDispatch();

  function selectedChat() {
    if (chats.find(c => c.selected)) {
      return chats.find(c => c.selected)
    } else {
      return { name: '' }
    };
  }

  function editChatTitle(event) {
    // @ts-ignore
    dispatch(updateChat({ chatId: selectedChat().uuid, name: event.target.value }))
  }

  return (
    <div className="relative">
      <div onClick={props.onToggle} className={"p-1 border border-[#DBDBDB] rounded-t cursor-pointer"}>
        <div className={"p-1 " + (props.show ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4 rotate-90" src={dots} alt="edit" />
        </div>
      </div>
      <div className={"absolute border rounded -right-[13rem] top-10 bg-white " + (props.show ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input value={selectedChat().name} onChange={(event) => { editChatTitle(event) }} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
        </div>
      </div>
    </div>
  )
}