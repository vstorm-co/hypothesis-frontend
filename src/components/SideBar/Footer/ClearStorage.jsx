import { route } from "preact-router";
import { useDispatch } from "react-redux";
import { userActions } from "../../../store/user-slice";
import bin from '../../../assets/bin.svg';


export function ClearStorage(props) {
  const dispatch = useDispatch();

  function runClearStorage() {
    dispatch(userActions.setUser({}));
    localStorage.clear();
    dispatch(userActions.setUsers([]));
    props.toggle();

    setTimeout(() => {
      route('/auth');
    }, 100)
  }

  return (
    <div onClick={runClearStorage} className={'flex px-3 py-2 border border-dashed rounded hover:bg-[#0F0F0F] border-[#595959] mt-3 cursor-pointer'}>
      <img src={bin} alt="" />
      <div className={'ml-4 text-sm leading-6'}>Clear Local Storage</div>
    </div>
  )
}