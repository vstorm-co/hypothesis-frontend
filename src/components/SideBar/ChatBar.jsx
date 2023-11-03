// @ts-nocheck
import chatIcon from '../../assets/chat.svg';
import meChat from '../../assets/me-chat.svg';
import { route } from 'preact-router'
import { selectChat } from '../../store/chats-slice';
import { templatesActions } from '../../store/templates-slice';
import { useDispatch, useSelector } from 'react-redux';

export const ChatBar = props => {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat)

  const callSelectChat = () => {
    route(`/chats/${props.ChatData.uuid}`);
    dispatch(selectChat(props.ChatData.uuid));
    dispatch(templatesActions.setCurrentTemplate({}));
  }

  function isSelected() {
    return props.ChatData.uuid === currentChat.uuid
  }

  return (
    <div onClick={callSelectChat} className={"flex items-center py-2 px-2 rounded cursor-pointer " + (isSelected() ? 'bg-[#595959]' : 'hover:bg-[#0F0F0F]')}>
      <img className={"w-4"} src={props.ChatData.visibility === 'just_me' ? meChat : chatIcon} alt="" />
      <div title={props.ChatData.name} className="font-bold text-sm leading-6 ml-2 truncate">
        {props.ChatData.name}
      </div>
    </div>
  )
}