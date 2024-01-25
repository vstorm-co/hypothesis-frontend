import { useSignal } from "@preact/signals";
import { useSelector } from "react-redux";
import { UseTemplate } from "./ToolBars/ChatToolbar/UseTemplate";
import { ReturnResponse } from "./ToolBars/TemplateToolbar/ReturnResponse";
import { useEffect, useRef } from "preact/hooks";

import send from '../assets/send.svg';
import stop from '../assets/stop.svg';
import braces from '../assets/braces.svg';
import { InlineTemplate } from "./InlineTemplate";
import { route } from "preact-router";

export function PromptInput(props) {
  const user = useSelector(state => state.user.currentUser);
  const templates = useSelector(state => state.templates.useTemplates);

  const useTemplateVisible = useSignal(false);
  const promptMode = useSignal('write');
  const caret = useSignal(null);

  const input = useSignal('');
  const preview = useSignal('');

  const showPrePill = useSignal(false);
  const prePillContent = useSignal('');

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
  }

  const generatePreview = () => {
    const parser = new DOMParser();

    let targetPreview = input.value;
    let htmlArray = [];

    let htmlText = parser.parseFromString(targetPreview, 'text/html');
    let currentTemplates = htmlText.querySelectorAll('span.pill');

    while(currentTemplates.length > 0){
      currentTemplates.forEach(temp => {
        if (temp.dataset.content) {
          let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
          targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content_html);
        }
      });

      htmlText = parser.parseFromString(targetPreview, 'text/html');
      currentTemplates = htmlText.querySelectorAll('span.pill');
    }

    preview.value = targetPreview;
  }

  function handleSubmit() {
    const parser = new DOMParser();

    let targetPreview = input.value;

    let htmlText = parser.parseFromString(targetPreview, 'text/html');
    let currentTemplates = htmlText.querySelectorAll('span.pill');
    let lastPreview = targetPreview;

    while(currentTemplates.length > 0){
      lastPreview = targetPreview;
      currentTemplates.forEach(temp => {
        if (temp.dataset.content) {
          let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
          targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content_html);
        }
      });

      htmlText = parser.parseFromString(targetPreview, 'text/html');
      currentTemplates = htmlText.querySelectorAll('span.pill');
    }

    let returnBoxes = htmlText.querySelectorAll('div.return-box, span.return-box-new');

    returnBoxes.forEach(b => {
      targetPreview = targetPreview.replace(b.outerHTML, '↩');
      lastPreview = lastPreview.replace(b.outerHTML, '↩');
    });

    targetPreview = targetPreview.replace("&nbsp;", "").replace("<br>", "").replace(/[\r\n]/g, "");

    let promptArray = targetPreview.split('↩');
    let htmlArray = lastPreview.split('↩');

    if(promptArray.length > 1){
      promptArray = promptArray.map((p, index) => {
        return {
          prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
          html: htmlArray[index].replace("&nbsp;", "").trim(),
        };
      });
    } else {
      promptArray = promptArray.map((p, index) => {
        return {
          prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
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

  function handleKeyDown(event) {
    if (showPrePill.value && (event.key === 'Enter' || event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
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

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="mt-auto shrink-0 input-form">
      <InlineTemplate handleUseInlineTemplate={(template) => handleUseInlineTemplate(template)} showPrePill={showPrePill.value} prePillContent={prePillContent.value} />
      {templates?.length > 0 &&
        <div className={'flex'}>
          <UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={props.UseTemplatePosition ? props.UseTemplatePosition : 'top'} TemplatePicked={handleUseTemplate} />
          <ReturnResponse ReturnResponse={handleReturnResponse} />
          <div className={'ml-auto flex items-center justify-center'}>
            <div onClick={() => { promptMode.value = 'write' }} className={'write-button ' + (promptMode.value === 'write' ? 'active' : '')}>
              Write
            </div>
            <div onClick={() => { promptMode.value = 'preview'; generatePreview() }} className={'preview-button ' + (promptMode.value === 'preview' ? 'active' : '')}>
              Preview
            </div>
          </div>
        </div>}
        <div
          data-placeholder={props.blockSending && !props.DisableProcessing ? 'Processing...' : 'Enter a prompt...'}
          spellCheck={false}
          ref={InputRef}
          contentEditable={promptMode.value === 'write'}
          onKeyDown={promptMode.value === 'write' ? handleKeyDown : () => {console.log("AAAA")}}
          onKeyUp={promptMode.value === 'write' ? handleKeyUp : () => {}}
          onClick={promptMode.value === 'write' ? (e) => {handlePillClick(e); saveCaret()} : () => {}}
          onInput={promptMode.value === 'write' ? e => handleOnInput(e) : () => {}}
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
      <div className={'flex gap-4 mt-2 justify-end'}>
        {props.SecondButton &&
          <button type="button" onClick={() => props.handleSecondButton()} className="text-[#595959] text-sm leading-6 font-bold bg-transparent py-2 px-4 rounded">{props.SecondButtonText}</button>
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
  )
}