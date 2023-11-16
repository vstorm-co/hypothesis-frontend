import { useSelector } from 'react-redux';
import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

import braces from '../../../assets/braces.svg';

const isVisible = signal(false);

function toggleVisible() {
  isVisible.value = !isVisible.value
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        isVisible.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}


export function UseTemplate(props) {
  const templates = useSelector(state => state.templates.useTemplates);

  const useTempRef = useRef(null);
  outsideClickHanlder(useTempRef);


  return (
    <div ref={useTempRef} className={'relative w-full'}>
      <div className={'border p-1 border-b-0 cursor-pointer rounded-t border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (isVisible.value ? 'bg-[#F2F2F2]' : '')}>
        </div>
      </div>
    </div>

  )
}