import { useState } from 'preact/hooks';
import loopSvg from '../../assets/loop.svg';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui-slice';
import { chatsActions, getChatsData } from '../../store/chats-slice';

export function SearchBar() {
  const dispatch = useDispatch();
  const inputValue = useSelector(state => state.chats.searchFilters.searchFor);

  let searchTimeout = null;

  function handleInput(e) {
    clearTimeout(searchTimeout);
    dispatch(uiActions.toggleChatsLoading(true));

    searchTimeout = setTimeout(() => {
      dispatch(chatsActions.setFiltersSearch({ searchFor: e.target.value }));
      dispatch(getChatsData());

      dispatch(uiActions.toggleChatsLoading(false));
    }, 500)
  }

  return (
    <div className="border-[1px] border-[#747474] rounded-lg flex items-center p-2">
      <img className="w-4" src={loopSvg} alt="" />
      <input onInput={(e) => handleInput(e)} value={inputValue} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2" placeholder="Search..." />
    </div>
  )
}