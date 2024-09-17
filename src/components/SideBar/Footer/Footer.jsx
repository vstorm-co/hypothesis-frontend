// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useRef, useEffect } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import AccountOptions from './AccountOptions';
import { route } from 'preact-router';

import { userActions, getUserOrganizationsData } from '../../../store/user-slice';
import { chatsActions, getChatsData } from '../../../store/chats-slice';
import { fetchModels } from '../../../store/ui-slice';
import { AddNewAccount } from './AddNewAccount';
import { ClearStorage } from './ClearStorage';
import { Detonate } from './Detonate';
import { getTemplatesData } from '../../../store/templates-slice';

const switchUserActive = signal(false);

function toggleSwitchUser() {
  switchUserActive.value = !switchUserActive.value;
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        switchUserActive.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}


export function Footer() {
  let currentUser = useSelector(state => state.user.currentUser);
  let users = useSelector(state => state.user.users);

  const dispatch = useDispatch();

  const footerRef = useRef(null);
  outsideClickHanlder(footerRef);

  function setUser(user) {
    dispatch(userActions.setUser(user));
    dispatch(chatsActions.setCurrentChat({}))
    dispatch(getUserOrganizationsData());
    dispatch(fetchModels());

    dispatch(getChatsData());
    dispatch(getTemplatesData());
    route('/');
    switchUserActive.value = false;
  }

  return (
    <div ref={footerRef} className={"border-t border-[#747474] px-2 py-3 mt-auto absolute z-20 bg-[#202020] w-80 duration-300 bottom-0 "}>
      <div className="flex flex-col">
        <div onClick={() => toggleSwitchUser()} class={'flex items-center cursor-pointer px-2 py-1 rounded ' + (switchUserActive.value ? 'bg-[#595959]' : '')}>
          <img src={currentUser.organization_uuid && currentUser.organization_logo ? `${import.meta.env.VITE_API_URL}${currentUser.organization_logo}` : currentUser.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
          <div>
            <div className="text-sm leading-6">
              {currentUser.name}
            </div>
            <div className={'text-xs ' + (switchUserActive.value ? 'text-[#DBDBDB]' : 'text-[#747474]')}>
              {currentUser.organization_uuid ? currentUser.organization_name : currentUser.email}
            </div>
          </div>
          <div className={'ml-auto'}>
            <Options colorClass={switchUserActive.value ? 'text-white' : 'text-[#747474]'} />
          </div>
        </div>
        <div className={'flex flex-col transition-all duration-300 ' + (switchUserActive.value ? 'max-h-[260px]' : 'max-h-0 overflow-hidden')}>
          {users.map(user => {
            if (user.user_id != currentUser.user_id)
              return (
                <div onClick={() => setUser(user)} class={'flex items-center px-2 py-1 rounded mt-4 relative cursor-pointer'}>
                  <img src={user.organization_uuid ? `${import.meta.env.VITE_API_URL}${user.organization_logo}` : user.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
                  <div>
                    <div className="text-sm leading-6">
                      {user.name}
                    </div>
                    <div className={'text-xs text-[#747474]'}>
                      {user.organization_uuid ? user.organization_name : user.email}
                    </div>
                  </div>
                  <AccountOptions colorClass={'text-[#747474]'} tglSwitch={toggleSwitchUser} user={user} />
                </div>
              )
          })}
          <AddNewAccount />
          <ClearStorage toggle={toggleSwitchUser} />
          {/* <Detonate /> */}
        </div>
      </div>
    </div>
  )
}