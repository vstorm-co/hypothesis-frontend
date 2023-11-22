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
    <div ref={useTempRef} className={'relative'}>
      <div onClick={toggleVisible} className={'border p-1 border-b-0 cursor-pointer rounded-tl border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (isVisible.value ? 'bg-[#F2F2F2]' : '')}>
          <img src={braces} alt="" />
        </div>
      </div>
      <div className={"absolute w-[240px] border rounded left-0 bottom-10 p-2 transform bg-[#202020] text-white max-h-[220px] overflow-auto scrollBar-dark " + (isVisible.value ? '' : 'hidden')}>
        {templates.map(template => (
          <div onClick={() => { props.TemplatePicked(template); toggleVisible() }} className={'p-2 hover:bg-[#0F0F0F] cursor-pointer rounded-lg'}>{template.name}</div>
        ))}
      </div>
    </div>

  )
}