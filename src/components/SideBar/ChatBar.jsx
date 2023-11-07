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

  function EditedAt() {
    const updatedAt = new Date(props.ChatData.updated_at ? props.ChatData.updated_at : props.ChatData.created_at);
    const today = new Date();

    // const diffrence = Math.floor((today.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24));
    var hours = Math.floor(Math.abs(today - updatedAt) / 36e5);
    // var hours = Math.floor(12 * 24);

    // if (hours === 0) {
    // 	return 'Just now';
    // }

    if (hours < 24) {
      return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
    } else if (hours >= 24 && hours < 7 * 24) {
      let days = Math.floor(hours / 24);
      return `${days} ${days > 1 ? 'days' : 'day'} ago`
    } else if (hours >= 7 * 24) {
      let weeks = Math.floor((hours / 24) / 7)
      return `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`
    }
  }

  return (
    <div onClick={callSelectChat} className={"flex items-center py-2 px-2 rounded cursor-pointer " + (isSelected() ? 'bg-[#595959]' : 'hover:bg-[#0F0F0F]')}>
      <img className={"w-4"} src={props.ChatData.visibility === 'just_me' ? meChat : chatIcon} alt="" />
      <div title={props.ChatData.name} className="font-bold text-sm leading-6 ml-2 truncate">
        {props.ChatData.name}
      </div>
      <div className={'ml-auto text-xs shrink-0 ' + (isSelected() ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
        {EditedAt()}
      </div>
    </div>
  )
}