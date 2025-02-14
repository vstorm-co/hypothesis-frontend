import { useSelector } from 'react-redux';

import { Edit } from './Edit';
import { Share } from './Share';

export function ChatToolBar() {
  const user = useSelector(state => state.user.currentUser);
  const currentChat = useSelector(state => state.chats.currentChat);

  return (
    <div className="flex">
      <Share />
      <Edit />
    </div>
  )
}