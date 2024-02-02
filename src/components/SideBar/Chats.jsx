import { useSelector } from 'react-redux';
import { ChatBar } from './ChatBar';
import plus from '../../assets/plus.svg';
import { chatsActions, createChat, getChatsData } from "../../store/chats-slice";
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { Loading } from '../Loading';

import arrowDown from '../../assets/arrow-down.svg';

export function Chats(props) {
  const chats = useSelector(state => state.chats.chats);
  const usersActive = useSelector(state => state.chats.usersActive);
  const size = useSelector(state => state.chats.size);
  const info = useSelector(state => state.chats.info);
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

  function handleToggleScrollBar(tgl) {
    props.handleToggleScrollBar(tgl);
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
        <div>Chats</div> <div className={"ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px] " + (info?.total > 0 && chats?.length > 0 ? '' : 'hidden')}>{info?.total}</div>
        <div onClick={callCreateChat} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {!ui.chatsLoading &&
        <div>
          <div className={''}>
            {chats?.map(chat => (
              <ChatBar handleToggleScrollBar={(tgl) => handleToggleScrollBar(tgl)} ChatData={chat} />
            ))}
          </div>
          {(loadSize > 0 && chats?.length > 0) && <div onClick={callLoadMore} className={"flex items-center py-2 px-2 rounded cursor-pointer border-dashed border border-[#595959] mt-2"}>
            <div className={'py-[2px] px-[3px]'}>
              <div className={"w-[10px] h-[12px] text-[#747474]"}>
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0C5.51284 0 5.93551 0.38604 5.99327 0.883379L6 1V8.585L8.29289 6.29289C8.65338 5.93241 9.22061 5.90468 9.6129 6.2097L9.70711 6.29289C10.0676 6.65338 10.0953 7.22061 9.7903 7.6129L9.70711 7.70711L5.70711 11.7071C5.34662 12.0676 4.77939 12.0953 4.3871 11.7903L4.29289 11.7071L0.292893 7.70711C-0.0976311 7.31658 -0.0976311 6.68342 0.292893 6.29289C0.653377 5.93241 1.22061 5.90468 1.6129 6.2097L1.70711 6.29289L4 8.585V1C4 0.447715 4.44772 0 5 0Z" fill="currentColor"/>
                </svg>
              </div>
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