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
      <div className={"absolute border border-[#595959] rounded w-[240px] bottom-0 left-12 bg-[#0F0F0F] " + (showOptions.value ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          <div className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
            <div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C13.6569 0 15 1.34315 15 3C15 4.65685 13.6569 6 12 6C10.3431 6 9 4.65685 9 3C9 1.34315 10.3431 0 12 0ZM4 4C5.65685 4 7 5.34315 7 7C7 8.65685 5.65685 10 4 10C2.34315 10 1 8.65685 1 7C1 5.34315 2.34315 4 4 4ZM16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 11.5523 8.44771 12 9 12C9.55229 12 10 11.5523 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11L14.0067 11.1166C14.0645 11.614 14.4872 12 15 12C15.5523 12 16 11.5523 16 11ZM8 15C8 12.7909 6.20914 11 4 11C1.79086 11 0 12.7909 0 15C0 15.5523 0.447715 16 1 16C1.55228 16 2 15.5523 2 15C2 13.8954 2.89543 13 4 13C5.10457 13 6 13.8954 6 15L6.00673 15.1166C6.06449 15.614 6.48716 16 7 16C7.55228 16 8 15.5523 8 15ZM3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7ZM11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3Z" fill="#747474" />
              </svg>
            </div>

            <div className="ml-2">Organization settings</div>
          </div>
          <div onClick={callLogout} className={"cursor-pointer flex py-3 px-4 hover:bg-[#595959]"}>
            <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
          </div>
        </div>
      </div>
    </div>
  )
}