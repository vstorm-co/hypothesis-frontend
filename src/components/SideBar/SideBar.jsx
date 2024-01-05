import { SearchBar } from './SearchBar';
import { Chats } from './Chats';
import { Templates } from './Templates';
import { Footer } from './Footer/Footer';

import { Filters } from './Filters';
import { useSignal } from '@preact/signals';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'preact/hooks';


export function SideBar() {
  const hideSideBar = useSelector(state => state.ui.hideSideBar);

  const hideScrollBar = useSignal(false);

  const scrollRef = useRef();

  function handleToggleScrollBar(tgl) {
    hideScrollBar.value = tgl;
  }

  useEffect(() => {
    console.dir(scrollRef.current)
  }, []);

  function handleClass() {
    if (scrollRef.current) {
      if (!hideScrollBar.value) {
        return 'overflow-y-auto pl-3 pr-3'
      } else {
        return 'overflow-x-visible px-4'
      }
    }
  }

  if (!hideSideBar) {
    return (
      <div className="bg-[#202020] text-[#FFFFFF]">
        <div className="w-80 h-[100vh] flex flex-col relative pb-20">
          <div className={'pl-4 pr-2 pt-2 flex'}>
            <div className={'w-11/12'}>
              <SearchBar />
            </div>
            <div className={'mt-1 ml-1'}>
              <Filters />
            </div>
          </div>
          <div ref={scrollRef} className={" scrollBar-dark " + handleClass()}>
            <Chats handleToggleScrollBar={(tgl) => handleToggleScrollBar(tgl)} />
            <Templates />
          </div>
          <div className={'overflow-y-hidden'}>
            <Footer />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      // <div className="bg-[#202020] text-[#FFFFFF]">
      //   <div className="w-80 h-[100vh] flex flex-col">
      //     <div className="p-4">
      //       <SearchBarSkeleton />
      //       <div className={'mt-4'}>
      //         <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
      //           <div className={'w-9 h-2 bg-[#8F8F8F] rounded'}></div> <div class="ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px]"></div>
      //           <div class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-1 cursor-pointer">
      //             <div className={'w-8 h-2 rounded bg-[#8F8F8F]'}></div> <div className={'w-4 h-4 ml-1 bg-[#8F8F8F] rounded'}></div>
      //           </div>
      //         </div>
      //       </div>
      //       <ChatSkeleton />
      //       <ChatSkeleton />
      //       <ChatSkeleton />
      //     </div>
      //     <FooterSkeleton />
      //   </div>
      // </div>
      <div></div>
    )
  }
}