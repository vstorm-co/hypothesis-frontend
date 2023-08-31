// @ts-nocheck
import { signal } from '@preact/signals';
import { Options } from './Options';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../../store/user-slice';


import { Loading } from '../../Loading';

import dots from '../../../assets/dots.svg';

const showOptions = signal(false);
const loading = signal(false);

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function toggleLoading() {
  loading.value = !loading.value
}

export function Footer() {
  const dispatch = useDispatch();
  let user = useSelector(state => state.user);

  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?code=${response.code}`).then(res => res.json()).catch(err => {
        toggleLoading();
      });
      dispatch(userActions.setUser(data));
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
  }

  if (user.access_token) {
    return (
      <div className="border-t border-[#747474] px-2 py-4 mt-auto">
        <div className="flex items-center px-2 py-1">
          <img src={user.picture} className="w-8 h-8 bg-white rounded-full mr-2"></img>
          <div className="text-sm leading-6">
            {user.name}
          </div>
          <div className="ml-auto relative">
            <div onClick={toggleOptions} className={"cursor-pointer p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
              <img src={dots} alt="options" />
            </div>
            <Options show={showOptions.value} />
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