import { useEffect } from 'react';
import Help from '../../assets/help.svg';
import { useSignal } from '@preact/signals';
import { uiActions } from '../../store/ui-slice';
import { useDispatch } from 'react-redux';
export function HelpToolTip(props) {
  const dispatch = useDispatch();

  function handleTooltip(e) {
    let rect = e.target.getBoundingClientRect();
    console.log(rect);
    dispatch(uiActions.setToolTipContent(props.content))

    dispatch(uiActions.setHelpToolTipPosition({
      top: Math.ceil(rect.top - 32) + 'px',
      left: Math.ceil(rect.left + 15) + 'px',
    }))
  }

  function handleLeave() {
    dispatch(uiActions.setToolTipContent(''))

    dispatch(uiActions.setHelpToolTipPosition({
      top: 0 + 'px',
      left: 0 + 'px',
    }))
  }

  return (
    <div onMouseEnter={e => handleTooltip(e)} onMouseLeave={() => handleLeave()} className={'w-4 h-4 bg-[#EBEBEB] flex items-center justify-center ml-1 rounded-full cursor-help tooltip'}>
      <img src={Help} alt="" />
    </div>
  )
}