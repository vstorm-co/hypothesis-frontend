import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../../store/ui-slice';

import share from '../../../assets/share.svg';
import { updateChat } from "../../../store/chats-slice.js";

export function Share() {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat);
  const user = useSelector(state => state.user.currentUser);

  function callShowToast() {
    navigator.clipboard.writeText(window.location.href);
    let sharedInfo = !currentChat.share ? 'shared' : 'unshared';

    if (user.user_id != currentChat.owner) {
      dispatch(showToast({ content: `Link copied to clipboard` }))
    } else {
      if (currentChat.share) {
        dispatch(showToast({ content: `Sharing chat by link disabled` }))
      } else {
        dispatch(showToast({ content: `Link copied to clipboard` }))
      }

      dispatch(updateChat({
        uuid: currentChat.uuid,
        organization_uuid: currentChat.organization_uuid,
        visibility: currentChat.visibility,
        share: !currentChat.share
      }));
    }

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