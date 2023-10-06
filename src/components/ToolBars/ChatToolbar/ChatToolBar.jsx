import { useSelector } from 'react-redux';

import { Edit } from './Edit';
import { Share } from './Share';

export function ChatToolBar() {
  const user = useSelector(state => state.user.currentUser);
  const currentChat = useSelector(state => state.chats.currentChat);

  if (user.user_id === currentChat.owner) {
    return (
      <div className="flex">
        <Share />
        <Edit />
      </div>
    )
  }
  else {
    return (
      <div></div>
    )
  }
}