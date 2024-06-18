import { useSignal } from "@preact/signals";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDefaultScafoldPrompt } from "../store/h-slice";

export function ScafoldPrompt() {
  const promptMode = useSignal('preview');
  const defaultScafoldPrompt = useSelector(state => state.h.defaultScafoldPrompt);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDefaultScafoldPrompt());
  }, [])

  // return (
  //   <div></div>
  // )
  return (
    <div className={'flex w-full mx-4 page-template'} >
      <div>
      </div>
      <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
        <div className="h-[100vh] flex flex-col pt-4 pb-2">
          <div className={'flex items-center py-4 border-b border-[#DBDBDB] relative'}>
            <div class="flex items-center w-full cursor-pointer">
              <div className={'text-lg leading-6 font-bold py-2 max-h-[156px] overflow-hidden text-[#595959] '}>
                Default Scaffolding Prompt
              </div>
            </div>

            {/* <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
              <Toast />
            </div> */}
          </div>
          <div className={'mt-4'}>
            {/* <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
              Default Scaffolding Prompt
            </div> */}
            <div className={'relative'}>
              <form className="mt-auto shrink-0 input-form">

                <div className={'ml-auto flex items-center justify-end'}>
                  <div className={'preview-button ' + (promptMode.value === 'preview' ? 'active' : '')}>
                    Preview
                  </div>
                </div>
                <div
                  data-placeholder={''}
                  spellCheck={false}
                  contentEditable={false}
                  dangerouslySetInnerHTML={{ __html: defaultScafoldPrompt.length > 0 ? defaultScafoldPrompt : 'No Default Scaffolding prompt found' }} className={"msg min-h-[72px] " + (promptMode.value === 'write' ? 'write-box' : 'preview-box')}
                >
                  {defaultScafoldPrompt.length > 0 ? defaultScafoldPrompt : 'No Default Scaffolding prompt found'}
                </div>
                {/* {promptMode.value === 'write' &&
        } */}
                {/* {promptMode.value === 'preview' &&
        <div spellCheck={false} dangerouslySetInnerHTML={{ __html: preview.value }} className="msg min-h-[72px] max-h-[156px] preview-box">
          {preview.value}
        </div>
      } */}
                {/* <div className={'flex gap-1 mt-2 justify-end'}>
                  {props.SecondButton &&
                    <button type="button" onClick={() => props.handleSecondButton()} className="btn-second">{props.SecondButtonText}</button>
                  }
                  <button type="submit" disabled={((input.value.length === 0 || props.blockSending) && props.Icon != 'stop')} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                    {props.SubmitButtonText}
                    {props.Icon === 'send' &&
                      <img className="ml-2" src={send} alt="" />
                    }
                    {props.Icon === 'stop' &&
                      <img className="ml-2" src={stop} alt="" />
                    }
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}