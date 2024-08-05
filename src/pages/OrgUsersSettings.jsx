import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getOrganizationData } from "../store/organizations-slice";
import loopSvg from '../assets/loop.svg';

export function OrgUsersSettings(props) {
  const organization = useSelector(state => state.organizations.currentOrganization);
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganizationData(currentUser.organization_uuid));
  }, [])

  return (
    <div className={'relative w-full'}>
      <div className={'pb-8 bg-white w-[780px] mx-auto'}>
        <div className={'mx-auto'}>
          <div className={''}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-3 text-center border-b border-[#DBDBDB] flex items-center justify-between'}>
              Users
              <button className="btn-second">
                Back
              </button>
            </div>
          </div>
          <div className={'max-h-[86vh] overflow-y-auto pt-8 pr-1'}>
            <div className={'flex items-center w-full justify-between'}>
              <div className={'text-sm leading-6 font-bold flex items-center'}>
                {organization.users.length} {organization.users.length > 1 ? 'Users' : 'User'}
              </div>
              <div className={'flex gap-4'}>
                <div className="border-[1px] border-[#DBDBDB] bg-[#FAFAFA] rounded-lg flex items-center p-2">
                  <img className="w-4" src={loopSvg} alt="" />
                  <input type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 w-full" placeholder="Search..." />
                </div>
              </div>
            </div>
            <div className={'mt-4'}>
              <table className={'w-full'}>
                <th className={'w-[40px]'}></th>
                <th className={'text-left text-xs font-bold text-[#747474]'}>Users</th>
                <th className={'text-left text-xs font-bold text-[#747474]'}>Email</th>
                <th className={'text-left text-xs font-bold text-[#747474]'}>Admin</th>
                <th></th>
                <tbody>
                  {organization.users.map((user) =>
                    <tr>
                      <td>
                        <label className="custom-check">
                          <input type="checkbox" checked={false} />
                          <span class="checkmark"></span>
                        </label>
                      </td>
                      <td className='flex items-center gap-2 py-1 w-[70%]'>
                        <img src={user.picture} className={'w-8 h-8 border border-[#DBDBDB] rounded-full'} alt="" />
                        {user.name}
                      </td>
                      <td>
                        {user.email}
                      </td>
                      <td className={''}>
                        <div className={'flex items-center text-sm leading-6 shrink-0'}>
                          <label class="switch">
                            <input type="checkbox" checked={true} />
                            <span class="slider round"></span>
                          </label>
                        </div>
                      </td>
                      <td>
                        <div className={'flex items-center text-[#747474] group-hover:text-[#DBDBDB]'}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 1C16 0.447715 15.5523 0 15 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H15C15.5523 2 16 1.55228 16 1ZM14 4H2C1.36895 4 0.895661 4.57732 1.01942 5.19612L3.01942 15.1961C3.1129 15.6635 3.52332 16 4 16H12C12.4767 16 12.8871 15.6635 12.9806 15.1961L14.9806 5.19612C15.1043 4.57732 14.631 4 14 4ZM12.78 6L11.18 14H4.819L3.219 6H12.78Z" fill="currentColor" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}