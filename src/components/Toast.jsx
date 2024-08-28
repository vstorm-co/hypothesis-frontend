import { useDispatch, useSelector } from 'react-redux'
import { StyleTransition } from 'preact-transitioning'

import checkGreen from '../assets/check-green.svg'
import restricted from '../assets/restricted-white.svg';
import plus from '../assets/plus-white.svg'
import { uiActions } from '../store/ui-slice';

export function Toast(props) {
  const dispatch = useDispatch();
  const toast = useSelector(state => state.ui.toast);

  function closeErrorToast() {
    dispatch(uiActions.toggleToast({ tgl: false, content: '', error: true, errorData: {} }))
  }

  if (!toast.error) {
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
  } else {
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
        <div className={'flex bg-[#EF4444] shadow-white shadow-lg px-4 py-2 rounded text-white'} style={{ transition: 'opacity 300ms' }}>
          <div class="mr-2 mt-1">
            <img src={restricted} alt="" />
          </div>
          <div className={''}>
            <div className={'text-lg'}>
              {toast.content ? toast.content : 'This is Only for purpose of Testing content ok ?'}
            </div>
            <div className={'text-xs'}>
              <div>
                Status Code {toast.errorData.status} {toast.errorData.statusText}
              </div>
              <div className={'truncate w-[420px]'}>
                Request path: {toast.errorData.url}
              </div>
            </div>
          </div>
          <div onClick={e => closeErrorToast()} className={'ml-6 mt-1 cursor-pointer'}>
            <img src={plus} alt="" className={'w-4 transform rotate-45'} />
          </div>
        </div>
      </StyleTransition>
    )
  }
}