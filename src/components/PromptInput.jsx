import { useSignal } from "@preact/signals";
import { useDispatch, useSelector } from "react-redux";
import { UseTemplate } from "./ToolBars/ChatToolbar/UseTemplate";
import { ReturnResponse } from "./ToolBars/TemplateToolbar/ReturnResponse";
import { useEffect, useRef } from "preact/hooks";

import send from '../assets/send.svg';
import stop from '../assets/stop.svg';
import braces from '../assets/braces.svg';
import { InlineTemplate } from "./InlineTemplate";
import { UseFile } from "./ToolBars/ChatToolbar/UseFile";
import { route } from "preact-router";
import { SmartAnnotate } from "./ToolBars/ChatToolbar/SmartAnnotate";
import { hSliceActions } from "../store/h-slice";
import { SelectModel } from "./ToolBars/ChatToolbar/SelectModel";
import { MobileMenu } from "./ToolBars/ChatToolbar/MobileMenu";



export function PromptInput(props) {
  const user = useSelector(state => state.user.currentUser);
  const currentChat = useSelector(state => state.chats.currentChat);
  const templates = useSelector(state => state.templates.useTemplates);
  const userFiles = useSelector(state => state.files.files);
  const showAnnotateLogs = useSelector(state => state.h.showLogs);

  const dispatch = useDispatch();

  const useTemplateVisible = useSignal(false);
  const promptMode = useSignal('write');
  const caret = useSignal(null);

  const input = useSignal('');
  const preview = useSignal('');

  const showPrePill = useSignal(false);
  const prePillContent = useSignal('');

  const showUseFile = useSignal(false);

  function toggleUseFile(tgl) {
    if (tgl != undefined) {
      showUseFile.value = tgl;
    } else {
      showUseFile.value = !showUseFile.value;
    }
  }

  const InputRef = useRef();

  function setRange() {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(InputRef.current, InputRef.current.childNodes.length);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    range.detach();

    saveCaret();
  };

  useEffect(() => {
    setRange();
  }, [promptMode.value])

  useEffect(() => {
    setRange();

    if (props.InitialInput) {
      input.value = props.InitialInput
    }
  }, [])

  useEffect(() => {
    input.value = '';
    preview.value = '';

    promptMode.value = 'write';
  }, [window.location.href])

  useEffect(() => {
    setTimeout(() => {
      setRange();
    }, 100)

    if (props.InitialInput) {
      input.value = props.InitialInput
    }
  }, [props.forceFocus])

  function handleToggleVisible(tgl) {
    if (tgl != undefined) {
      useTemplateVisible.value = tgl;
    } else {
      useTemplateVisible.value = !useTemplateVisible.value;
    }
  }

  function handlePillClick(e) {
    e.stopPropagation();
    const target = e.target.closest('.write-box .pill');

    if (target) {
      if (e.ctrlKey || e.metaKey) {
        window.open(`/templates/${target.dataset.content}`);
      } else {
        route(`/templates/${target.dataset.content}`);
      }
    }
  }

  function handleReturnResponse() {
    let element = document.createElement('span');
    element.innerText = `↩`;
    element.setAttribute("contenteditable", 'false');
    element.classList.add('return-box-new');

    caret.value.insertNode(element);

    caret.value.setStartAfter(element);
    caret.value.setEndAfter(element);

    const space = document.createTextNode(' ');
    caret.value.insertNode(space);

    caret.value.collapse(false);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(caret.value);
    caret.value.detach();

    setTimeout(() => {
      input.value = `${InputRef.current.innerHTML}`;
    }, 100);

    props.handleSetBlock(false);
  }

  function handleUseTemplate(template) {
    let element = document.createElement('span');
    element.innerText = `${template.name}`;
    element.title = `${template.content.replace('<div contenteditable="false" class="return-box px-1.5 rounded"></div>', '↩ ')}`
    element.title = `${template.content.replace('<span contenteditable="false" class="return-box-new">↩</span>', '↩ ')}`
    element.dataset.content = `${template.uuid}`;
    element.classList.add('pill');
    element.setAttribute("contenteditable", 'false');

    caret.value.insertNode(element);

    caret.value.setStartAfter(element);
    caret.value.setEndAfter(element);

    const space = document.createTextNode(' ');
    caret.value.insertNode(space);

    caret.value.collapse(false);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(caret.value);
    caret.value.detach();


    setTimeout(() => {
      input.value = `${InputRef.current.innerHTML}`;
      useTemplateVisible.value = false;
    }, 100);

    props.handleSetBlock(false);
  }

  const generatePreview = () => {
    const parser = new DOMParser();

    let targetPreview = input.value;
    let htmlArray = [];

    let htmlText = parser.parseFromString(targetPreview, 'text/html');
    let currentTemplates = htmlText.querySelectorAll('span.pill');

    while (currentTemplates.length > 0) {
      currentTemplates.forEach(temp => {
        if (temp.dataset.content) {
          let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
          targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content_html);
        }
      });

      htmlText = parser.parseFromString(targetPreview, 'text/html');
      currentTemplates = htmlText.querySelectorAll('span.pill');
    }

    htmlText = parser.parseFromString(targetPreview, 'text/html');
    preview.value = targetPreview;
  }

  function handleSubmit() {
    if (showPrePill.value || showUseFile.value) {
    } else {
      const parser = new DOMParser();

      let targetPreview = input.value;

      let htmlText = parser.parseFromString(targetPreview, 'text/html');
      let currentTemplates = htmlText.querySelectorAll('span.pill');
      let lastPreview = targetPreview;

      while (currentTemplates.length > 0) {
        lastPreview = targetPreview;
        currentTemplates.forEach(temp => {
          if (temp.dataset.content) {
            let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
            targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content_html);
          }
        });

        htmlText = parser.parseFromString(targetPreview, 'text/html');
        currentTemplates = htmlText.querySelectorAll('span.pill');
      };

      htmlText = parser.parseFromString(targetPreview, 'text/html');
      let currentFiles = htmlText.querySelectorAll('span.file-pill');

      currentFiles.forEach(file => {
        targetPreview = targetPreview.replace(file.outerHTML, `<<file:${file.dataset.content}>>`);
      })

      let returnBoxes = htmlText.querySelectorAll('div.return-box, span.return-box-new');

      returnBoxes.forEach(b => {
        targetPreview = targetPreview.replace(b.outerHTML, '↩');
        lastPreview = lastPreview.replace(b.outerHTML, '↩');
      });

      targetPreview = targetPreview.replace("&nbsp;", "").replace("<br>", "").replace(/[\r\n]/g, "");

      let promptArray = targetPreview.split('↩');
      let htmlArray = lastPreview.split('↩');

      if (promptArray.length > 1) {
        promptArray = promptArray.map((p, index) => {
          return {
            prompt: p.replace("&nbsp;", "").replace("<br>", "").trim(),
            html: htmlArray[index].replace("&nbsp;", "").trim(),
          };
        });
      } else {
        promptArray = promptArray.map((p, index) => {
          return {
            prompt: p.replace("&nbsp;", "").replace("<br>", "").trim(),
            html: input.value.replace("&nbsp;", "").trim(),
          };
        });
      }

      props.handleSubmitButton({ promptArray, rawInput: input.value.replace("&nbsp;", "").trim(), rawPreview: "", });

      if (props.clearInputOnSubmit) {
        input.value = '';
        preview.value = '';
      }

      if (props.setBlockOnSubmit) {
        props.handleSetBlock();
      }

      promptMode.value = 'write'

    }
  }

  function handleKeyDown(event) {
    if ((showPrePill.value || showUseFile.value) && (event.key === 'Enter' || event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
      event.preventDefault();
    } else {
      props.WSsendMessage(JSON.stringify({ type: 'user_typing', user: user.email }))
      if (props.unBlockOnEdit) {
        props.handleSetBlock(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        handleReturnResponse()
      } else if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (input.value.length > 0) {
          handleSubmit();
        }
      } else {

      }
    }
  }

  function saveCaret() {
    let range = window.getSelection().getRangeAt(0);
    caret.value = range;
  }

  function handleOnInput(e) {
    let currentText = e.currentTarget.innerHTML
    input.value = currentText;
    saveCaret();
  }

  function handleKeyUp() {
    if (input.value.indexOf('{{') != -1 && !showPrePill.value) {
      insertPrePillSpan();
    }

    let element = document.querySelector('.pre-pill');

    if (showPrePill.value && !element) {
      showPrePill.value = false;
    }


    if (showPrePill.value) {
      let target = document.querySelector('.pre-pill');
      prePillContent.value = target.innerText.trim().toLowerCase();
    }
  }

  function insertPrePillSpan() {
    let element = document.createElement('span');
    element.innerText = ` `;
    element.classList.add('pre-pill');
    element.setAttribute("contenteditable", 'true');

    caret.value.insertNode(element);

    const newRange = document.createRange();
    newRange.setStart(element, 0);
    newRange.setEnd(element, element.childNodes.length);

    newRange.collapse(false);

    element.focus();
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
    newRange.detach();

    showPrePill.value = true;

    setTimeout(() => {
      input.value = `${InputRef.current.innerHTML}`;
    }, 100);
  }

  function handleUseInlineTemplate(template) {
    input.value = input.value.replace("{{", "");

    setTimeout(() => {
      let element = InputRef.current.querySelector('.pre-pill');

      element.innerText = `${template.name}`;
      element.title = `${template.content.replace('<div contenteditable="false" class="return-box px-1.5 rounded"></div>', '↩ ')}`;
      element.title = `${template.content.replace('<span contenteditable="false" class="return-box-new">↩</span>', '↩ ')}`
      element.dataset.content = `${template.uuid}`;
      element.classList.remove('pre-pill');
      element.classList.add('pill');
      element.setAttribute("contenteditable", 'false');

      caret.value.setStartAfter(element);
      caret.value.setEndAfter(element);

      const space = document.createTextNode(' ');
      caret.value.insertNode(space);

      caret.value.collapse(false);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(caret.value);
      caret.value.detach();

    }, 100)

    setTimeout(() => {
      input.value = `${InputRef.current.innerHTML}`;

      showPrePill.value = false;
    }, 200);

  }

  function handleFilePicked(file) {
    let element = document.createElement('span');
    element.innerText = `${file.title}`;
    element.title = `${file.title}`;
    element.dataset.content = `${file.uuid}`;

    element.classList.add('file-pill');
    if (file.source_type === 'google-drive') {
      element.classList.add('google-pill');
    }

    element.setAttribute("contenteditable", 'false');

    caret.value.insertNode(element);

    caret.value.setStartAfter(element);
    caret.value.setEndAfter(element);

    const space = document.createTextNode(' ');
    caret.value.insertNode(space);

    caret.value.collapse(false);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(caret.value);
    caret.value.detach();


    setTimeout(() => {
      input.value = `${InputRef.current.innerHTML}`;
      showUseFile.value = false;
    }, 100);

    props.handleSetBlock(false);
  }

  return (
    <div className={'absolute w-[96vw] sm:w-full bottom-0 sm:bottom-2 -left-16 sm:left-0 z-[50] sm:z-[49] sm:relative bg-white p-4 sm:p-0 sm:bg-white'}>
      <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="mt-auto shrink-0 input-form">
        <InlineTemplate handleUseInlineTemplate={(template) => handleUseInlineTemplate(template)} showPrePill={showPrePill.value} prePillContent={prePillContent.value} />
        {templates?.length > 0 &&
          <div className={'flex shrink-0'}>
            <div className={'flex  shrink-0'}>
              <UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={props.UseTemplatePosition ? props.UseTemplatePosition : 'top'} TemplatePicked={handleUseTemplate} />
              <ReturnResponse ReturnResponse={handleReturnResponse} />
              <UseFile FilePicked={handleFilePicked} onToggleVisible={toggleUseFile} Visible={showUseFile.value} Position={props.UseFilePosition ? props.UseFilePosition : 'top'} />
              {!props.hideAnnotate &&
                <div className={'flex'}>
                  <SmartAnnotate />
                  <div onClick={() => { dispatch(hSliceActions.toggleShowLogs(!showAnnotateLogs)) }} className={'text-sm mx-2 flex cursor-pointer text-[#595959] items-center gap-2'}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.89543 0 2 0ZM2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6ZM4 14C4 12.8954 3.10457 12 2 12C0.89543 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16C3.10457 16 4 15.1046 4 14ZM16 14C16 13.4477 15.5523 13 15 13H7L6.88338 13.0067C6.38604 13.0645 6 13.4872 6 14C6 14.5523 6.44772 15 7 15H15L15.1166 14.9933C15.614 14.9355 16 14.5128 16 14ZM16 8C16 7.44772 15.5523 7 15 7H7L6.88338 7.00673C6.38604 7.06449 6 7.48716 6 8C6 8.55229 6.44772 9 7 9H15L15.1166 8.99327C15.614 8.93551 16 8.51284 16 8ZM16 2C16 1.44772 15.5523 1 15 1H7L6.88338 1.00673C6.38604 1.06449 6 1.48716 6 2C6 2.55228 6.44772 3 7 3H15L15.1166 2.99327C15.614 2.93551 16 2.51284 16 2Z" fill="currentColor" />
                    </svg>
                    <div className={'hidden lg:flex whitespace-nowrap'}>
                      {showAnnotateLogs ? 'Hide' : 'Show'} Logs
                    </div>
                  </div>
                </div>
              }
            </div>
            {/* <div>
            <MobileMenu Position={'top'} />
          </div> */}
            <div className={'ml-auto flex items-center justify-center'}>
              {props.showModels &&
                <SelectModel />
              }
              <div onClick={() => { promptMode.value = 'write' }} className={'shrink-0 write-button ' + (promptMode.value === 'write' ? 'active' : '')}>
                <div className={'lg:hidden'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.2929 4.29289C17.6534 3.93241 18.2206 3.90468 18.6129 4.2097L18.7071 4.29289L19.7071 5.29289C20.0676 5.65338 20.0953 6.22061 19.7903 6.6129L19.7071 6.70711L18.7071 7.70711C18.3466 8.06759 17.7794 8.09532 17.3871 7.7903L17.2929 7.70711L16.2929 6.70711C15.9324 6.34662 15.9047 5.77939 16.2097 5.3871L16.2929 5.29289L17.2929 4.29289Z" fill="#747474" />
                    <path d="M14.2929 7.29289C14.6534 6.93241 15.2206 6.90468 15.6129 7.2097L15.7071 7.29289L16.7071 8.29289C17.0676 8.65338 17.0953 9.22061 16.7903 9.6129L16.7071 9.70711L11.7071 15.7071C11.6564 15.7578 11.6005 15.8028 11.5404 15.8414L11.4472 15.8944L9.44722 16.8944C8.62072 17.3077 7.74586 16.4805 8.06186 15.6521L8.10557 15.5528L9.10557 13.5528C9.13762 13.4887 9.17641 13.4283 9.22123 13.3727L9.29289 13.2929L14.2929 7.29289Z" fill="#747474" />
                    <path d="M7 6C5.89543 6 5 6.89543 5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V11.6923C19 11.14 18.5523 10.6923 18 10.6923C17.4477 10.6923 17 11.14 17 11.6923V17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17V9C7 8.44772 7.44772 8 8 8L10.5 8C11.0523 8 11.5 7.55228 11.5 7C11.5 6.44772 11.0523 6 10.5 6H7Z" fill="#747474" />
                  </svg>
                </div>
                <div className={'hidden lg:block'}>
                  Write
                </div>
              </div>
              <div onClick={() => { promptMode.value = 'preview'; generatePreview() }} className={'preview-button ' + (promptMode.value === 'preview' ? 'active' : '')}>
                <div className={'lg:hidden'}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C12.3599 2 16 4.60004 16 8C16 11.4 12.3599 14 8 14C3.64005 14 0 11.4 0 8C0 4.60004 3.64005 2 8 2ZM8 4C4.62796 4 2 5.87711 2 8C2 10.1229 4.62796 12 8 12C11.372 12 14 10.1229 14 8C14 5.87711 11.372 4 8 4ZM10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8Z" fill="#747474" />
                  </svg>
                </div>
                <div className={'hidden lg:block'}>
                  Preview
                </div>
              </div>
            </div>
          </div>}
        <div
          data-placeholder={props.blockSending && !props.DisableProcessing ? 'Processing...' : 'Enter a prompt...'}
          spellCheck={false}
          ref={InputRef}
          contentEditable={promptMode.value === 'write' && !props.blockSending}
          onKeyDown={promptMode.value === 'write' ? handleKeyDown : () => { console.log("AAAA") }}
          onKeyUp={promptMode.value === 'write' ? handleKeyUp : () => { }}
          onClick={promptMode.value === 'write' ? (e) => { handlePillClick(e); saveCaret() } : () => { }}
          onInput={promptMode.value === 'write' ? e => handleOnInput(e) : () => { }}
          dangerouslySetInnerHTML={{ __html: promptMode.value === 'write' ? input.value : preview.value }} className={"msg min-h-[72px] " + (promptMode.value === 'write' ? 'write-box' : 'preview-box')}
        >
          {promptMode.value === 'write' ? input.value : preview.value}
        </div>
        {/* {promptMode.value === 'write' &&
        } */}
        {/* {promptMode.value === 'preview' &&
        <div spellCheck={false} dangerouslySetInnerHTML={{ __html: preview.value }} className="msg min-h-[72px] max-h-[156px] preview-box">
          {preview.value}
        </div>
      } */}
        <div className={'flex gap-1 mt-2 justify-end'}>
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
        </div>
      </form>
    </div>
  )
}