// @ts-nocheck
import { useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useSignal } from '@preact/signals';
import { PromptInput } from '../components/PromptInput';

import { TemplateToolBar } from '../components/ToolBars/TemplateToolbar/TemplateToolBar';
import { selectTemplate, updateTemplate } from '../store/templates-slice';
import { showToast } from '../store/ui-slice';

import { Toast } from '../components/Toast';
import { Loading } from '../components/Loading';
import { chatsActions } from '../store/chats-slice';
import { ToolbarHelp } from '../components/Tooltips/ToolbarHelp';

export function Template(props) {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const promptSaved = useSignal(true);
  const editTitle = useSignal(false);

  const titleInputRef = useRef();

  useEffect(() => {
    dispatch(selectTemplate(props.matches.id));
    dispatch(chatsActions.setCurrentChat({ uuid: null }));
  }, [window.location.href]);

  function handleToggleEditTitle(tgl) {
    editTitle.value = tgl;
  }

  function saveContent({ rawInput, rawPreview }) {
    dispatch(updateTemplate({
      uuid: currentTemplate.uuid,
      name: currentTemplate.name,
      content: rawPreview,
      content_html: rawInput,
      visibility: currentTemplate.visibility,
    }));

    dispatch(showToast({ content: `Template saved` }))

    promptSaved.value = true;
  }

  function callEditTemplateTitle(event) {
    if (event.keyCode === 13) {
      dispatch(updateTemplate({ uuid: currentTemplate.uuid, name: event.target.value, share: currentTemplate.share, organization_uuid: currentTemplate.organization_uuid, visibility: currentTemplate.visibility }));
      editTitle.value = false;
    }
  }

  if (!currentTemplate.uuid) {
    return (
      <div className={'w-full h-[100vh] flex justify-center pt-20'}>
        <Loading />
      </div>
    )
  } else {
    return (
      <div className={'flex w-full mx-4 page-template'} >
        <div>
        </div>
        <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
          <div className="h-[100vh] flex flex-col pt-4 sm:pb-2">
            <div className={'flex items-center py-4  border-b border-[#DBDBDB] relative'}>
              <div onClick={() => { handleToggleEditTitle(true) }} class="flex items-center w-full cursor-pointer">
                <div className={'text-lg leading-6 font-bold py-2 max-h-[156px] overflow-hidden text-[#595959] ' + (editTitle.value ? 'hidden' : '')}>
                  {currentTemplate.name}
                </div>
                <div className={'w-full ' + (editTitle.value ? '' : 'hidden')}>
                  <div className={'border p-2 bg-[#FAFAFA] border-[#DBDBDB] rounded w-full flex items-center'}>
                    <input ref={titleInputRef} value={currentTemplate.name} onKeyDown={(e) => { callEditTemplateTitle(e); }} className={'text-lg text-[#595959] font-bold leading-6 focus:outline-none bg-[#FAFAFA] w-full'} type="text" />
                    <div onClick={(e) => { handleToggleEditTitle(false); e.stopPropagation() }} className={'pr-1 cursor-pointer'}>
                      <svg width="10" height="11" viewBox="0 0 10 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.32179 2.58465L9.24249 2.67158L6.41385 5.499L9.24249 8.32843C9.63302 8.71896 9.63302 9.35212 9.24249 9.74265C8.88201 10.1031 8.31478 10.1309 7.92249 9.82583L7.82828 9.74265L4.99985 6.914L2.17142 9.74265C1.25719 10.6569 -0.100321 9.35479 0.677915 8.41536L0.757211 8.32843L3.58485 5.5L0.757211 2.67158C0.366687 2.28105 0.366687 1.64789 0.757211 1.25736C1.11769 0.89688 1.68493 0.86915 2.07722 1.17417L2.17142 1.25736L4.99985 4.085L7.82828 1.25736C8.71395 0.371694 10.0156 1.56601 9.38857 2.49559L9.32179 2.58465Z" fill="#747474" />
                      </svg>
                    </div>
                  </div>
                  <div className={'text-[10px] mt-0.5 py-2 pr-2 -mb-3 text-right text-[#747474]'}>
                    press 'Enter' to confirm
                  </div>
                </div>
              </div>

              <div className={'ml-5 shrink-0'}>
                <TemplateToolBar />
              </div>
            </div>
            <div className={'relative mt-auto sm:mt-4'}>
              <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
                Prompt
              </div>
              <div className={'relative'}>
                <PromptInput
                  Icon="nostop"
                  blockSending={false}
                  WSsendMessage={() => { }}
                  SubmitButtonText={'Save Template'}
                  handleSubmitButton={(value) => { saveContent(value) }}
                  SecondButton={false}
                  SecondButtonText={''}
                  handleSecondButton={() => { }}
                  SetBlockOnSubmit={true}
                  unBlockOnEdit={true}
                  clearInputOnSubmit={false}
                  handleSetBlock={(val) => promptSaved.value = val}

                  DisableProcessing={true}
                  UseTemplatePosition={'left'}
                  UseFilePosition={'right'}
                  InitialInput={currentTemplate.content_html ? currentTemplate.content_html : currentTemplate.content}
                  forceFocus={currentTemplate.uuid}
                  hideAnnotate={true}
                />
                <div className={'absolute bottom-0 text-[#747474] text-xs self-start py-2'}>
                  <ToolbarHelp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}