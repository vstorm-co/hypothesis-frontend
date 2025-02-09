// @ts-nocheck
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
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const useTempRef = useRef(null);
  outsideClickHanlder(useTempRef, () => { props.onToggleVisible(false) });

  const inputRef = useRef();
  const listPosition = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [props.Visible]);

  const searchFor = useSignal('');
  const filteredTemplates = useSignal([]);

  function handleSearchForUpdate(e) {
    searchFor.value = e.target.value;
  }

  function handleClick(e, template) {
    props.TemplatePicked(template);
  }

  function handleToggle(e) {
    console.log(e);
    let rect = e.target.getBoundingClientRect();
    console.log(props.Position);
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
    props.onToggleVisible()
  }

  return (
    <div title={'Template - Shortcut {{'} ref={useTempRef} className={'relative'}>
      <div onClick={(e) => handleToggle(e)} className={'border p-1 border-b-0 cursor-pointer rounded-tl border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (props.Visible ? 'bg-[#F2F2F2]' : '')}>
          <img src={braces} alt="" />
        </div>
      </div>
      <div style={{ ...listPosition.value }} className={"fixed w-[240px] border rounded bg-white z-50 transform max-h-[225px] overflow-y-auto scrollBar-dark " + (props.Visible ? '' : 'hidden ')}>
        <div className={'p-2 border-b'}>
          <div className="border border-[#DBDBDB] rounded-lg flex items-center p-2">
            <img className="w-4" src={loopSvg} alt="" />
            <input ref={inputRef} onInput={(e) => handleSearchForUpdate(e)} value={searchFor.value} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 max-w-full text-sm leading-6" placeholder="Search..." />
          </div>
        </div>
        <div className={'use-templates-list'}>
          {templates.filter(temp => (temp.name.toLowerCase().includes(searchFor.value) && temp.uuid != currentTemplate.uuid)).map(template => (
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