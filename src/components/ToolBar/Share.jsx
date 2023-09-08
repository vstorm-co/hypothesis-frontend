import {useDispatch, useSelector} from 'react-redux';
import { showToast } from '../../store/ui-slice';
import { useLocation } from 'preact-iso';

import share from '../../assets/share.svg';
import {updateChat} from "../../store/chats-slice.js";

export function Share() {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentChat = useSelector(state => state.chats.currentChat);

  function callShowToast() {
    navigator.clipboard.writeText(window.location.href);
    let sharedInfo = !currentChat.share ? 'shared' : 'unshared';
    dispatch(updateChat({ uuid: currentChat.uuid, share: !currentChat.share }));
    dispatch(showToast({ content: `Succesfully ${sharedInfo}` }))
  }

  return (
    <div className="relative">
      <div onClick={callShowToast} className={'p-1 border border-r-0 rounded-l border-[#DBDBDB] cursor-pointer'}>
        <div className="p-1 hover:bg-[#F2F2F2]">
          <img className="w-4" src={share} alt="edit" />
        </div>
      </div>
    </div>
  )
}