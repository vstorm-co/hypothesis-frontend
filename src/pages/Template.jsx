// @ts-nocheck
import { useState, useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useSignal } from '@preact/signals';

import { TemplateToolBar } from '../components/ToolBars/TemplateToolbar/TemplateToolBar';
import { selectTemplate, updateTemplate } from '../store/templates-slice';
import { showToast } from '../store/ui-slice';

import { Toast } from '../components/Toast';
import { UseTemplate } from '../components/ToolBars/ChatToolbar/UseTemplate';
import { Loading } from '../components/Loading';
import { ReturnResponse } from '../components/ToolBars/TemplateToolbar/ReturnResponse';

export function Template(props) {
  const dispatch = useDispatch();
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const user = useSelector(state => state.user.currentUser);

  const [promptSaved, setPromptSaved] = useState(true);
  const [promptMode, setPromptMode] = useState('write');
  const [preview, setPreview] = useState('');
  const [input, setInput] = useState('');

  const templateRef = useRef();

  const useTemplateVisible = useSignal(false);
  const caret = useSignal(0);

  function handleInputChange(event) {
    saveCaret();
    setInput(event.target.value);
  }

  function setRange() {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(templateRef.current);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    templateRef.current.focus();
    range.detach();
  }

  useEffect(() => {
    dispatch(selectTemplate(props.matches.id));
    setPromptMode('write');
  }, []);

  useEffect(() => {
    setInput(currentTemplate.content_html ? currentTemplate.content_html : currentTemplate.content);

    setTimeout(() => {
      setRange();
      setPreview(currentTemplate.content);
    }, 100);
  }, [currentTemplate.uuid])

  function handleKeyDown(event) {
    setPromptSaved(false);
    if (input.lastIndexOf("<br>") != -1) {
      setInput(`${input.substring(0, input.lastIndexOf("<br>"))}`);
      setTimeout(() => {
        setRange();
      }, 100);
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      saveContent()
    }
  }

  function handleKeyUp() {
    if (input.lastIndexOf("{{") != -1) {
      useTemplateVisible.value = true;
    }
  }

  const generatePreview = () => {
    const parser = new DOMParser();
    const htmlText = parser.parseFromString(input, 'text/html');

    let templates = htmlText.querySelectorAll('span');

    let textStripped = input.replace(/<\/?span[^>]*>/g, "");

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

    let textStripped = input.replace(/<\/?span[^>]*>/g, "");

    let targetPreview = textStripped;
    templates.forEach(temp => {
      if (temp.dataset.content) {
        targetPreview = targetPreview.replace(temp.innerHTML, temp.dataset.content)
      }
    });

    dispatch(updateTemplate({
      uuid: currentTemplate.uuid,
      name: title ? title : currentTemplate.name,
      content: targetPreview,
      content_html: input
    }));

    dispatch(showToast({ content: `Template saved` }))

    if (!title) {
      setPromptSaved(true);
    }
  }

  function handleUseTemplate(template) {
    console.log(caret);
    console.log(input.substring(0, caret.value));
    console.log(input.substring(caret.value));
    let element = `<span contenteditable="false" class="pill" data-content="${template.content}">{} ${template.name}</span>`;
    setInput(input.substring(0, caret.value) + `${element}` + input.substring(caret.value));

    setTimeout(() => {
      setRange();
      useTemplateVisible.value = false;
    }, 100)

    // let tempElement = document.createElement('div');
    // tempElement.innerHTML = editorRef.current.innerHTML;

    // // Append the new element at the caret position
    // let children = tempElement.childNodes;

    // let newRange = document.createRange();
    // let newCaretPosition = range.startOffset + `{} ${template.name}`.length; // Assuming the new element has a length of 1
    // newRange.setStart(children[newCaretPosition], 0);
    // newRange.setEnd(children[newCaretPosition], 0);
    // window.getSelection().removeAllRanges();
    // window.getSelection().addRange(newRange);
    setPromptSaved(false);
  }

  function handleReturnResponse() {
    let pastedCode = `${input ? input : ''}\n<div contenteditable="false" class="return-box px-1.5 rounded"></div>`
    let codeWithEntities = pastedCode.replace(/[\r\n]+/g, '&#13;&#10;');
    setInput(codeWithEntities);
  }

  function handleToggleVisible() {
    useTemplateVisible.value = !useTemplateVisible.value;
    if (useTemplateVisible) {
      templateRef.current.focus();
    }
  }

  function saveCaret() {
    let range = window.getSelection().getRangeAt(0);
    let caretPosition = range.startOffset;

    caret.value = caretPosition;
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
                <TemplateToolBar callEditTemplate={saveContent} />
              </div>
            </div>
            <div className={'mt-4'}>
              <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
                Prompt
              </div>
              <form onSubmit={saveContent} className="">
                <div className={'flex'}>
                  <UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={'bottom'} TemplatePicked={handleUseTemplate} />
                  <ReturnResponse ReturnResponse={handleReturnResponse} />
                  <div className={'ml-auto flex items-center justify-end w-full'}>
                    <div onClick={() => { setPromptMode('write') }} className={'px-4 cursor-pointer py-1 border-[#DBDBDB] border-b-0 border-b-white -mb-[1px] rounded-t ' + (promptMode === 'write' ? 'border bg-[#FAFAFA] ' : '')}>
                      Write
                    </div>
                    <div onClick={() => { generatePreview(); setPromptMode('preview'); }} className={'px-4 cursor-pointer py-1 -mb-[1px] border-[#DBDBDB] border-b-0 rounded-t ' + (promptMode === 'preview' ? 'border bg-white' : '')}>
                      Preview
                    </div>
                  </div>
                </div>
                {promptMode === 'write' &&
                  <div ref={templateRef} contentEditable={true} onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} onClick={() => saveCaret()} onInput={e => setInput(e.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: input }} className="msg whitespace-pre-wrap write-box w-full min-h-[156px] max-h-[500px] 2xl:max-h-[685px] bg-[#FAFAFA] border overflow-auto rounded-tl-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
                    {input}
                  </div>}
                {promptMode === 'preview' &&
                  <div dangerouslySetInnerHTML={{ __html: preview }} contentEditable={false} className="msg preview-box w-full min-h-[156px] max-h-[500px] 2xl:max-h-[685px] templatePreview bg-white border overflow-auto rounded-t-none rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6">
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
}