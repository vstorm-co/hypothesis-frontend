import { useSelector } from 'react-redux';
import { ChatBar } from './ChatBar';
import plus from '../../assets/plus.svg';
import { chatsActions, createChat, getChatsData } from "../../store/chats-slice";
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { Loading } from '../Loading';

import arrowDown from '../../assets/arrow-down.svg';

export function Chats() {
  const chats = useSelector(state => state.chats.chats);
  const size = useSelector(state => state.chats.size);
  const info = useSelector(state => state.chats.info);
  const currentChat = useSelector(state => state.chats.currentChat);
  const ui = useSelector(state => state.ui);

  const [loadSize, setLoadSize] = useState(0);

  const organizationChats = useSelector(state => state.chats.organizationChats);

  const dispatch = useDispatch();

  useEffect(() => {
    if (info.total > 5) {
      setLoadSize(5);
    }
    if (info.total < 5) {
      setLoadSize(0);
    }

    if ((info.total - size) < 5) {
      setLoadSize(info.total - size);
    }
  }, [info.total]);

  function callCreateChat() {
    dispatch(createChat('New Chat'));
  }

  function callLoadMore() {
    dispatch(chatsActions.setSize(size + loadSize));

    if (info.total > 20) {
      setLoadSize(10);
    }

    if (info.total < 5) {
      setLoadSize(0);
    }

    if ((info.total - (size + loadSize)) < 5) {
      setLoadSize(info.total - (size + loadSize));
    }

    dispatch(getChatsData());
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
        <div>Chats</div> <div className={"ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px] " + (info?.total > 0 ? '' : 'hidden')}>{info?.total}</div>
        <div onClick={callCreateChat} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {!ui.chatsLoading &&
        <div>
          <div className={''}>
            {chats?.map(chat => (
              <ChatBar ChatData={chat} />
            ))}
          </div>
          {loadSize > 0 && <div onClick={callLoadMore} className={"flex items-center py-2 px-2 rounded cursor-pointer border-dashed border border-[#595959]"}>
            <div className={'py-[2px] px-[3px]'}>
              <img className={"w-[10px] h-[12px]"} src={arrowDown} alt="" />
            </div>
            <div className="font-normal text-sm leading-6 ml-2">
              Load {loadSize} More
            </div>
          </div>}
          <div className={'text-[#747474] px-2 text-sm mt-2 ' + (chats?.length === 0 && organizationChats?.length === 0 ? '' : 'hidden')}>
            No chats
          </div>
        </div>
      }
      {ui.chatsLoading &&
        <div className={'flex items-center justify-center'}>
          <Loading />
        </div>}

    </div>
  )
}