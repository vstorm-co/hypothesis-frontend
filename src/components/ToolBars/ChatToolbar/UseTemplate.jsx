import { useSelector } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';

import braces from '../../../assets/braces.svg';
import loopSvg from '../../../assets/loop.svg';

const isVisible = signal(false);

function toggleVisible() {
  isVisible.value = !isVisible.value
}

function outsideClickHanlder(ref, callback) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
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


export function UseTemplate(props) {
  const templates = useSelector(state => state.templates.useTemplates);

  const useTempRef = useRef(null);
  outsideClickHanlder(useTempRef, () => { props.onToggleVisible(false) });

  const searchFor = useSignal('');
  const filteredTemplates = useSignal([]);

  function handleSearchForUpdate(e) {
    searchFor.value = e.target.value;
  }

  function handleClick(e, template) {
    props.TemplatePicked(template);
  }

  return (
    <div ref={useTempRef} className={'relative'}>
      <div onClick={() => props.onToggleVisible()} className={'border p-1 border-b-0 cursor-pointer rounded-tl border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (props.Visible ? 'bg-[#F2F2F2]' : '')}>
          <img src={braces} alt="" />
        </div>
      </div>
      <div className={"absolute w-[240px] border rounded bg-white z-50 transform max-h-[225px] overflow-y-auto scrollBar-dark " + (props.Visible ? '' : 'hidden ') + (props.Position === 'top' ? 'bottom-10 left-0' : '-top-2 right-10')}>
        <div className={'p-2 border-b'}>
          <div className="border border-[#DBDBDB] rounded-lg flex items-center p-2">
            <img className="w-4" src={loopSvg} alt="" />
            <input onInput={(e) => handleSearchForUpdate(e)} value={searchFor.value} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 max-w-full text-sm leading-6" placeholder="Search..." />
          </div>
        </div>
        <div className={''}>
          {templates.filter(temp => temp.name.toLowerCase().includes(searchFor.value)).map(template => (
            <div onClick={(e) => handleClick(e, template)} className={'max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow'}>
              <img className="w-4" src={braces} alt="" />
              <div className={'max-w-full truncate ml-[5px] text-sm  leading-6'}>
                {template.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}