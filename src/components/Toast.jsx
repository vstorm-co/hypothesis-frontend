import { useDispatch, useSelector } from 'react-redux'
import { StyleTransition } from 'preact-transitioning'

import checkGreen from '../assets/check-green.svg'

export function Toast(props) {
  const disptach = useDispatch();
  const toast = useSelector(state => state.ui.toast)

  return (
    <StyleTransition
      in={toast.active}
      duration={300}
      styles={{
        enter: { opacity: 0 },
        enterActive: { opacity: 1 },
        exit: { opacity: 0 },
        exitActive: { opacity: 0 },
        exitDone: { opacity: 0 }
      }}
    >
      <div className={'flex bg-[#202020] shadow-white shadow-lg px-4 py-2 rounded text-white'} style={{ transition: 'opacity 300ms' }}>
        <div class="border rounded-full border-[#84CC16] flex justify-center items-center w-6">
          <img src={checkGreen} alt="" />
        </div>
        <div className={'ml-2'}>
          {toast.content ? toast.content : 'This is Only for purpose of Testing content ok ?'}
        </div>
      </div>
    </StyleTransition>
  )
}