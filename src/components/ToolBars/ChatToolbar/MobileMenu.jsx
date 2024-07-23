// @ts-nocheck
import { useSelector } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

import braces from '../../../assets/braces.svg';
import elips from '../../../assets/ellipsis-vertical.svg';
import loopSvg from '../../../assets/loop.svg';

const isVisible = signal(false);

function toggleVisible() {
  isVisible.value = !isVisible.value
}

function outsideClickHanlder(ref, callback) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        isVisible.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", e => {
      // console.log(e);
    })

    return () => {
    }
  }, [ref])
}

export function MobileMenu(props) {
  const useTempRef = useRef(null);
  outsideClickHanlder(useTempRef, () => { props.onToggleVisible(false) });

  const inputRef = useRef();
  const listPosition = useRef(null);

  function handleToggle(e) {
    let rect = e.target.getBoundingClientRect();
    if (props.Position === 'left') {
      listPosition.value = {
        top: rect.top - 20,
        left: rect.left - 255,
      }
    } else {
      listPosition.value = {
        bottom: 165,
        left: rect.left - 10,
      }
    }
    toggleVisible();
  }

  return (
    <div ref={useTempRef} className={'relative'}>
      <div onClick={(e) => handleToggle(e)} className={'border p-1 border-b-0 cursor-pointer rounded-t border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (props.Visible ? 'bg-[#F2F2F2]' : '')}>
          <img src={elips} className={'transform rotate-90'} alt="" />
        </div>
      </div>
      <div style={{ ...listPosition.value }} className={"fixed w-[240px] border rounded bg-white z-50 transform max-h-[225px] overflow-y-auto scrollBar-dark " + (isVisible.value ? '' : 'hidden ')}>

      </div>
    </div>

  )
}