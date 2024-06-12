import { useDispatch, useSelector } from 'react-redux';
import Help from '../../assets/help.svg';
import braces from '../../assets/braces.svg';
import returnResponse from '../../assets/return.svg';
import useFile from '../../assets/use-file.svg';
import makeAnnotation from '../../assets/make-annotation.svg';
import showLogs from '../../assets/show-logs.svg';
import { useEffect, useRef } from 'preact/hooks';
import { uiActions } from '../../store/ui-slice';



export function ToolbarHelp(props) {
  const visible = useSelector(state => state.ui.showToolbarHelp);
  const popRef = useRef(null);
  const dispatch = useDispatch();

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          dispatch(uiActions.setShowToolbarHelp(false));
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  outsideClickHanlder(popRef);

  return (
    <div>
      <div onClick={() => { dispatch(uiActions.setShowToolbarHelp(true)) }} className={'w-6 h-6 bg-[#EBEBEB] flex items-center justify-center ml-1 rounded-full cursor-pointer tooltip'}>
        <img src={Help} className={'w-3'} alt="" />
        <span className={'tooltiptext whitespace-nowrap'}>
          Show Help
        </span>
      </div>
      <div ref={popRef} className={'pb-8 bg-white rounded z-50 top-2 left-1/2 transform -translate-x-36 w-[640px] border shadow-xl ' + (visible ? 'fixed' : 'hidden')}>
        <div className={'mx-auto'}>
          <div className={'px-8'}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
              Help
            </div>
          </div>
          <div className={'max-h-[84vh] overflow-y-auto pl-8 pr-4 mr-4 mt '}>
            <div className={'text-sm leading-6'}>
              <p className={'text-[#595959] mt-4'}>The following actions are available. When applicable, you can enable the functionality by typing the shortcut instead of clicking the button.</p>
            </div>

            <div className={'mt-2 pr-3 pl-2 py-2 flex border border-[#DBDBDB] rounded-lg'}>
              <div className={'w-6 h-6 flex items-center justify-center shrink-0'}>
                <div className={''}>
                  <img src={braces} alt="" />
                </div>
              </div>
              <div className={'leading-6 text-sm ml-2 text-[#202020]'}>
                Inserts a <span className={'font-semibold'}>template</span> into the prompt input, allowing you to reuse and build chained and nested prompts.
                <div className={'font-semibold mt-2'}>
                  Shortcut: <span className={'mono font-light leading-6 px-1 bg-[#EBEBEB] rounded-[4px] text-sm'}>{'{{'}</span>
                </div>
              </div>
            </div>

            <div className={'mt-2 pr-3 pl-2 py-2 flex border border-[#DBDBDB] rounded-lg'}>
              <div className={'w-6 h-6 flex items-center justify-center shrink-0'}>
                <div className={''}>
                  <img src={returnResponse} alt="" />
                </div>
              </div>
              <div className={'leading-6 text-sm ml-2 text-[#202020]'}>
                Inserts a <span className={'font-semibold'}>return</span> into the prompt input. This sends the preceding text and templates to the AI API and waits for the response before proceeding with the next prompt.
                <div className={'font-semibold'}>
                  Shortcut: <span className={'mono text-sm font-light leading-6 px-1 bg-[#EBEBEB] rounded-[4px]'}>ctrl + enter</span>
                </div>
              </div>
            </div>

            <div className={'mt-2 pr-3 pl-2 py-2 flex border border-[#DBDBDB] rounded-lg'}>
              <div className={'w-6 h-6 flex items-center justify-center shrink-0'}>
                <div className={''}>
                  <img src={useFile} alt="" />
                </div>
              </div>
              <div className={'leading-6 text-sm ml-2 text-[#202020]'}>
                Inserts a <span className={'font-semibold'}>file</span> into the prompt input at the indicated location. That file can either have relevant content, or even additional prompts.
                <div className={'font-semibold mt-2'}>
                  Shortcut: <span className={'mono font-light leading-6 px-1 bg-[#EBEBEB] rounded-[4px] text-sm'}>++</span>
                </div>
              </div>
            </div>

            {props.onChat &&
              <div>
                <div className={'mt-2 pr-3 pl-2 py-2 flex border border-[#DBDBDB] rounded-lg'}>
                  <div className={'w-6 h-6 flex items-center justify-center shrink-0'}>
                    <div className={''}>
                      <img src={makeAnnotation} alt="" />
                    </div>
                  </div>
                  <div className={'leading-6 text-sm ml-2 text-[#202020]'}>
                    Opens an interface for creating <span className={'font-bold'}>AI Annotations</span> over a page or file using Hypothesis using a prompt.
                  </div>
                </div>

                <div className={'mt-2 pr-3 pl-2 py-2 flex border border-[#DBDBDB] rounded-lg'}>
                  <div className={'w-6 h-6 flex items-center justify-center shrink-0'}>
                    <div className={''}>
                      <img src={showLogs} alt="" />
                    </div>
                  </div>
                  <div className={'leading-6 text-sm ml-2 text-[#202020]'}>
                    Shows the logs of interactions with various APIs. This is very helpful to debug the return and understand how prompts are being sent and responses interpreted.
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  )
}