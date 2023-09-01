import { useDispatch } from 'react-redux';
import { showToast } from '../../store/ui-slice';

import share from '../../assets/share.svg';

export function Share() {
  const dispatch = useDispatch();

  function callShowToast() {
    dispatch(showToast({ content: 'Succesfully copied link' }))
  }

  return (
    <div className="relative">
      <div onClick={callShowToast} className={'p-1 border border-r-0 rounded-l border-[#DBDBDB] cursor-pointer'}>
        <div className="p-1 hover:bg-[#F2F2F2]">
          <img className="w-4" src={share} alt="edit" />
        </div>
      </div>
    </div>
  )
}