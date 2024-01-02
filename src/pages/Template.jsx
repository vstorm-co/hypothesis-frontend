// @ts-nocheck
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useSignal } from '@preact/signals';
import { PromptInput } from '../components/PromptInput';

import { TemplateToolBar } from '../components/ToolBars/TemplateToolbar/TemplateToolBar';
import { selectTemplate, updateTemplate, updateTemplateTitle } from '../store/templates-slice';
import { showToast } from '../store/ui-slice';

import { Toast } from '../components/Toast';
import { Loading } from '../components/Loading';

export function Template(props) {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const promptSaved = useSignal(true);

  useEffect(() => {
    dispatch(selectTemplate(props.matches.id));
  }, []);

  function saveTemplateTitle(title) {
    dispatch(updateTemplateTitle({ uuid: currentTemplate.uuid, name: title }));
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

    if (!title) {
      setPromptSaved(true);
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
      <div className={'flex w-full mx-4'} >
        <div>
        </div>
        <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
          <div className="h-[100vh] flex flex-col pt-4 pb-2">
            <div className={'flex items-center py-4 border-b border-[#DBDBDB] relative'}>
              <div className={'text-lg leading-6 font-bold max-h-[156px] overflow-hidden text-[#595959] '}>
                {currentTemplate.name}
              </div>

              <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
                <Toast />
              </div>

              <div className={'ml-auto shrink-0'}>
                <TemplateToolBar callEditTemplate={value => saveTemplateTitle(value)} />
              </div>
            </div>
            <div className={'mt-4'}>
              <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
                Prompt
              </div>
              <PromptInput
                Icon={'send'}
                blockSending={promptSaved.value}
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
                InitialInput={currentTemplate.content_html ? currentTemplate.content_html : currentTemplate.content}
                forceFocus={currentTemplate.uuid}
              />
            </div>
          </div>
        </div>
      </div >
    )
  }
}