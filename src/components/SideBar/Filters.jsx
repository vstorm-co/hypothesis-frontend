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
      <div className={'hover:bg-[#595959] cursor-pointer rounded p-2 ' + (showFilters.value ? 'bg-[#595959]' : '')} onClick={toggleShowFilters}>
        <img src={filtersIcon} alt="" />
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
            <div onClick={() => { setSortBy('updated_at') }} className={'cursor-pointer font-bold px-2 py-1 ml-1 rounded hover:outline hover:outline-[1px] outline-[#747474] hover:text-white ' + (filters.sortBy === 'created_at' ? 'outline  outline-[1px] text-white' : '')}>Oldest</div>
            <div onClick={() => { setSortBy('name') }} className={'cursor-pointer font-bold px-2 py-1 rounded hover:outline hover:outline-[1px] outline-[#747474] hover:text-white ' + (filters.sortBy === 'name' ? 'outline  outline-[1px] text-white' : '')}>Alphabetical</div>
          </div>
        </div>
      </div>
    </div>
  )
}  