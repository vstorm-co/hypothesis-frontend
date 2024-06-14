import { route } from "preact-router";
import { useDispatch } from "react-redux";
import { userActions } from "../../../store/user-slice";
import bin from '../../../assets/bin.svg';
import { hSliceActions } from "../../../store/h-slice";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";


export function ClearStorage(props) {
  const dispatch = useDispatch();
  const showModal = useSignal(false);
  const modal = useRef();

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          showModal.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  outsideClickHanlder(modal);

  function runClearStorage() {
    dispatch(userActions.setUser({}));
    localStorage.clear();
    dispatch(userActions.setUsers([]));
    dispatch(hSliceActions.setInfo({}))
    props.toggle();

    setTimeout(() => {
      route('/auth');
    }, 100)
  }

  return (
    <div>
      <div onClick={() => showModal.value = true} className={'flex px-3 py-2 border border-dashed rounded hover:bg-[#0F0F0F] border-[#595959] mt-3 cursor-pointer group'}>
        <div className={'flex items-center text-[#747474] group-hover:text-[#DBDBDB]'}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 1C16 0.447715 15.5523 0 15 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H15C15.5523 2 16 1.55228 16 1ZM14 4H2C1.36895 4 0.895661 4.57732 1.01942 5.19612L3.01942 15.1961C3.1129 15.6635 3.52332 16 4 16H12C12.4767 16 12.8871 15.6635 12.9806 15.1961L14.9806 5.19612C15.1043 4.57732 14.631 4 14 4ZM12.78 6L11.18 14H4.819L3.219 6H12.78Z" fill="currentColor" />
          </svg>
        </div>
        <div className={'ml-4 text-sm leading-6'}>Clear Local Storage</div>
      </div>
      <div ref={modal} className={'fixed z-20 top-1/4 left-1/2 transform -translate-1/2 w-[320px] bg-[#202020] border border-[#595959] text-sm leading-6 rounded ' + (showModal.value ? '' : 'hidden')}>
        <div className={'p-4 text-white text-center'}>
          Are you sure you want to clear Local Storage? It will Logout all of current accounts.
        </div>
        <div className={'flex gap-1 justify-center py-2 border-t border-[#595959]'}>
          <button onClick={() => { showModal.value = false }} type="button" className="btn-second light-gray">Cancel</button>
          <button onClick={() => runClearStorage()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center">Logout</button>
        </div>
      </div>
    </div>
  )
}