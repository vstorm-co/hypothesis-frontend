// @ts-nocheck
import chatIcon from '../../assets/chat.svg';
import { useLocation } from 'preact-iso';
import { selectChat } from '../../store/chats-slice';
import { useDispatch, useSelector } from 'react-redux';

export const ChatBar = props => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat)

  const callSelectChat = () => {
    location.route(`/${props.ChatData.uuid}`);
    dispatch(selectChat(props.ChatData.uuid));
  }

  function isSelected() {
    return props.ChatData.uuid === currentChat.uuid
  }

  return (
    <div onClick={callSelectChat} className={"flex items-center py-2 px-2 rounded cursor-pointer " + (isSelected() ? 'bg-[#595959]' : 'hover:bg-[#0F0F0F]')}>
      <img className="w-4" src={chatIcon} alt="" />
      <div className="font-base text-sm leading-6 ml-2">
        {props.ChatData.name}
      </div>
    </div>
  )
}