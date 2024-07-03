import { useSignal } from "@preact/signals";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "preact/hooks";
import { route } from "preact-router";
import { SmartInlineTemplate } from "./SmartInlineTemplate";
import { SelectModel } from "../SelectModel";

export function ResponseTemplateInput(props) {
  const currentChat = useSelector(state => state.chats.currentChat);
  const templates = useSelector(state => state.templates.useTemplates);

  const useTemplateVisible = useSignal(false);
  const promptMode = useSignal('write');
  const caret = useSignal(null);

  const input = useSignal('');
  const preview = useSignal('');

  const showPrePill = useSignal(false);
  const prePillContent = useSignal('');

  const showUseFile = useSignal(false);

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
    if (props.loadPrompt) {
      if (currentChat.uuid != null) {
        let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

        if (hChats) {
          let target = hChats.find(c => c.uuid === currentChat.uuid);
          // console.log(target.uuid, currentChat.uuid)
          if (target) {
            input.value = target.prompt
          } else {
            input.value = ''
          }

          handleSubmit()
        }
      }
    }
  }, [props.visible])

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
        targetPreview = targetPreview.replace(file.outerHTML, ``);
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
    }
  }

  function handleKeyDown(event) {
    if ((showPrePill.value) && (event.key === 'Enter' || event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
      event.preventDefault();
    } else {
    }

    handleSubmit()
  }

  function saveCaret() {
    let range = window.getSelection().getRangeAt(0);
    caret.value = range;

    handleSubmit();
  }

  function handleOnInput(e) {
    let currentText = e.currentTarget.innerHTML
    input.value = currentText;
    saveCaret();

    let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

    if (hChats) {
      let index = hChats.findIndex(c => c.uuid === currentChat.uuid);
      if (index != -1) {
        hChats[index].prompt = input.value;
      } else {
        let data = { uuid: currentChat.uuid, prompt: input.value };
        hChats = [...hChats, data];
      }

      localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
    } else {
      let data = { uuid: currentChat.uuid, prompt: input.value };
      hChats = [data];
      localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
    }
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

      handleSubmit();
    }, 200);

  }

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="mt-auto shrink-0 response-template-input-form relative">
      <SmartInlineTemplate handleUseInlineTemplate={(template) => handleUseInlineTemplate(template)} showPrePill={showPrePill.value} prePillContent={prePillContent.value} />
      {templates?.length > 0 &&
        <div className={'flex justify-end'}>
          {/* <UseTemplate Visible={useTemplateVisible.value} onToggleVisible={handleToggleVisible} Position={props.UseTemplatePosition ? props.UseTemplatePosition : 'top'} TemplatePicked={handleUseTemplate} /> */}
          <div className={'ml-4 flex items-center justify-center'}>
            <SelectModel />
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
        onKeyDown={promptMode.value === 'write' ? handleKeyDown : () => { }}
        onKeyUp={promptMode.value === 'write' ? handleKeyUp : () => { }}
        onClick={promptMode.value === 'write' ? (e) => { handlePillClick(e); saveCaret() } : () => { }}
        onInput={promptMode.value === 'write' ? e => handleOnInput(e) : () => { }}
        dangerouslySetInnerHTML={{ __html: promptMode.value === 'write' ? input.value : preview.value }} className={"msg min-h-[72px] " + (promptMode.value === 'write' ? 'write' : 'preview') + '-box'}
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
    </form>
  )
}