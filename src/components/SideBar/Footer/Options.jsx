import logoutIcon from '../../../assets/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/compat';
import { Link, route } from 'preact-router';

import { chatsActions } from '../../../store/chats-slice';
import { userActions } from '../../../store/user-slice';
import { fetchModels, uiActions } from '../../../store/ui-slice';
import { getUserOrganizationsData } from "../../../store/user-slice";

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

  async function callLogout() {
    toggleOptions();
    dispatch(uiActions.toggleChatsLoading(false));

    await dispatch(userActions.logoutUser(currentUser));
    await dispatch(chatsActions.setChats([]));
    dispatch(uiActions.toggleChatsLoading(true));
    if (users.length > 1) {
      dispatch(userActions.setUser(users[0]));
      dispatch(getUserOrganizationsData());
      route('/');
    } else {
      route('/auth');
    }
  }

  function handleOrganization() {
    showOptions.value = false
  }

  return (
    <div ref={optionsRef} className="ml-2 relative">
      {props.colorClass === 'text-white' &&
        <div onClick={(e) => { toggleOptions(); e.stopPropagation(); }} className={"cursor-pointer transform rotate-90 p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
          <svg width="16" height="16" viewBox="0 0 16 16" className={props.colorClass} xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10C15.1046 10 16 9.10457 16 8Z" />
          </svg>
        </div>

      }
      {props.colorClass != 'text-white' &&
        <div className={"cursor-pointer transform rotate-90 p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={'transform rotate-90'}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70711 2.29289C8.31658 1.90237 7.68342 1.90237 7.29289 2.29289L4.29289 5.29289C3.90237 5.68342 3.90237 6.31658 4.29289 6.70711C4.68342 7.09763 5.31658 7.09763 5.70711 6.70711L8 4.41421L10.2929 6.70711C10.6834 7.09763 11.3166 7.09763 11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289L8.70711 2.29289ZM7.266 13.7903C7.6418 14.195 8.27453 14.2184 8.67924 13.8426L11.7891 10.955C12.1938 10.5792 12.2172 9.94643 11.8414 9.54171C11.4656 9.137 10.8329 9.11356 10.4282 9.48936L8.05114 11.6966L5.84391 9.31955C5.46811 8.91483 4.83538 8.89139 4.43066 9.26719C4.02595 9.64299 4.00251 10.2757 4.37831 10.6804L7.266 13.7903Z" fill="#747474" />
          </svg>
        </div>
      }
      <div className={"absolute border border-[#595959] rounded w-[240px] bottom-0 -left-60 md:left-12 bg-[#0F0F0F] " + (showOptions.value ? '' : 'hidden')}>
        <div className="text-sm leading-6">
          {currentUser.organization_uuid &&
            <Link onClick={() => handleOrganization()} href="/organization-settings" className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C13.6569 0 15 1.34315 15 3C15 4.65685 13.6569 6 12 6C10.3431 6 9 4.65685 9 3C9 1.34315 10.3431 0 12 0ZM4 4C5.65685 4 7 5.34315 7 7C7 8.65685 5.65685 10 4 10C2.34315 10 1 8.65685 1 7C1 5.34315 2.34315 4 4 4ZM16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 11.5523 8.44771 12 9 12C9.55229 12 10 11.5523 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11L14.0067 11.1166C14.0645 11.614 14.4872 12 15 12C15.5523 12 16 11.5523 16 11ZM8 15C8 12.7909 6.20914 11 4 11C1.79086 11 0 12.7909 0 15C0 15.5523 0.447715 16 1 16C1.55228 16 2 15.5523 2 15C2 13.8954 2.89543 13 4 13C5.10457 13 6 13.8954 6 15L6.00673 15.1166C6.06449 15.614 6.48716 16 7 16C7.55228 16 8 15.5523 8 15ZM3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7ZM11 3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3Z" fill="#747474" />
                </svg>
              </span>

              <div className="ml-2">Organization settings</div>
            </Link>
          }
          {!currentUser.organization_uuid &&
            <Link onClick={() => handleOrganization()} href="/personal-settings" className={"cursor-pointer border-b border-[#595959] flex items-center w-full py-3 px-4 hover:bg-[#595959]"}>
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 0C4.3118 0 5.42695 0.841956 5.83453 2.01495L5.88338 2.00673L6 2H15C15.5523 2 16 2.44772 16 3C16 3.51284 15.614 3.93551 15.1166 3.99327L15 4H6C5.94344 4 5.88799 3.99531 5.83399 3.98628C5.42695 5.15804 4.3118 6 3 6C1.34315 6 0 4.65685 0 3C0 1.34315 1.34315 0 3 0ZM16 13C16 11.3431 14.6569 10 13 10C11.6882 10 10.5731 10.842 10.166 12.0137C10.112 12.0047 10.0566 12 10 12H1L0.883379 12.0067C0.38604 12.0645 0 12.4872 0 13C0 13.5523 0.447715 14 1 14H10L10.1166 13.9933L10.1655 13.985C10.5731 15.158 11.6882 16 13 16C14.6569 16 16 14.6569 16 13ZM12 13C12 12.4477 12.4477 12 13 12C13.5523 12 14 12.4477 14 13C14 13.5523 13.5523 14 13 14C12.4477 14 12 13.5523 12 13ZM2 3C2 2.44772 2.44772 2 3 2C3.55228 2 4 2.44772 4 3C4 3.55228 3.55228 4 3 4C2.44772 4 2 3.55228 2 3Z" fill="#747474" />
                </svg>

              </span>

              <div className="ml-2">Personal settings</div>
            </Link>
          }
          <div onClick={callLogout} className={"cursor-pointer flex py-3 px-4 hover:bg-[#595959]"}>
            <img className="w-4" src={logoutIcon} alt="" /> <div className="ml-2">Logout</div>
          </div>
        </div>
      </div>
    </div>
  )
}