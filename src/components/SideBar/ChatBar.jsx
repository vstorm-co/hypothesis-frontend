// @ts-nocheck
import chatIcon from '../../assets/chat.svg';
import meChat from '../../assets/me-chat.svg';
import { route } from 'preact-router'
import { templatesActions } from '../../store/templates-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useSignal } from '@preact/signals';
import { uiActions } from '../../store/ui-slice';

export const ChatBar = props => {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat);
  const chatOptions = useSelector(state => state.ui.chatOptions);
  const ShowOptions = useSignal(false);

  const callSelectChat = () => {
    // dispatch(selectChat(props.ChatData.uuid));

    let width = window.innerWidth;
    if (width < 960) {
      dispatch(uiActions.setExpandSideBar(false));
    }
    dispatch(templatesActions.setCurrentTemplate({}));
    route(`/chats/${props.ChatData.uuid}`);
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

    if (hours === 0) {
      return 'Just now';
    }


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

  function handleToggleOptions(tgl) {
    if (tgl != undefined) {
      ShowOptions.value = false;
      props.handleToggleScrollBar(false);
    } else {
      ShowOptions.value = !ShowOptions.value;
      props.handleToggleScrollBar(ShowOptions.value);
    }
  }

  function handleClass() {
    if (chatOptions.data) {
      let isCurrentChatOptions = chatOptions.data.uuid === props.ChatData.uuid
      let chatOptionsVisible = chatOptions.show && isCurrentChatOptions;
      return `${(chatOptions.show && isCurrentChatOptions) ? 'bg-[#0f0f0f]' : 'bg-[#202020]'} ${(chatOptionsVisible && !isSelected()) ? 'py-1 ' : 'py-2'} ${(chatOptionsVisible || isSelected()) ? '' : 'hover:py-1'}`
    } else {
      return `py-2 ${isSelected() || CheckUsersOnChat() ? '' : 'hover:py-1'}`
    }
  }

  function CheckUsersOnChat() {
    return props.ChatData.active_users.length;
  }

  function handleChatOptions(e) {
    let rect = e.target.getBoundingClientRect();
    let windowH = document.body.parentNode.offsetHeight
    let position = {}
    let diff = windowH - Math.ceil(rect.top);
    if (diff < 271) {
      position = {
        top: Math.ceil(rect.top - diff + 50)
      }
    } else {
      position = {
        top: Math.ceil(rect.top)
      }
    }
    console.log();
    dispatch(uiActions.setChatsOptions({ show: true, position, data: props.ChatData }))
  }

  function handleBoxClass() {
    let isCurrentChatOptions = chatOptions.data?.uuid === props.ChatData.uuid

    return `${isSelected() ? 'hover:bg-[#595959]' : 'hover:bg-[#202020]'} ${chatOptions.show ? 'text-white' : ''} + ${(isSelected() && chatOptions.show && isCurrentChatOptions) ? 'bg-[#595959]' : ''} + ${(!isSelected() && chatOptions.show && isCurrentChatOptions) ? 'bg-[#202020]' : ''}`
  }


  return (
    <div className={"flex w-full pl-2 pr-1 group items-center rounded " + (props.ChatData?.uuid === currentChat.uuid ? 'bg-[#747474] ' : 'hover:bg-[#0F0F0F] ') + handleClass()}>
      <div onClick={(e) => { e.stopPropagation(); callSelectChat() }} className={'flex w-full cursor-pointer'}>
        <img className={"w-4 mt-0.5 " + (CheckUsersOnChat() ? 'self-start' : '')} src={props.ChatData.visibility === 'just_me' ? meChat : chatIcon} alt="" />
        <div className={'flex ml-2 w-full ' + (CheckUsersOnChat() ? 'flex-col' : '')}>
          <div title={props.ChatData?.name} className={"font-bold mr-1 text-sm break-words " + (isSelected() ? 'leading-4' : 'truncate leading-6 max-w-[168px]')}>
            {props.ChatData?.name}
          </div>
          <div className={'flex shrink-0 items-center ' + (CheckUsersOnChat() ? 'mt-2' : 'ml-auto')}>
            <div className={' text-xs shrink-0 ' + (isSelected() ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
              {EditedAt()}
            </div>
            <div className={"ml-2 " + (CheckUsersOnChat() ? 'flex gap-[1px]' : 'hidden')}>
              {props.ChatData?.active_users.map(u => (
                <img title={u.name} src={u.picture} className="w-6 h-6 border-[#DBDBDB] rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div onClick={handleChatOptions} className={(chatOptions.show && (chatOptions.data.uuid === props.ChatData?.uuid) ? 'block' : 'hidden group-hover:block') + ' ml-2 cursor-pointer hover:text-white rounded p-2 shrink-0 ' + (CheckUsersOnChat() ? 'self-start ' : '') + (isSelected() ? 'text-[#DBDBDB] ' : 'text-[#747474] ') + handleBoxClass()}>
        {/* <ChatOptions isSelected={isSelected()} ChatData={props.ChatData} toggleOptions={(tgl) => handleToggleOptions(tgl)} ShowOptions={ShowOptions.value} /> */}
        <div class="">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 2C10 3.10457 9.10457 4 8 4C6.89543 4 6 3.10457 6 2C6 0.89543 6.89543 -4.82823e-08 8 0C9.10457 4.82823e-08 10 0.89543 10 2ZM10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8ZM8 16C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12C6.89543 12 6 12.8954 6 14C6 15.1046 6.89543 16 8 16Z" />
          </svg>
        </div>
      </div>
    </div >
  )
}