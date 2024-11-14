// @ts-nocheck
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";
import { showToast, uiActions } from "../../store/ui-slice";
import { cloneChat } from "../../store/chats-slice";
import { deleteChat } from "../../store/chats-slice";
import { route } from "preact-router";


export function ChatOptions(props) {
  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          dispatch(uiActions.setChatsOptions({ show: false }))
          confirmDelete.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  const optionsRef = useRef(null);
  outsideClickHanlder(optionsRef);

  const chatOptions = useSelector(state => state.ui.chatOptions);

  const dispatch = useDispatch();

  const confirmDelete = useSignal(false);

  function callCopyLink(e) {
    navigator.clipboard.writeText(`${window.location.origin}/chats/${chatOptions.data.uuid}`);
    dispatch(showToast({ content: `Link copied to clipboard` }));
    props.toggleOptions(false);
  }

  function toggleDuplicateChat() {
    dispatch(cloneChat({ roomId: chatOptions.data.uuid }));
    props.toggleOptions();
  }

  function toggleConfirmDelete() {
    confirmDelete.value = !confirmDelete.value;
  }

  async function callDeleteChat() {
    await dispatch(deleteChat({ chatId: chatOptions.data.uuid }));
    confirmDelete.value = false;
    dispatch(uiActions.setChatsOptions({ show: false }))
    route('/');
  }

  return (
    <div ref={optionsRef} className="ml-2 relative">
      <div style={chatOptions.position} className={"fixed z-50 border border-[#595959] rounded w-[240px] left-10 md:left-[328px] bg-[#0F0F0F] " + (chatOptions.show ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          <div onClick={e => { callCopyLink(); e.stopPropagation(); }} className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
            <div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0039 6.10772C16.4156 4.64172 16.2939 2.37329 14.8524 1.03543C13.402 -0.310791 10.9712 -0.380158 9.44598 1.03543L9.35674 1.12976L8.29937 2.40386L8.22526 2.50536C7.95785 2.9242 8.03796 3.48643 8.43026 3.812L8.53177 3.88611C8.95061 4.15352 9.51283 4.07341 9.83841 3.68111L10.843 2.47001L10.9342 2.39367C11.6823 1.8212 12.83 1.88703 13.4919 2.50134C14.152 3.11402 14.1862 4.14612 13.4919 4.79053L13.413 4.87261L10.335 8.46491C9.52999 9.18757 8.47902 9.17825 7.68032 8.43695C7.27551 8.06125 6.64279 8.08483 6.26708 8.48963C5.89138 8.89443 5.91496 9.52716 6.31976 9.90287C7.8959 11.3657 10.1501 11.3657 11.7262 9.90287L11.7858 9.84276L14.904 6.20501L15.0039 6.10772ZM9.733 7.51038C10.1087 7.10558 10.0851 6.47285 9.68032 6.09715C8.10418 4.63429 5.85 4.63429 4.27387 6.09715L4.19496 6.17923L1.09504 9.79401L0.996133 9.89229C-0.415541 11.3583 -0.293821 13.6267 1.14765 14.9646C2.59812 16.3108 5.02889 16.3802 6.5541 14.9646L6.64334 14.8703L7.70071 13.5962L7.77482 13.4947C8.04223 13.0758 7.96212 12.5136 7.56982 12.188L7.46831 12.1139C7.04947 11.8465 6.48724 11.9266 6.16167 12.3189L5.15604 13.529L5.06585 13.6063C4.31773 14.1788 3.17009 14.113 2.5082 13.4987C1.84808 12.886 1.81388 11.8539 2.5082 11.2095L2.58711 11.1274L5.66504 7.5351C6.47009 6.81244 7.52106 6.82176 8.31976 7.56306C8.72456 7.93877 9.35729 7.91518 9.733 7.51038Z" fill="#747474" />
              </svg>
            </div>
            <div className="ml-2">Copy Link</div>
          </div>
          <div onClick={e => { toggleDuplicateChat(); e.stopPropagation(); }} className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
            <div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15 0C15.5128 0 15.9355 0.38604 15.9933 0.883379L16 1V11C16 11.5128 15.614 11.9355 15.1166 11.9933L15 12H7C6.48716 12 6.06449 11.614 6.00673 11.1166L6 11V1C6 0.487164 6.38604 0.0644928 6.88338 0.00672773L7 0H15ZM4 4C4.55228 4 5 4.44772 5 5C5 5.51284 4.61396 5.93551 4.11662 5.99327L4 6H2V14H9C9.51284 14 9.93551 14.386 9.99327 14.8834L10 15C10 15.5128 9.61396 15.9355 9.11662 15.9933L9 16H1C0.487164 16 0.0644928 15.614 0.00672773 15.1166L0 15V5C0 4.48716 0.38604 4.06449 0.883379 4.00673L1 4H4ZM8 2H14V10H8V2Z" fill="#747474" />
              </svg>
            </div>
            <div className="ml-2">Duplicate Chat</div>
          </div>
          <div onClick={e => { toggleConfirmDelete(); e.stopPropagation(); }} className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
            <div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 1C16 0.447715 15.5523 0 15 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H15C15.5523 2 16 1.55228 16 1ZM14 4H2C1.36895 4 0.895661 4.57732 1.01942 5.19612L3.01942 15.1961C3.1129 15.6635 3.52332 16 4 16H12C12.4767 16 12.8871 15.6635 12.9806 15.1961L14.9806 5.19612C15.1043 4.57732 14.631 4 14 4ZM12.78 6L11.18 14H4.819L3.219 6H12.78Z" fill="#747474" />
              </svg>
            </div>
            <div className="ml-2">Delete Chat</div>
            <div className={'fixed rounded left-1/2 top-10 flex flex-col bg-[#020202] text-white w-[350px] ' + (confirmDelete.value ? '' : 'hidden')}>
              <div className='px-4 py-2'>
                Are you sure you want to delete this chat?
              </div>
              <div className='flex justify-center items-center gap-4 border-t border-[#747474] py-2'>
                <div onClick={e => { confirmDelete.value = false; e.stopPropagation(); }} className={'px-2 py-1 cursor-pointer hover:bg-[#747474] rounded'}>Cancel</div>
                <div onClick={callDeleteChat} className={'bg-[#EF4444] px-2 py-1 rounded cursor-pointer'}>Delete</div>
              </div>
            </div>
          </div>
          <div className={'p-4 text-white w-[240px] top-10 z-50 left-0 rounded text-xs'}>
            <div className={''}><span className={'text-[#747474]'}>Model:</span> {chatOptions.data?.model_name}</div>
            <div className={'mt-2'}>
              <span className={'text-[#747474]'}>Tokens:</span>
              <ul className={'list-disc tokens mt-0.5 pl-6 font-light'}>
                <li>{chatOptions.data?.prompt_tokens_count} prompt tokens (${chatOptions.data?.prompt_value?.toFixed(3)})</li>
                <li>{chatOptions.data?.completion_tokens_count} completion tokens (${chatOptions.data?.completion_value?.toFixed(3)})</li>
                <li>{chatOptions.data?.total_tokens_count} total tokens (${chatOptions.data?.total_value?.toFixed(3)})</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}