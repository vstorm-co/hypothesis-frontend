import { useDispatch, useSelector } from "react-redux"
import { cloneChat, createChat } from "../../../store/chats-slice";

export function CloneChatFromHere(props) {
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chats.currentChat)

  function callDuplicateChat() {
    const CopyUntil = currentChat.messages.find(msg => msg.uuid === props.msg.uuid);
    // localStorage.setItem("MsgToSend", CopyUntil.content);
    const deleteTo = currentChat.messages[currentChat.messages.indexOf(CopyUntil) + 1];
    if (deleteTo) {
      dispatch(cloneChat({ roomId: currentChat.uuid, messageId: deleteTo.uuid }));
    } else {
      dispatch(createChat(`Copy of ${currentChat.name}`));
    }
  }

  return (
    <div className={'relative mt-2'}>
      <div onClick={callDuplicateChat} title={'Duplicate Until Here'} className={"border border-[#DBDBDB] rounded rounded-l-none cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (this.props.showSaveAs ? 'bg-[#F2F2F2]' : '')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9933 4.88338C19.9355 4.38604 19.5128 4 19 4H11L10.8834 4.00673C10.386 4.06449 10 4.48716 10 5V15L10.0067 15.1166C10.0645 15.614 10.4872 16 11 16H19L19.1166 15.9933C19.614 15.9355 20 15.5128 20 15V5L19.9933 4.88338ZM9 9C9 8.44772 8.55228 8 8 8H5L4.88338 8.00673C4.38604 8.06449 4 8.48716 4 9V19L4.00673 19.1166C4.06449 19.614 4.48716 20 5 20H13L13.1166 19.9933C13.614 19.9355 14 19.5128 14 19L13.9933 18.8834C13.9355 18.386 13.5128 18 13 18H6V10H8L8.11662 9.99327C8.61396 9.93551 9 9.51284 9 9Z" fill="#747474" />
          </svg>
        </div>
      </div>
    </div>
  )
}