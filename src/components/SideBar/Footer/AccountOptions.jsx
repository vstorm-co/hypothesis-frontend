import logoutIcon from '../../../assets/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/compat';
import { useLocation } from 'preact-iso';

import { userActions } from '../../../store/user-slice';
import { chatsActions } from '../../../store/chats-slice';

import dots from '../../../assets/dots.svg';
import check from '../../../assets/check.svg';

const showAccountOptions = signal(false);

function toggleAccountOptions() {
  showAccountOptions.value = !showAccountOptions.value
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        showAccountOptions.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}

export function AccountOptions(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const AccountOptionsRef = useRef(null);
  outsideClickHanlder(AccountOptionsRef);

  function callLogout() {
    dispatch(userActions.logoutUser(props.user));
  }

  function runSelectAccount() {
    toggleAccountOptions();
    props.tglSwitch();
    dispatch(userActions.setUser(props.user));
    dispatch(chatsActions.setCurrentChat({}))
    location.route('/');
  }

  return (
    <div ref={AccountOptionsRef} className="ml-auto relative">
      <div onClick={toggleAccountOptions} className={"cursor-pointer p-1 hover:bg-[#595959] relative rounded " + (showAccountOptions.value ? "bg-[#595959]" : '')}>
        <img src={dots} alt="options" />
      </div>
      <div className={"absolute border border-[#595959] rounded min-w-[160px] -top-[5.5rem] -left-[8rem] bg-[#0F0F0F] " + (showAccountOptions.value ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          <div onClick={runSelectAccount} className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
            <img className="w-4" src={check} alt="" /> <div className="ml-2">Select Account</div>
          </div>
          {!!!props.user.organization_uuid &&
            <div onClick={callLogout} className={"cursor-pointer border-t border-[#595959] flex p-2 hover:bg-[#595959]"}>
              <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}