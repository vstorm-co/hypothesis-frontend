// @ts-nocheck
import { useSelector, useDispatch } from 'react-redux';
import { updateChat } from '../../store/chats-slice';
import { signal } from '@preact/signals';
import { useLocation } from 'preact-iso';
import { useRef, useEffect } from 'preact/hooks';

import { deleteChat } from '../../store/chats-slice';

import dots from '../../assets/dots.svg';
import bin from '../../assets/bin.svg';

const confirmDelete = signal(false);
const showEdit = signal(false);

function toggleEdit() {
  showEdit.value = !showEdit.value;
}

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        showEdit.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      console.log("A");
    }
  }, [ref])
}

export function Edit(props) {
  const chats = useSelector(state => state.chats.chats);
  const currentChat = useSelector(state => state.chats.currentChat)
  const dispatch = useDispatch();

  const editRef = useRef(null);
  outsideClickHanlder(editRef);

  const location = useLocation();

  function callDeleteChat() {
    dispatch(deleteChat({ chatId: currentChat.uuid }));
    location.route('/');
    toggleConfirmDelete();
    props.onToggle();
  }

  const editChatShare = (tgl) => {
    console.log(tgl);
    dispatch(updateChat({ uuid: currentChat.uuid, share: tgl }));
  }

  function editChatTitle(event) {
    if (event.target.value != '') {
      dispatch(updateChat({ uuid: currentChat.uuid, name: event.target.value }))
    }
  }

  return (
    <div ref={editRef} className="relative">
      <div onClick={toggleEdit} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (showEdit.value ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4 rotate-90" src={dots} alt="edit" />
        </div>
      </div>
      <div className={"absolute border rounded right-0 top-10 bg-white " + (showEdit.value ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input value={currentChat.name} onChangeCapture={(event) => { editChatTitle(event) }} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
          <div className={'text-[10px] mt-0.5 text-right text-[#747474]'}>
            press 'Enter' to confirm
          </div>
        </div>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Visibility
          </div>
          <div className={'text-sm leading-6 flex'}>
            <div onClick={() => { editChatShare(false) }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.share ? '' : 'bg-[#747474] text-white')}>Just Me</div>
            <div onClick={() => { editChatShare(true) }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.share ? 'bg-[#747474] text-white' : '')}> Organization</div>
          </div>
        </div>
        <div className={'p-1.5'}>
          <div onClick={() => { toggleConfirmDelete }} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
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
              <div onClick={() => { toggleConfirmDelete }} className={'px-2 py-1 cursor-pointer'}>Cancel</div>
              <div onClick={() => { callDeleteChat }} className={'bg-[#EF4444] px-2 py-1 rounded cursor-pointer'}>Delete</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}