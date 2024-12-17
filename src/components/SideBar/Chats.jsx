import { useSelector } from 'react-redux';
import { ChatBar } from './ChatBar';
import plus from '../../assets/plus.svg';
import { chatsActions, createChat, getChatsData } from "../../store/chats-slice";
import { useDispatch } from 'react-redux';
import { useEffect, useReducer, useState } from 'preact/hooks';
import { Loading } from '../Loading';
import { Virtuoso } from 'react-virtuoso';
import { Transition } from 'react-transition-group';

import caretDown from '../../assets/caret-down.svg';

import { useSignal } from '@preact/signals';
import { uiActions } from '../../store/ui-slice';
import { ChatOptions } from './ChatOptions';

export function Chats(props) {
  const chats = useSelector(state => state.chats.chats);
  const currentChat = useSelector(state => state.chats.currentChat);
  const usersActive = useSelector(state => state.chats.usersActive);
  const size = useSelector(state => state.chats.size);
  const info = useSelector(state => state.chats.info);
  const ui = useSelector(state => state.ui);

  const dispatch = useDispatch();

  const [isScrolling, setIsScrolling] = useState(false);

  const [loadSize, setLoadSize] = useState(0);

  const showFadeBottom = useSignal(true);
  const showFadeTop = useSignal(false);
  const topItemCount = useSignal(-1);

  const isFirstRender = useSignal(true);

  // const expanded = useSignal(true);
  function handleExpanded() {
    dispatch(uiActions.setChatsExpanded(!ui.chatsExpanded))
  }

  const organizationChats = useSelector(state => state.chats.organizationChats);

  useEffect(() => {
    let virtuosoScroll = document.querySelector('.chats div[data-testid="virtuoso-scroller"]');

    if (!isFirstRender.value && virtuosoScroll) {
      if (Math.ceil(virtuosoScroll.scrollTop + virtuosoScroll.clientHeight) >= virtuosoScroll.scrollHeight - 10) {
        showFadeBottom.value = false;
      } else {
        showFadeBottom.value = true;
      }
    } else {
      isFirstRender.value = false
    }

    if (virtuosoScroll) {
      if (virtuosoScroll.scrollTop < 30) {
        showFadeTop.value = false
      } else {
        showFadeTop.value = true;
      }
    }

  }, [isScrolling, ui.chatsExpanded, ui.templatesExpanded])

  useEffect(async () => {
    if (currentChat.uuid === null) {
      topItemCount.value = -1;

      await dispatch(uiActions.toggleChatsLoading(true));
      await dispatch(uiActions.toggleChatsLoading(false));
    } else {
      topItemCount.value = 1;
    }

  }, [currentChat.uuid])

  function callCreateChat() {
    dispatch(createChat('New Chat'));
  }

  function handleToggleScrollBar(tgl) {
    props.handleToggleScrollBar(tgl);
  }

  return (
    <div className={"px-3 flex flex-col overflow-hidden " + (ui.chatsExpanded ? 'flex-1' : 'h-14 pb-8')} >
      <ChatOptions />
      <div className="text-xs leading-6 font-bold flex justify-between items-center py-4 px-1">
        <div onClick={() => handleExpanded()} className={'flex cursor-pointer'}>
          <img src={caretDown} alt="" className={'w-4 mr-1 transform ' + (ui.chatsExpanded ? '' : '-rotate-90')} />
          <div>CHATS</div> <div className={"ml-2 px-2 border border-[#595959] font-normal flex justify-center items-center rounded-[4px] " + (info?.total > 0 && chats?.length > 0 ? '' : 'hidden')}>{info?.total}</div>
        </div>
        <div onClick={callCreateChat} class="flex items-center justify-center font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {!ui.chatsLoading &&
        <div className={'text-[#747474] px-2 text-sm ' + (chats?.length === 0 && organizationChats?.length === 0 ? '' : 'hidden')}>
          No chats to display.
        </div>
      }
      {!ui.chatsLoading &&
        <div class="flex flex-col overflow-y-auto relative h-full chats">
          <Virtuoso
            style={{ height: '100%', scrollbarWidth: 'none' }}
            data={chats}
            topItemCount={topItemCount.value}
            isScrolling={setIsScrolling}
            itemContent={(_, chat) => (
              <ChatBar handleToggleScrollBar={(tgl) => handleToggleScrollBar(tgl)} ChatData={chat} />
            )}
          />
          <div className={"fadeBottom " + (showFadeBottom.value ? '' : 'hid')}></div>
          <div className={"fadeTop " + (showFadeTop.value ? '' : 'hid ') + (currentChat.uuid ? 'mt-14' : '')}></div>
        </div>
      }
      {ui.chatsLoading &&
        <div className={'flex items-center justify-center'}>
          <Loading />
        </div>}
    </div>
  )
}