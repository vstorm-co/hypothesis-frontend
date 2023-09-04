import { useSelector, useDispatch } from 'react-redux';
import { updateChat } from '../../store/chats-slice';
import { signal } from '@preact/signals';
import { useLocation } from 'preact-iso';

import { deleteChat } from '../../store/chats-slice';

import dots from '../../assets/dots.svg';
import bin from '../../assets/bin.svg';

const confirmDelete = signal(false);

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}

export function Edit(props) {
  const chats = useSelector(state => state.chats.chats);
  const dispatch = useDispatch();

  const location = useLocation();

  function selectedChat() {
    if (chats.find(c => c.selected)) {
      return chats.find(c => c.selected)
    } else {
      return { name: '' }
    };
  }

  function callDeleteChat() {
    dispatch(deleteChat({ chatId: selectedChat().uuid }));
    location.route('/');
    toggleConfirmDelete();
    props.onToggle();
  }

  function editChatTitle(event) {
    // @ts-ignore
    dispatch(updateChat({ chatId: selectedChat().uuid, name: event.target.value }))
  }

  return (
    <div className="relative">
      <div onClick={props.onToggle} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (props.show ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4 rotate-90" src={dots} alt="edit" />
        </div>
      </div>
      <div className={"absolute border rounded right-0 top-10 bg-white " + (props.show ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input value={selectedChat().name} onChange={(event) => { editChatTitle(event) }} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
        </div>
        <div className={'p-1.5'}>
          <div onClick={toggleConfirmDelete} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
            <img src={bin} alt="" />
            <div className={'ml-2'}>
              Delete chat
            </div>
          </div>
          <div className={'absolute right-0 rounded -bottom-[5.8rem] flex flex-col bg-[#020202] text-white w-[350px] ' + (confirmDelete.value ? '' : 'hidden')}>
            <div className='px-4 py-2'>
              Are you sure you want to delete this chat?
            </div>
            <div className='flex justify-center items-center gap-4 border-t border-[#747474] py-2'>
              <div onClick={toggleConfirmDelete} className={'px-2 py-1 cursor-pointer'}>Cancel</div>
              <div onClick={callDeleteChat} className={'bg-[#EF4444] px-2 py-1 rounded cursor-pointer'}>Delete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}