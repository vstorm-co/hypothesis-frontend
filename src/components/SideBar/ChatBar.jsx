// @ts-nocheck
import chatIcon from '../../assets/chat.svg';
import meChat from '../../assets/me-chat.svg';
import { route } from 'preact-router'
import { selectChat } from '../../store/chats-slice';
import { templatesActions } from '../../store/templates-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals';
import { ChatOptions } from './ChatOptions';

export const ChatBar = props => {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat);
  const ShowOptions = useSignal(false);

  const callSelectChat = () => {
    route(`/chats/${props.ChatData.uuid}`);
    // dispatch(selectChat(props.ChatData.uuid));
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
    let selected = props.ChatData.uuid === currentChat.uuid;
    if (!ShowOptions.value && !CheckUsersOnChat()) {
      // return "py-2 hover:py-1"
      return "py-2"
    }
    if (CheckUsersOnChat()) {
      return "py-2"
    }
    if (ShowOptions.value && !CheckUsersOnChat()) {
      return "py-1"
    }
  }

  function CheckUsersOnChat() {
    return props.ChatData.active_users.length;
  }


  return (
    <div onClick={callSelectChat} className={"flex pl-2 pr-1 group bg-[#202020] items-center rounded cursor-pointer " + (isSelected() ? 'bg-[#747474] ' : 'hover:bg-[#0F0F0F] ') + handleClass()}>
      <img className={"w-4 mt-0.5 " + (CheckUsersOnChat() ? 'self-start' : '')} src={props.ChatData.visibility === 'just_me' ? meChat : chatIcon} alt="" />
      <div className={'flex ml-2 w-full ' + (CheckUsersOnChat() ? 'flex-col' : '')}>
        <div title={props.ChatData.name} className={"font-bold text-sm break-words " + (isSelected() ? 'leading-4 ' : 'truncate leading-6 max-w-[168px]')}>
          {props.ChatData.name}
        </div>
        <div className={'flex items-center mt-1 ' + (CheckUsersOnChat() ? '' : 'ml-auto')}>
          <div className={' text-xs shrink-0 ' + (isSelected() ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
            {EditedAt()}
          </div>
          <div className={"ml-2 " + (CheckUsersOnChat() ? 'flex gap-[1px]' : 'hidden')}>
            {props.ChatData.active_users.map(u => (
              <img title={u.name} src={u.picture} className="w-6 h-6 border-[#DBDBDB] rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className={'' + (false ? 'block ' : 'hidden ') + (CheckUsersOnChat() ? 'self-start' : '')}>
        <ChatOptions isSelected={isSelected()} ChatData={props.ChatData} toggleOptions={(tgl) => handleToggleOptions(tgl)} ShowOptions={ShowOptions.value} />
      </div>
    </div>
  )
}