import { route } from "preact-router";
import { useDispatch } from "react-redux";
import { userActions } from "../../../store/user-slice";
import bin from '../../../assets/bin.svg';


export function Detonate(props) {
  const dispatch = useDispatch();

  function runDetonate() {
    dispatch(userActions.setUser({}));
    localStorage.clear();
    dispatch(userActions.setUsers([]));

    fetch(`${import.meta.env.VITE_API_URL}/admin`, {
      method: 'DELETE',
    })

    setTimeout(() => {
      route('/auth');
    }, 100)
  }

  return (
    <div onClick={runDetonate} className={'px-3 py-2 rounded bg-[#EF4444] border-[#595959] mt-3 cursor-pointer'}>
      <div className={'text-center font-bold text-sm leading-6'}>Clear Database</div>
    </div>
  )
}