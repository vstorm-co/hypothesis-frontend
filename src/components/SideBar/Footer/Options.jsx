import darkmode from '../../../assets/darkmode.svg';
import logoutIcon from '../../../assets/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/compat';
import { useLocation } from 'preact-iso';

import { chatsActions } from '../../../store/chats-slice';
import { userActions } from '../../../store/user-slice';
import { uiActions } from '../../../store/ui-slice';

import dots from '../../../assets/dots.svg';

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
  const location = useLocation();

  const optionsRef = useRef(null);
  outsideClickHanlder(optionsRef);

  function toggleAdminBar() {
    dispatch(uiActions.toggleAdminBar({ tgl: !ui.adminBar.active }))
  }

  function callLogout() {
    toggleOptions();
    dispatch(userActions.logoutUser(currentUser));
    if (users.length > 1) {
      dispatch(userActions.setUser(users[0]));
    }
    dispatch(chatsActions.setChats([]));

    location.route('/auth')
  }

  return (
    <div ref={optionsRef} className="ml-2 relative">
      <div onClick={toggleOptions} className={"cursor-pointer p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
        <img src={dots} alt="options" />
      </div>
      <div className={"absolute border border-[#595959] rounded min-w-[160px] -top-[8.5rem] -left-[8rem] bg-[#0F0F0F] " + (showOptions.value ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          <div className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
            <img className="w-4" src={darkmode} alt="" /> <div className="ml-2">Toggle Theme</div>
          </div>
          <div onClick={toggleAdminBar} className={"cursor-pointer flex hover:bg-[#595959] p-2 border-y border-[#595959]"}>
            <img className="w-4" src={darkmode} alt="" /> <div className="ml-2">Admin Panel</div>
          </div>
          <div onClick={callLogout} className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
            <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
          </div>
        </div>
      </div>
    </div>
  )
}