import { signal } from '@preact/signals'

import filtersIcon from '../../assets/filters.svg'
import { useEffect, useRef } from 'preact/hooks';

const showFilters = signal(false);
function toggleShowFilters() {
  showFilters.value = !showFilters.value
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        showFilters.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}

export function Filters() {
  const filtersRef = useRef(null);
  outsideClickHanlder(filtersRef);

  return (
    <div ref={filtersRef} className={'relative'}>
      <div className={'hover:bg-[#595959] cursor-pointer rounded p-2 ' + (showFilters.value ? 'bg-[#595959]' : '')} onClick={toggleShowFilters}>
        <img src={filtersIcon} alt="" />
      </div>
      <div className={"absolute z-50 w-80 border rounded top-0 left-12 bg-[#202020] " + (showFilters.value ? '' : 'hidden')}>
        <div className="border-b border-[#747474] pt-4 px-4 pb-2">
          <div className="text-xs font-bold mb-1">
            Visibility
          </div>
          <div className={'text-sm leading-6 flex text-[#747474]'}>
            <div className={'cursor-pointer px-2 py-1 rounded hover:bg-[#747474] hover:text-white'}>All</div>
            <div className={'cursor-pointer px-2 py-1 rounded bg-[#747474] text-white'}>Just Me</div>
            <div className={'cursor-pointer px-2 py-1 rounded hover:bg-[#747474] hover:text-white'}> Organization</div>
          </div>
        </div>
        <div className="pt-4 px-4 pb-2">
          <div className="text-xs font-bold mb-1">
            Recent Items
          </div>
          <div className={'text-sm leading-6 flex text-[#747474]'}>
            <div className={'cursor-pointer px-2 py-1 rounded border border-[#747474] text-white'}>All</div>
            <div className={'cursor-pointer px-2 py-1 rounded hover:border border-[#747474] hover:text-white'}>Last Week</div>
            <div className={'cursor-pointer px-2 py-1 rounded hover:border border-[#747474] hover:text-white'}>Last 30 Days</div>
            <div className={'cursor-pointer px-2 py-1 rounded hover:border border-[#747474] hover:text-white'}>Older</div>
          </div>
        </div>
      </div>
    </div>
  )
}  