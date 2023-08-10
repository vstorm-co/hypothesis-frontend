import { signal } from '@preact/signals';

import { Options } from './Options';

import dots from '../../../assets/dots.svg';

const showOptions = signal(false);

function toggleOptions() {
  showOptions.value = !showOptions.value
}

export function Footer() {

  return (
    <div className="border-t border-[#747474] px-2 py-4 mt-auto">
      <div className="flex items-center px-2 py-1">
        <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
        <div className="text-sm leading-6">
          Jared Pendergraft
        </div>
        <div class="ml-auto relative">
          <div onClick={toggleOptions} className={"cursor-pointer p-1 hover:bg-[#595959] relative rounded " + (showOptions.value ? "bg-[#595959]" : '')}>
            <img src={dots} alt="options" />
          </div>
          <Options show={showOptions.value} />
        </div>
      </div>
    </div>
  )
}