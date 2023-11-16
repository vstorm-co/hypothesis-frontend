import { useState, useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';

import { TemplateToolBar } from '../components/ToolBars/TemplateToolbar/TemplateToolBar';
import { selectTemplate, updateTemplate } from '../store/templates-slice';
import { showToast } from '../store/ui-slice';

import { Toast } from '../components/Toast';
import { UseTemplate } from '../components/ToolBars/ChatToolbar/UseTemplate';

export function Template(props) {
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState('');
  const [promptSaved, setPromptSaved] = useState(true);
  const [promptMode, setPromptMode] = useState('write');
  const dispatch = useDispatch();

  const templateRef = useRef();

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  useEffect(() => {
    dispatch(selectTemplate(props.matches.id));
    setTimeout(() => {
      templateRef.current.focus();
    }, 100)
  }, []);

  useEffect(() => {
    setInput(currentTemplate.content_html ? currentTemplate.content_html : currentTemplate.content);
    setPromptMode('write');
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(templateRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      templateRef.current.focus();
      range.detach()
    }, 100);
  }, [currentTemplate.uuid])

  function handleKeyDown(event) {
    setPromptSaved(false);
  }

  const generatePreview = () => {
    const parser = new DOMParser();
    const htmlText = parser.parseFromString(input, 'text/html');

    let templates = htmlText.querySelectorAll('span');

    let textStripped = input.replace(/<span class=("">.*)>.*?<\/span>/g, '');
    console.log(input, textStripped);
    // let textStripped = input.replace(/<(?!br\s*\/?)[^>]+>/g, '');

    let targetPreview = textStripped;

    templates.forEach(temp => {
      if (temp.dataset.content) {
        targetPreview = targetPreview.replace(temp.innerHTML, temp.dataset.content)
      }
    });

    setPreview(targetPreview);
  }

  function saveContent(ev, title) {
    const parser = new DOMParser();
    const htmlText = parser.parseFromString(input, 'text/html');

    let templates = htmlText.querySelectorAll('span');

    let textStripped = input.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '');

    let targetPreview = textStripped;

    templates.forEach(temp => {
      if (temp.dataset.content) {
        targetPreview = targetPreview.replace(temp.innerHTML, temp.dataset.content)
      }
    });

    dispatch(updateTemplate({ uuid: currentTemplate.uuid, name: title ? title : currentTemplate.name, content: targetPreview, content_html: input }));

    dispatch(showToast({ content: `Template saved` }))

    if (!title) {
      setPromptSaved(true);
    }
  }

  function handleUseTemplate(template) {
    setInput(`${input ? input : ''} <span contenteditable='false' data-content='${template.content}' class="py-1 px-2 bg-[#747474] rounded text-white text-sm">{} ${template.name}</span>`);
    setPromptSaved(false);
  }

  return (
    <div className={'flex w-full mx-4'} >
      <div>
      </div>
      <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
        <div className="h-[100vh] flex flex-col pt-28 pb-2">
          <div className={'flex justify-between items-center relative'}>
            <div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
              {currentTemplate.name}
            </div>

            <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
              <Toast />
            </div>

            <div>
              <TemplateToolBar callEditTemplate={saveContent} />
            </div>
          </div>
          <div className={'mt-12'}>
            <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
              Prompt
            </div>
            <form onSubmit={saveContent} className="">
              <div className={'flex'}>
                <UseTemplate TemplatePicked={handleUseTemplate} />
                <div className={'ml-auto flex items-center justify-end'}>
                  <div onClick={() => { setPromptMode('write') }} className={'px-4 cursor-pointer py-1 border-[#DBDBDB] border-b-0 border-b-white -mb-[1px] rounded-t ' + (promptMode === 'write' ? 'border bg-[#F2F2F2]' : '')}>
                    Write
                  </div>
                  <div onClick={() => { generatePreview(); setPromptMode('preview'); }} className={'px-4 cursor-pointer py-1 -mb-[1px] border-[#DBDBDB] border-b-0 rounded-t ' + (promptMode === 'preview' ? 'border bg-white' : '')}>
                    Preview
                  </div>
                </div>
              </div>
              {promptMode === 'write' &&
                <div ref={templateRef} contentEditable={true} onKeyDown={handleKeyDown} onInput={e => setInput(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: input }} className="msg w-full h-[156px] bg-[#F2F2F2] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
                  {input}
                </div>}
              {promptMode === 'preview' &&
                <div dangerouslySetInnerHTML={{ __html: preview }} contentEditable={false} className="msg w-full h-[156px] templatePreview bg-white border overflow-auto rounded-t-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
                  {preview}
                </div>
              }
            </form>
            <div className="flex justify-end items-center mt-2 gap-x-4">
              {/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
              <button onClick={saveContent} type="submit" disabled={promptSaved} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
                {promptSaved &&
                  'Saved'
                }
                {!promptSaved &&
                  'Save Prompt'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}