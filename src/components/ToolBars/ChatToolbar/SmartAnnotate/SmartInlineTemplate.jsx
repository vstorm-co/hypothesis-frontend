import { useSelector } from "react-redux";

import braces from '../../../../assets/braces.svg';
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export function SmartInlineTemplate(props) {
  const templates = useSelector(state => state.templates.useTemplates);
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const selectedIndex = useSignal(0);

  useEffect(() => {
    selectedIndex.value = 0;
    document.addEventListener('keydown', handleKeyboard);

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    }
  }, [props.showPrePill, props.prePillContent]);

  function handleKeyboard(e) {
    if (props.showPrePill) {
      if (e.key === 'Enter') {
        props.handleUseInlineTemplate(templates.filter(temp => temp.name.toLowerCase().trim().includes(props.prePillContent))[selectedIndex.value]);
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

  return (
    <div className={'absolute shadow-2xl-smart-inline -top-[8.9rem] left-1/2 -translate-x-1/2 z-50 border border-b-0 border-[#DBDBDB] rounded-t ' + (props.showPrePill ? 'block' : 'hidden')}>

      <div className={'templates-inline-list bg-white max-h-[140px] w-[240px] overflow-auto'}>
        {templates?.filter(temp => (temp.name.toLowerCase().trim().includes(props.prePillContent) && temp.uuid != currentTemplate.uuid)).map((template, index) => (
          <div onClick={() => props.handleUseInlineTemplate(template)} className={(`item-${index}`) + ' max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow ' + (selectedIndex.value === index ? 'box-shadow' : '')}>
            <img className="w-4" src={braces} alt="" />
            <div className={'max-w-full truncate ml-[5px] text-sm  leading-6'}>
              {template.name}
            </div>
          </div>
        ))}
      </div>
      <div className={'text-xs bg-white max-h-[93px] border-t w-[240px] overflow-auto text-[#747474] rounded py-2 text-center'}>
        (Press enter to insert)
      </div>
    </div>
  )
}