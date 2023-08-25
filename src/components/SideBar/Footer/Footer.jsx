// @ts-nocheck
import { signal } from '@preact/signals';
import { useStore } from '../../../state/store';
import { Options } from './Options';
import { useGoogleLogin } from '@react-oauth/google';

import { Loading } from '../../Loading';

import dots from '../../../assets/dots.svg';

const showOptions = signal(false);

function toggleOptions() {
  showOptions.value = !showOptions.value
}

export function Footer() {
  const [state, dispatch] = useStore();

  const signIn = useGoogleLogin({
    onSuccess: response => console.log(response),
    onError: err => console.log(err),
  })

  function toggleLoading() {
    dispatch('TOGGLE_LOGIN_LOADING', !state.LoginLoading)
  }

  if (state.user) {
    return (
      <div className="border-t border-[#747474] px-2 py-4 mt-auto">
        <div className="flex items-center px-2 py-1">
          <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
          <div className="text-sm leading-6">
            {state.user.name}
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
      <div onClick={toggleLoading} className="border-t border-[#747474] px-2 py-4 mt-auto">
        <div className={"flex justify-center " + (state.LoginLoading ? 'hidden' : '')} >
          <div className="px-2 py-1 rounded hover:bg-[#595959] cursor-pointer">Google Login</div>
        </div>
        <div className={'flex py-1.5 justify-center ' + (state.LoginLoading ? '' : 'hidden')}>
          <Loading />
        </div>
      </div>

    )
  }
}