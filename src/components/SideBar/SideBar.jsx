import { SearchBar } from './SearchBar';
import { Chats } from './Chats';
import { Templates } from './Templates';
import { Footer } from './Footer/Footer';

import { StyleTransition } from 'preact-transitioning';

import sidebarToggleIcon from '../../assets/sidebar.svg';

import { Filters } from './Filters';
import { useSignal } from '@preact/signals';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'preact/hooks';
import { uiActions } from '../../store/ui-slice';


export function SideBar() {
  const hideSideBar = useSelector(state => state.ui.hideSideBar);
  const expandSidebar = useSelector(state => state.ui.expandSidebar);
  const guestMode = useSelector(state => state.user.guestMode);

  const hideScrollBar = useSignal(false);

  const sideBarRef = useRef(null);
  const scrollRef = useRef();

  const dispatch = useDispatch();


  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        let width = window.innerWidth;
        if (ref.current && !ref.current.contains(e.target) && width < 960) {
          dispatch(uiActions.setExpandSideBar(false));
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }
  outsideClickHanlder(sideBarRef);

  function handleToggleScrollBar(tgl) {
    hideScrollBar.value = tgl;
  }

  useEffect(() => {
    console.dir(scrollRef.current);

    let width = window.innerWidth;
  }, []);


  function handleToggleSidebar(e) {
    if (!guestMode) {
      e.stopPropagation();
      dispatch(uiActions.setExpandSideBar(!expandSidebar))
    }
  }

  if (!hideSideBar) {
    return (
      <div onClick={(e) => { if (!expandSidebar) handleToggleSidebar(e); }} ref={sideBarRef} className={"bg-[#202020] text-[#FFFFFF] absolute desktop:relative side-bar-shadow " + (expandSidebar ? 'active z-[100]' : 'z-50')}>
        <div style={{ transition: 'width 300ms' }} className={"h-[100vh] flex flex-col relative pb-20 " + (expandSidebar ? 'w-80' : 'w-12')}>
          <div style={{ transition: 'all 1ms' }} className={'pt-4 flex justify-between ' + (expandSidebar ? 'px-3' : 'px-1.5')}>
            <div onClick={(e) => { handleToggleSidebar(e) }} className={'p-2 cursor-pointer flex-shrink-0 mt-1'}>
              <img src={sidebarToggleIcon} alt="" />
            </div>
            {!guestMode &&
              <StyleTransition
                in={expandSidebar}
                duration={1}
                styles={{
                  enter: { opacity: 0 },
                  enterActive: { opcaity: 1 },
                }}
              >
                <div style={{ transition: 'opacity 1ms' }} className={'flex'}>
                  <div className={''}>
                    <SearchBar />
                  </div>
                  <div className={'flex mt-1'}>
                    <Filters />
                  </div>
                </div>
              </StyleTransition>
            }
          </div>
          {!guestMode &&
            <StyleTransition
              in={expandSidebar}
              duration={300}
              styles={{
                enter: { opacity: 0 },
                enterActive: { opcaity: 1 },
                exit: { opacity: 1 },
                exitActive: { opacity: 0 }
              }}
            >
              <div style={{ transition: 'opacity 100ms' }} className={'overflow-hidden flex flex-col h-full'}>
                <div ref={scrollRef} className={"overflow-hidden flex flex-col h-full"}>
                  <Chats handleToggleScrollBar={(tgl) => handleToggleScrollBar(tgl)} />
                  <Templates />
                </div>
                <div className={'overflow-y-hidden'}>
                  <Footer />
                </div>
              </div>
            </StyleTransition>
          }
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