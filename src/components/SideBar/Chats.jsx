import { ChatBar } from './ChatBar';
import { useStore } from '../../state/store';


export function Chats() {
  const state = useStore()[0];
  return (
    <div className="mt-4">
      <div className="text-xs font-bold mb-2">
        Chats
      </div>
      {state.chats.map(chat => (
        <ChatBar ChatData={chat} />
      ))}
    </div>
  )
}