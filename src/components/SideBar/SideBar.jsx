import { SearchBar } from './SearchBar';
import { Chats } from './Chats';
import { Templates } from './Templates';
import { Footer } from './Footer/Footer';
import { useSelector } from 'react-redux';

import { SearchBarSkeleton } from '../Skeletons/SearchBarSkeleton';
import { ChatSkeleton } from '../Skeletons/ChatSkeleton';
import { FooterSkeleton } from '../Skeletons/FooterSkeleton';


export function SideBar() {
  const currentUser = useSelector(state => state.user.currentUser)

  if (currentUser.access_token && currentUser.set_up) {
    return (
      <div className="bg-[#202020] text-[#FFFFFF]">
        <div className="w-80 h-[100vh] flex flex-col relative overflow-y-hidden pb-20">
          <div className={'px-4 py-2'}>
            <SearchBar />
          </div>
          <div className="px-4 overflow-auto overflow-x-visible scrollBar-dark">
            <Chats />
            <Templates />
          </div>
          <Footer />
        </div>
      </div>
    )
  } else {
    return (
      <div className="bg-[#202020] text-[#FFFFFF]">
        <div className="w-80 h-[100vh] flex flex-col">
          <div className="p-4">
            <SearchBarSkeleton />
            <div className={'mt-4'}>
              <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
                <div className={'w-9 h-2 bg-[#8F8F8F] rounded'}></div> <div class="ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px]"></div>
                <div class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-1 cursor-pointer">
                  <div className={'w-8 h-2 rounded bg-[#8F8F8F]'}></div> <div className={'w-4 h-4 ml-1 bg-[#8F8F8F] rounded'}></div>
                </div>
              </div>
            </div>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </div>
          <FooterSkeleton />
        </div>
      </div>
    )
  }
}