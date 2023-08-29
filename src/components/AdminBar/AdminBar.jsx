import { User } from './User';
import { Team } from './Team';

import plus from '../../assets/plus.svg'

export function AdminBar() {
  return (
    <div className="bg-[#202020] text-[#FFFFFF] ml-8">
      <div className={"h-[100vh] flex flex-col duration-300 overflow-hidden " + (false ? 'w-80' : 'w-0')}>
        <div className={(false ? 'p-4' : 'hidden')}>
          <div>
            <div className="text-xs font-bold mb-2">
              Users
            </div>
            <User name={'Jared Pendergraft'} />
            <User name={'Mathew Sigmunt'} />
            <User name={'Jacob Engeyak'} />
          </div>
          <div className={'mt-4'}>
            <div className="text-xs font-bold mb-2">
              Teams
            </div>
            <Team name={'HR'} />
            <div className="flex items-center py-3">
              <div className="text-sm leading-6">
                Developers
              </div>
            </div>
            <div className="flex items-center py-3">
              <div className="text-sm leading-6">
                Accounting
              </div>
            </div>
            <div className="flex items-center py-3">
              <img src={plus} alt="" />
              <div className="text-sm leading-6 ml-[10px]">
                New Team
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}