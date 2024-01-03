import { useSelector } from "react-redux";

import braces from '../assets/braces.svg';
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export function InlineTemplate(props) {
  const templates = useSelector(state => state.templates.useTemplates);

  const selectedIndex = useSignal(0);

  useEffect(() => {
    selectedIndex.value = 0;
    document.addEventListener('keydown', handleKeyboard);

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    }
  }, [props.showPrePill]);

  function handleKeyboard(e) {
    if (props.showPrePill) {
      if (e.key === 'Enter') {
        props.handleUseInlineTemplate(templates[selectedIndex.value]);
      }
      if (e.code === 'ArrowDown' && selectedIndex.value != templates.length - 1) {
        selectedIndex.value = selectedIndex.value + 1;

        let list = document.querySelector(`.block .templates-inline-list`);
        let item = list.querySelector(`.item-${selectedIndex.value}`);

        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (e.code === 'ArrowUp' && selectedIndex.value != 0) {
        selectedIndex.value = selectedIndex.value - 1;

        let list = document.querySelector(`.block .templates-inline-list`);
        let item = list.querySelector(`.item-${selectedIndex.value}`);

        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function returnInlineTemplatePostion() {
    let element = document.querySelector('.pre-pill');
    if (element) {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - 50,
        top: rect.top - 140,
      }
    }
  }

  return (
    <div style={returnInlineTemplatePostion()} className={'fixed z-50 border border-[#DBDBDB] rounded ' + (props.showPrePill ? 'block' : 'hidden')}>
      <div className={'text-xs bg-white max-h-[93px] w-[240px] overflow-auto text-[#747474] rounded py-2 text-center'}>
        (Press enter to insert)
      </div>
      <div className={'templates-inline-list bg-white max-h-[93px] w-[240px] overflow-auto rounded'}>
        {templates.filter(temp => temp.name.toLowerCase().trim().includes(props.prePillContent)).map((template, index) => (
          <div onClick={() => props.handleUseInlineTemplate(template)} className={(`item-${index}`) + ' max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow ' + (selectedIndex.value === index ? 'box-shadow' : '')}>
            <img className="w-4" src={braces} alt="" />
            <div className={'max-w-full truncate ml-[5px] text-sm  leading-6'}>
              {template.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}