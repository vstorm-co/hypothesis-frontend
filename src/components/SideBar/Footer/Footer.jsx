// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useSelector, useDispatch } from 'react-redux';
import { AccountOptions } from './AccountOptions';

import { AddNewAccount } from './AddNewAccount';

import arrows from '../../../assets/arrows-up-down.svg'

const switchUserActive = signal(false);

function toggleSwitchUser() {
  switchUserActive.value = !switchUserActive.value;
}

export function Footer() {
  let currentUser = useSelector(state => state.user.currentUser);
  let users = useSelector(state => state.user.users);

  return (
    <div className={"border-t border-[#747474] px-2 py-4 mt-auto"}>
      <div className="flex flex-col px-2 py-1">
        <div class={'flex items-center'}>
          <img src={currentUser.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
          <div>
            <div className="text-sm leading-6">
              {currentUser.name}
            </div>
            <div className={'text-xs text-[#747474]'}>
              {currentUser.email}
            </div>
          </div>
          <div onClick={() => toggleSwitchUser()} className={'ml-auto cursor-pointer'}>
            <img src={arrows} alt="" />
          </div>
          <Options />
        </div>
        <div className={'flex flex-col transition-all duration-300 ' + (switchUserActive.value ? 'max-h-[200px]' : 'max-h-[0]  overflow-hidden')}>
          {users.map(user => {
            if (user.access_token != currentUser.access_token)
              return (
                <div class={'flex items-center mt-4 relative'}>
                  <img src={user.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
                  <div>
                    <div className="text-sm leading-6">
                      {user.name}
                    </div>
                    <div className={'text-xs text-[#747474]'}>
                      {user.email}
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