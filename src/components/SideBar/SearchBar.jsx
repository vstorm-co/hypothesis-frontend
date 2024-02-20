import { useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui-slice';
import { chatsActions, getChatsData } from '../../store/chats-slice';
import { getTemplatesData } from '../../store/templates-slice';

import plus from '../../assets/plus.svg';
import loopSvg from '../../assets/loop.svg';

export function SearchBar() {
  const dispatch = useDispatch();
  const inputValue = useSelector(state => state.ui.searchFilters.searchFor);
  const ui = useSelector(state => state.ui);

  let searchTimeout = null;

  function handleInput(e) {
    clearTimeout(searchTimeout);
    dispatch(uiActions.setFiltersSearch({ searchFor: e.target.value }));

    dispatch(uiActions.toggleChatsLoading(true));

    searchTimeout = setTimeout(() => {
      dispatch(getChatsData());
      dispatch(getTemplatesData());
    }, 1000)
  }

  function setVisibilityToAll() {
    dispatch(uiActions.setFiltersVisibility({ visibility: 'all' }));
    dispatch(getChatsData());
    dispatch(getTemplatesData());
  }

  function setTimeSpanToAll() {
    dispatch(uiActions.setFiltersSortBy('-updated_at'));
    dispatch(getChatsData());
    dispatch(getTemplatesData());
  }

  function clearSearchFor() {
    dispatch(uiActions.setFiltersSearch({ searchFor: '' }));
    dispatch(getChatsData());
    dispatch(getTemplatesData());
  }

  return (
    <div>
      <div className="border-[1px] border-[#747474] rounded-lg flex items-center p-2">
        <img className="w-4" src={loopSvg} alt="" />
        <input onInput={(e) => handleInput(e)} value={inputValue} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 w-full" placeholder="Search..." />
        {ui.searchFilters.searchFor.length > 0 &&
          <div onClick={clearSearchFor} className={'transform rotate-45 cursor-pointer'}>
            <img src={plus} alt="" />
          </div>}
      </div>
      <div className={'flex gap-2 flex-wrap ' + (ui.searchFilters.visibility != 'all' || ui.searchFilters.sortBy != '-updated_at' ? 'mt-4' : '')}>
        {ui.searchFilters.visibility != 'all' &&
          <div className={'flex'}>
            {ui.searchFilters.visibility === 'just_me' &&
              <div className={'flex'}>
                <div className={'px-2 font-normal text-sm leading-6 bg-[#595959] rounded-l'}>
                  Just Me
                </div>
                <div onClick={setVisibilityToAll} className={'bg-[#595959] border-l border-[#202020] cursor-pointer text-[#DBDBDB] rounded-r flex items-center justify-center p-1'}>
                  <img src={plus} className={'transform rotate-45'} alt="" />
                </div>
              </div>
            }
            {ui.searchFilters.visibility === 'organization' &&
              <div className={'flex'}>
                <div className={'px-2 font-normal text-sm leading-6 bg-[#595959] rounded-l'}>
                  Organization
                </div>
                <div onClick={setVisibilityToAll} className={'bg-[#595959] border-l border-[#202020] cursor-pointer text-[#DBDBDB] rounded-r flex items-center justify-center p-1'}>
                  <img src={plus} className={'transform rotate-45'} alt="" />
                </div>
              </div>
            }
          </div>}
        <div className={'flex'}>
          {/* {ui.searchFilters.sortBy === '-updated_at' &&
            <div className={'flex'}>
              <div className={'px-2 font-normal text-sm leading-6 border border-[#595959] rounded-l'}>
                Newest
              </div>
              <div onClick={setTimeSpanToAll} className={'border-[#595959] border-l-0 border cursor-pointer text-[#DBDBDB] rounded-r flex items-center justify-center p-1'}>
                <img src={plus} className={'transform rotate-45'} alt="" />
              </div>
            </div>
          } */}
          {ui.searchFilters.sortBy === 'updated_at' &&
            <div className={'flex'}>
              <div className={'px-2 font-normal text-sm leading-6 border border-[#595959] rounded-l'}>
                Oldest
              </div>
              <div onClick={setTimeSpanToAll} className={'border-[#595959] border-l-0 border cursor-pointer text-[#DBDBDB] rounded-r flex items-center justify-center p-1'}>
                <img src={plus} className={'transform rotate-45'} alt="" />
              </div>
            </div>
          }
          {ui.searchFilters.sortBy === 'name' &&
            <div className={'flex'}>
              <div className={'px-2 font-normal text-sm leading-6 border border-[#595959] rounded-l'}>
                Alphabetical
              </div>
              <div onClick={setTimeSpanToAll} className={'border-[#595959] border-l-0 border cursor-pointer text-[#DBDBDB] rounded-r flex items-center justify-center p-1'}>
                <img src={plus} className={'transform rotate-45'} alt="" />
              </div>
            </div>
          }
        </div>
      </div>
    </div >
  )
}