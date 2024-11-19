import { cloneChat, getChatsData, updateChat } from '../../../store/chats-slice';
import { deleteChat } from '../../../store/chats-slice';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useEffect } from 'preact/hooks';
import { createTemplate } from '../../../store/templates-slice';
import { signal, useSignal } from '@preact/signals';
import { route } from 'preact-router';


import dots from '../../../assets/dots.svg';
import bin from '../../../assets/bin.svg';
import braces from '../../../assets/braces.svg'
import duplicate from '../../../assets/duplicate.svg';
import { showToast } from '../../../store/ui-slice';

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
        confirmDelete.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}

export function Edit(props) {
  const currentChat = useSelector(state => state.chats.currentChat)
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  const editRef = useRef(null);
  outsideClickHanlder(editRef);

  const shareEnabled = useSignal(false);

  useEffect(() => {
    shareEnabled.value = currentChat.share
  }, [currentChat])

  async function callDeleteChat() {
    await dispatch(deleteChat({ chatId: currentChat.uuid }));
    toggleConfirmDelete();
    toggleEdit();
    route('/');
  }

  const editChatShare = (tgl) => {
    updateChatShare(tgl);
  }

  const updateChatShare = async (tgl) => {
    await dispatch(updateChat({
      uuid: currentChat.uuid,
      visibility: tgl,
      organization_uuid: tgl === "organization" ? user.organization_uuid.toString() : null,
      share: currentChat.share,
    }));


    let message = `Chat set to ${tgl === "organization" ? "organization" : "private"}`
    dispatch(showToast({ content: message }));
  }

  function toggleSaveChatAsTemplate() {
    let array = currentChat.messages.filter(m => m.created_by === "user");
    let targetContent = '';

    array.forEach((m, i) => {
      targetContent += `${m.content}`
      if (i < array.length - 1) {
        targetContent += '<br><div contenteditable="false" class="return-box px-1.5 rounded"></div>'
      }
    });

    dispatch(createTemplate({ name: currentChat.name, content: targetContent, content_html: targetContent }))
  }

  function toggleDuplicateChat() {
    dispatch(cloneChat({ roomId: currentChat.uuid }));
    toggleEdit();
  }

  function editChatTitle(event) {
    if (event.target.value != '') {
      dispatch(updateChat({ uuid: currentChat.uuid, name: event.target.value, share: currentChat.share, organization_uuid: currentChat.organization_uuid, visibility: currentChat.visibility }))
    }
  }

  function disableShareByLink() {
    dispatch(showToast({ content: `Sharing by link ${currentChat.share ? 'disabled' : 'enabled'}` }));

    shareEnabled.value = !shareEnabled.value

    dispatch(updateChat({
      uuid: currentChat.uuid,
      organization_uuid: currentChat.organization_uuid,
      visibility: currentChat.visibility,
      share: !currentChat.share
    }));

  }

  return (
    <div ref={editRef} className="relative">
      <div onClick={toggleEdit} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (showEdit.value ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4 rotate-90" src={dots} alt="edit" />
        </div>
      </div>
      <div className={"absolute border z-50 rounded right-0 w-[240px] top-10 bg-white " + (showEdit.value ? '' : 'hidden')}>
        <div className={"border-b p-2 " + (user.user_id === currentChat.owner ? '' : 'pointer-events-none')}>
          <div className="text-xs font-bold text-[#747474] mb-1">
            Visibility
          </div>

          <div className={'text-sm leading-6 flex ' + (user.user_id === currentChat.owner ? '' : 'opacity-50')}>
            {/*<div onClick={() => { editChatShare("just_me") }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.visibility === "organization" ? '' : 'bg-[#747474] text-white')}>Just Me</div>*/}
            <div onClick={() => { editChatShare("just_me") }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.visibility === "organization" ? '' : 'bg-[#747474] text-white')}>Just Me</div>
            {/*<div onClick={() => { editChatShare("organization") }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.visibility === "organization" ? 'bg-[#747474] text-white' : '')}> Organization</div>*/}
            <div onClick={() => { editChatShare("organization") }} className={'cursor-pointer px-2 py-1 rounded ' + (currentChat.visibility === "organization" ? 'bg-[#747474] text-white' : '')}> Organization</div>
          </div>

          <div className={'mt-1.5 flex items-center ' + (user.user_id === currentChat.owner ? '' : 'pointer-events-none opacity-50')}>
            <label class="switch">
              <input onChange={disableShareByLink} checked={shareEnabled.value} type="checkbox" />
              <span class="slider round"></span>
            </label>
            <div className="text-sm leading-6 ml-2">Anyone with the link</div>
          </div>
        </div>
        {/* {user.user_id === currentChat.owner &&
        } */}
        <div className={'py-2 px-3 w-[240px] text-xs'}>
          <div className={''}><span className={'text-[#747474]'}>Model:</span> {currentChat?.model_name}</div>
          <div className={'mt-2'}>
            <span className={'text-[#747474]'}>Tokens:</span>
            <ul className={'list-disc tokens mt-0.5 pl-5'}>
              <li>{currentChat?.prompt_tokens_count} prompt tokens (${currentChat.prompt_value?.toFixed(3)})</li>
              <li>{currentChat?.completion_tokens_count} completion tokens (${currentChat.completion_value?.toFixed(3)})</li>
              <li>{currentChat?.total_tokens_count} total tokens (${currentChat.total_value?.toFixed(3)})</li>
            </ul>
          </div>
          {currentChat.elapsed_time > 0 &&
            <div className={'mt-2'}><span className={'text-[#747474]'}>API Time:</span> {currentChat.elapsed_time.toFixed(2)} seconds</div>
          }
        </div>
        <div className={'p-1.5 border-y'}>
          <div onClick={toggleSaveChatAsTemplate} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
            <img src={braces} alt="" />
            <div className={'ml-2'}>
              Save as Template
            </div>
          </div>
        </div>
        <div className={'p-1.5 border-b'}>
          <div onClick={toggleDuplicateChat} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
            <img src={duplicate} alt="" />
            <div className={'ml-2'}>
              Duplicate Chat
            </div>
          </div>
        </div>
        <div className={user.user_id === currentChat.owner ? 'p-1.5' : ''}>
          {user.user_id === currentChat.owner &&
            <div onClick={toggleConfirmDelete} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
              <img src={bin} alt="" />
              <div className={'ml-2'}>
                Delete chat
              </div>
            </div>
          }
          <div className={'fixed rounded left-1/2 top-10 flex flex-col bg-[#020202] text-white w-[350px] ' + (confirmDelete.value ? '' : 'hidden')}>
            <div className='px-4 py-2'>
              Are you sure you want to delete this chat?
            </div>
            <div className='flex justify-center items-center gap-4 border-t border-[#747474] py-2'>
              <div onClick={toggleConfirmDelete} className={'px-2 py-1 cursor-pointer hover:bg-[#747474] rounded'}>Cancel</div>
              <div onClick={callDeleteChat} className={'bg-[#EF4444] px-2 py-1 rounded cursor-pointer'}>Delete</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}