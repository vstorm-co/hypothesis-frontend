// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useRef, useEffect } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import AccountOptions from './AccountOptions';

import { AddNewAccount } from './AddNewAccount';

import arrows from '../../../assets/arrows-up-down.svg'

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

  const footerRef = useRef(null);
  outsideClickHanlder(footerRef);

  return (
    <div ref={footerRef} className={"border-t border-[#747474] px-2 py-4 mt-auto absolute bg-[#202020] w-80 duration-300 " + (switchUserActive.value ? 'bottom-0' : '-bottom-[15.2rem]')}>
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
        <div className={'flex mt-4 flex-col border-[#747474] border-t transition-all duration-300'}>
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
        </div>
      </div>
    </div>
  )
}