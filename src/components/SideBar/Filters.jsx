import { signal } from '@preact/signals'
import { useDispatch, useSelector } from 'react-redux';

import filtersIcon from '../../assets/filters.svg'
import { useEffect, useRef } from 'preact/hooks';
import { chatsActions, getChatsData } from '../../store/chats-slice';
import { uiActions } from '../../store/ui-slice';
import { getTemplatesData } from '../../store/templates-slice';

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

  const dispatch = useDispatch();
  const filters = useSelector(state => state.ui.searchFilters);
  const currentUser = useSelector(state => state.user.currentUser);

  function setFilter(tgl) {
    dispatch(uiActions.setFiltersVisibility({ visibility: tgl }));
    dispatch(getChatsData());
    dispatch(getTemplatesData());

    showFilters.value = false;
  }

  function setSortBy(tgl) {
    dispatch(uiActions.setFiltersSortBy(tgl));
    dispatch(getChatsData());
    dispatch(getTemplatesData());

    showFilters.value = false;
  }

  return (
    <div ref={filtersRef} className={'relative'}>
      <div className={'hover:bg-[#595959] text-[#747474] hover:text-[#DBDBDB] cursor-pointer rounded p-2 ' + (showFilters.value ? 'bg-[#595959] text-[#DBDBDB]' : '')} onClick={toggleShowFilters}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 3C16 2.44772 15.5523 2 15 2H1L0.883379 2.00673C0.38604 2.06449 0 2.48716 0 3C0 3.55228 0.447715 4 1 4H15L15.1166 3.99327C15.614 3.93551 16 3.51284 16 3ZM13 7C13.5523 7 14 7.44772 14 8C14 8.51284 13.614 8.93551 13.1166 8.99327L13 9H3C2.44772 9 2 8.55228 2 8C2 7.48716 2.38604 7.06449 2.88338 7.00673L3 7H13ZM11 12C11.5523 12 12 12.4477 12 13C12 13.5128 11.614 13.9355 11.1166 13.9933L11 14H5C4.44772 14 4 13.5523 4 13C4 12.4872 4.38604 12.0645 4.88338 12.0067L5 12H11Z" fill="currentColor"/>
        </svg>
      </div>
      <div className={"absolute z-50 w-96 border rounded top-0 max-w-[320px] left-12 bg-[#202020] " + (showFilters.value ? '' : 'hidden')}>
        <div className="border-b border-[#747474] pt-4 px-4 pb-2">
          <div className="text-xs font-bold mb-1">
            Visibility
          </div>
          <div className={'text-sm leading-6 flex text-[#747474]'}>
            <div onClick={() => setFilter('all')} className={'cursor-pointer font-bold px-2 -ml-1 mr-1 py-1 rounded hover:bg-[#747474] hover:text-white ' + (filters.visibility === 'all' ? 'bg-[#747474] text-white' : '')}>All</div>
            <div onClick={() => setFilter('just_me')} className={'cursor-pointer font-bold px-2 mr-1 py-1 whitespace-nowrap rounded hover:bg-[#747474] hover:text-white ' + (filters.visibility === 'just_me' ? 'bg-[#747474] text-white' : '')}>Just Me</div>
            {currentUser.organization_uuid &&
              <div onClick={() => setFilter('organization')} className={'cursor-pointer font-bold px-2 mr-1 py-1 rounded hover:bg-[#747474] hover:text-white ' + (filters.visibility === 'organization' ? 'bg-[#747474] text-white' : '')}> Organization</div>}
          </div>
        </div>
        <div className="pt-4 px-4 pb-2">
          <div className="text-xs font-bold mb-1">
            Sort Items
          </div>
          <div className={'text-sm leading-6 flex gap-1 flex-wrap text-[#747474] pb-2'}>
            <div onClick={() => { setSortBy('-updated_at') }} className={'cursor-pointer font-bold px-2 py-1 rounded hover:outline hover:outline-[1px] outline-[#747474] hover:text-white  ' + (filters.sortBy === '-updated_at' ? 'outline  outline-[1px] text-white' : '')}>Newest</div>
            <div onClick={() => { setSortBy('updated_at') }} className={'cursor-pointer font-bold px-2 py-1 ml-1 rounded hover:outline hover:outline-[1px] outline-[#747474] hover:text-white ' + (filters.sortBy === 'updated_at' ? 'outline  outline-[1px] text-white' : '')}>Oldest</div>
            <div onClick={() => { setSortBy('name') }} className={'cursor-pointer font-bold px-2 py-1 rounded hover:outline hover:outline-[1px] outline-[#747474] hover:text-white ' + (filters.sortBy === 'name' ? 'outline  outline-[1px] text-white' : '')}>Alphabetical</div>
          </div>
        </div>
      </div>
    </div>
  )
}  