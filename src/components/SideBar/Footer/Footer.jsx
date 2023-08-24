// @ts-nocheck
import { signal } from '@preact/signals';
import { useStore } from '../../../state/store';
import { Options } from './Options';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

import dots from '../../../assets/dots.svg';

const showOptions = signal(false);

function toggleOptions() {
  showOptions.value = !showOptions.value
}

export function Footer() {
  const state = useStore()[0];

  const signIn = useGoogleLogin({
    onSuccess: response => console.log(response),
  })

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
      <div className="border-t border-[#747474] px-2 py-4 mt-auto">
        <div onClick={signIn} className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
          <div className="ml-2">Google Login</div>
        </div>
      </div>

    )
  }
}