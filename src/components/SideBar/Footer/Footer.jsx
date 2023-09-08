// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../../store/user-slice';
import { AccountOptions } from './AccountOptions';

import arrows from '../../../assets/arrows-up-down.svg'
import plus from '../../../assets/plus.svg';

import { Loading } from '../../Loading';

const loading = signal(false);
const switchUserActive = signal(false);


function toggleLoading() {
  loading.value = !loading.value
}

function toggleSwitchUser() {
  switchUserActive.value = !switchUserActive.value;
}

export function Footer() {
  const dispatch = useDispatch();
  let currentUser = useSelector(state => state.user.currentUser);
  let users = useSelector(state => state.user.users);

  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?code=${response.code}`).then(res => res.json()).catch(err => {
        toggleLoading();
      });

      dispatch(userActions.setUser(data));
      dispatch(userActions.setUsers(data));
      toggleLoading();
    },
    flow: 'auth-code',
    onError: err => {
      toggleLoading();
    },
    onNonOAuthError: () => {
      toggleLoading();
    }
  })

  function runLogin() {
    toggleLoading();
    signIn();
  };

  function runSelectAccount(user) {
    dispatch(userActions.setUser(user));
  }

  if (currentUser.access_token) {
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
            <div onClick={() => toggleSwitchUser()} className={'ml-auto'}>
              <img src={arrows} alt="" />
            </div>
            <Options currentUser={true} />
          </div>
          <div className={'flex flex-col transition-all duration-300 ' + (switchUserActive.value ? 'max-h-[200px]' : 'max-h-[0] overflow-hidden')}>
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
                    <AccountOptions user={user} />
                  </div>
                )
            })}
            <div onClick={runLogin} className={'flex px-3 py-2 border border-dashed rounded border-[#595959] mt-3 cursor-pointer'}>
              <img src={plus} alt="" />
              <div className={'ml-4 text-sm leading-6'}>Add New Account</div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="border-t border-[#747474] px-2 py-4 mt-auto">
        <div className={"flex justify-center " + (loading.value ? 'hidden' : '')} >
          <div onClick={runLogin} className="px-2 py-1 rounded hover:bg-[#595959] cursor-pointer">Google Login</div>
        </div>
        <div className={'flex py-1.5 justify-center ' + (loading.value ? '' : 'hidden')}>
          <Loading />
        </div>
      </div>

    )
  }
}