import darkmode from '../../../assets/darkmode.svg';
import logout from '../../../assets/logout.svg';
import { useStore } from '../../../state/store';



export function Options(props) {
  const dispatch = useStore()[1];



  function toggleAdminBar() {
    dispatch('TOGGLE_ADMIN_BAR')
  }

  return (
    <div className={"absolute border border-[#595959] rounded min-w-[160px] -top-[8.5rem] -left-[8rem] bg-[#0F0F0F] " + (props.show ? '' : 'hidden')}>
      <div className="text-sm leading-6">
        <div className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
          <img className="w-4" src={darkmode} alt="" /> <div className="ml-2">Toggle Theme</div>
        </div>
        <div onClick={toggleAdminBar} className={"cursor-pointer flex hover:bg-[#595959] p-2 border-y border-[#595959]"}>
          <img className="w-4" src={darkmode} alt="" /> <div className="ml-2">Admin Panel</div>
        </div>
        <div className={"cursor-pointer flex p-2 hover:bg-[#595959]"}>
          <img className="w-4" src={logout} alt="" /> <div className="ml-2">Logout</div>
        </div>
      </div>
    </div>
  )
}