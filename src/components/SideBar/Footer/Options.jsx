import darkmode from '../../../assets/darkmode.svg';
import logoutIcon from '../../../assets/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/compat';
import { route } from 'preact-router';

import { chatsActions } from '../../../store/chats-slice';
import { userActions } from '../../../store/user-slice';
import { uiActions } from '../../../store/ui-slice';

import settings from '../../../assets/settings.svg';

const showOptions = signal(false);

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        showOptions.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}


export function Options(props) {
  const dispatch = useDispatch();
  const ui = useSelector(state => state.ui);
  const currentUser = useSelector(state => state.user.currentUser);
  const users = useSelector(state => state.user.users);

  const optionsRef = useRef(null);
  outsideClickHanlder(optionsRef);

  function callLogout() {
    toggleOptions();
    dispatch(userActions.logoutUser(currentUser));
    if (users.length > 1) {
      dispatch(userActions.setUser(users[0]));
      route('/');
    } else {
      route('/auth');
    }
    dispatch(chatsActions.setChats([]));

  }

  return (
    <div ref={optionsRef} className="ml-2 relative">
      <div onClick={(e) => { toggleOptions(); e.stopPropagation(); }} className={"cursor-pointer transform rotate-90 p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
        <svg width="16" height="16" viewBox="0 0 16 16" className={props.colorClass} xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10C15.1046 10 16 9.10457 16 8Z" />
        </svg>
      </div>
      <div className={"absolute border border-[#595959] rounded min-w-[160px] -top-[8.5rem] -left-[8rem] bg-[#0F0F0F] " + (showOptions.value ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          <div className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
            <img className="w-4" src={darkmode} alt="" /> <div className="ml-2">Toggle Theme</div>
          </div>
          <div onClick={callLogout} className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
            <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
          </div>
        </div>
      </div>
    </div>
  )
}