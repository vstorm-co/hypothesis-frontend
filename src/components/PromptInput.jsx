import { useSignal } from "@preact/signals";
import { useSelector } from "react-redux";
import { UseTemplate } from "./ToolBars/ChatToolbar/UseTemplate";
import { ReturnResponse } from "./ToolBars/TemplateToolbar/ReturnResponse";
import { useEffect, useRef } from "preact/hooks";

import send from '../assets/send.svg';
import stop from '../assets/stop.svg';

export function PromptInput(props) {
  const user = useSelector(state => state.user.currentUser);
  const templates = useSelector(state => state.templates.useTemplates);

  const useTemplateVisible = useSignal(false);
  const promptMode = useSignal('write');
  const caret = useSignal(null);

  const input = useSignal('');
  const preview = useSignal('');

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
  }

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
    const htmlText = parser.parseFromString(input.value, 'text/html');

    let currentTemplates = htmlText.querySelectorAll('span');

    let targetPreview = input.value;

    currentTemplates.forEach(temp => {
      if (temp.dataset.content) {
        let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
        targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content)
      }
    });

    preview.value = targetPreview;
  }

  function handleSubmit() {
    const parser = new DOMParser();
    const htmlText = parser.parseFromString(input.value, 'text/html');
    let currentTemplates = htmlText.querySelectorAll('span');

    let targetPreview = input.value;
    let htmlArray = [];

    currentTemplates.forEach(temp => {
      if (temp.dataset.content) {
        let templateTarget = templates.find(t => t.uuid === temp.dataset.content);
        let targetHTML = templateTarget.content_html.split(`<div contenteditable="false" class="return-box px-1.5 rounded"></div>`);

        htmlArray = [...htmlArray, ...targetHTML];

        targetPreview = targetPreview.replace(temp.outerHTML, templateTarget.content);
      }
    });

    let rawPreview = targetPreview;

    let promptArray = targetPreview.split(`<div contenteditable="false" class="return-box px-1.5 rounded"></div>`);
    if (promptArray.length < 2) {
      promptArray = targetPreview.split(`<span contenteditable="false" class="return-box-new">↩</span>`);
    }

    promptArray = promptArray.map((p, index) => {
      if (htmlArray[index] !== undefined) {
        return {
          prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
          html: promptArray.length > 1 ? htmlArray[index].replace("&nbsp;", "").replace("<br>", "").replace("\n", "") : input.value,
        };
      } else {
        return {
          prompt: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
          html: p.replace("&nbsp;", "").replace("<br>", "").replace(/(<([^>]+)>)/gi, "").trim(),
        };
      }
    });

    props.handleSubmitButton({ promptArray, rawInput: input.value, rawPreview, });

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
    props.WSsendMessage(JSON.stringify({ type: 'user_typing', user: user.email }))
    if (props.unBlockOnEdit) {
      props.handleSetBlock(false);
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSubmit();
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

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="mt-auto shrink-0 input-form">
      {templates?.length > 0 &&
        <div className={'flex'}>
          <UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={'top'} TemplatePicked={handleUseTemplate} />
          <ReturnResponse ReturnResponse={handleReturnResponse} />
          <div className={'ml-auto flex items-center justify-center'}>
            <div onClick={() => { promptMode.value = 'write' }} className={'write-button ' + (promptMode.value === 'write' ? 'active' : '')}>
              Write
            </div>
            <div onClick={() => { promptMode.value = 'preview'; generatePreview(); }} className={'preview-button ' + (promptMode.value === 'preview' ? 'active' : '')}>
              Preview
            </div>
          </div>
        </div>}
      {promptMode.value === 'write' &&
        <div
          data-placeholder={props.blockSending ? 'Processing...' : 'Enter a prompt...'}
          spellCheck={false}
          ref={InputRef}
          contentEditable={true}
          onKeyDown={handleKeyDown}
          onClick={() => saveCaret()}
          onInput={e => handleOnInput(e)}
          dangerouslySetInnerHTML={{ __html: input.value }} className={"write-box msg min-h-[72px] max-h-[156px]"}
        >
          {input.value}
        </div>}
      {promptMode.value === 'preview' &&
        <div spellCheck={false} dangerouslySetInnerHTML={{ __html: preview.value }} className="msg min-h-[72px] max-h-[156px] preview-box">
          {preview.value}
        </div>
      }
      <div className={'flex gap-4 mt-2 justify-end'}>
        {props.SecondButton &&
          <button type="button" onClick={() => props.handleSecondButton()} className="text-[#595959] text-sm leading-6 font-bold bg-transparent py-2 px-4 rounded">{props.SecondButtonText}</button>
        }
        <button type="submit" disabled={(input.value.length === 0 && !props.blockSending)} className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">
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