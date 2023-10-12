// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useRef, useEffect } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import AccountOptions from './AccountOptions';
import bin from '../../../assets/bin.svg';

import { AddNewAccount } from './AddNewAccount';

import arrows from '../../../assets/arrows-up-down.svg'
import { userActions } from '../../../store/user-slice';
import { route } from 'preact-router';

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
  let currentOrganization = useSelector(state => state.organizations.currentOrganization);
  const dispatch = useDispatch()

  const footerRef = useRef(null);
  outsideClickHanlder(footerRef);

  function clearStorage() {
    dispatch(userActions.setUser({}));
    localStorage.clear();
    dispatch(userActions.setUsers([]));
    switchUserActive.value = false;

    setTimeout(() => {
      route('/auth');
    }, 100)
  }

  return (
    <div ref={footerRef} className={"border-t border-[#747474] px-2 py-4 mt-auto absolute z-20 bg-[#202020] w-80 duration-300 bottom-0 "}>
      <div className="flex flex-col px-2 py-1">
        <div class={'flex items-center'}>
          <img src={currentUser.organization_uuid ? currentUser.organization_logo : currentUser.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
          <div>
            <div className="text-sm leading-6">
              {currentUser.name}
            </div>
            <div className={'text-xs text-[#747474]'}>
              {currentUser.organization_uuid ? currentUser.organization_name : currentUser.email}
            </div>
          </div>
          <div onClick={() => toggleSwitchUser()} className={'ml-auto cursor-pointer'}>
            <img src={arrows} alt="" />
          </div>
          <Options />
        </div>
        <div className={'flex mt-4 flex-col border-[#747474] border-t transition-all duration-300 ' + (switchUserActive.value ? 'max-h-[260px]' : 'max-h-0 overflow-hidden')}>
          {users.map(user => {
            if (user.access_token !== currentUser.access_token || (user.access_token === currentUser.access_token && user.organization_uuid !== currentUser.organization_uuid))
              return (
                <div class={'flex items-center mt-4 relative'}>
                  <img src={user.organization_uuid ? user.organization_logo : user.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
                  <div>
                    <div className="text-sm leading-6">
                      {user.name}
                    </div>
                    <div className={'text-xs text-[#747474]'}>
                      {user.organization_uuid ? user.organization_name : user.email}
                    </div>
                  </div>
                  <AccountOptions tglSwitch={toggleSwitchUser} user={user} />
                </div>
              )
          })}
          <AddNewAccount />
          <div onClick={clearStorage} className={'flex px-3 py-2 border border-dashed rounded border-[#595959] mt-3 cursor-pointer'}>
            <img src={bin} alt="" />
            <div className={'ml-4 text-sm leading-6'}>Clear Local Storage</div>
          </div>
        </div>
      </div>
    </div>
  )
}