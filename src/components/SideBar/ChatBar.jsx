import chatIcon from '../../assets/chat.svg';
import { useLocation } from 'preact-iso';

export const ChatBar = props => {
  const location = useLocation();

  const selectChat = () => {
    location.route(`/${props.ChatData.uuid}`);
    // @ts-ignore
  }

  return (
    <div onClick={selectChat} className={"flex items-center py-3 px-2 rounded cursor-pointer hover:bg-[#595959] " + (props.ChatData.selected ? 'bg-[#595959]' : '')}>
      <img className="w-4" src={chatIcon} alt="" />
      <div className="font-base text-sm leading-6 ml-2">
        {props.ChatData.name}
      </div>
    </div>
  )
}