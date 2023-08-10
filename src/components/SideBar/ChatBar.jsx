import chatIcon from '../../assets/chat.svg';
import { useStore } from '../../state/store';
import { useLocation } from 'preact-iso';

export const ChatBar = props => {
  const dispatch = useStore()[1];
  const location = useLocation();

  const selectChat = () => {
    location.route(`/${props.ChatData.id}`);
    // @ts-ignore
    dispatch('SELECT_CHAT', props.ChatData.id)
  }

  return (
    <div onClick={selectChat} className={"flex items-center py-3 px-2 rounded cursor-pointer " + (props.ChatData.selected ? 'bg-[#595959]' : '')}>
      <img className="w-4" src={chatIcon} alt="" />
      <div className="font-base text-sm leading-6 ml-2">
        {props.ChatData.title}
      </div>
    </div>
  )
}