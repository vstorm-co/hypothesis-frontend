import { signal } from '@preact/signals';
import { useDispatch } from 'react-redux';
import { createTemplate } from '../../../store/templates-slice';

import braces from '../../../assets/braces.svg';
import { useState } from 'preact/hooks';
import { uiActions } from '../../../store/ui-slice';

const showSaveAs = signal(false);
function toggleShowSaveAs() {
  showSaveAs.value = !showSaveAs.value;
}

export function SaveAsTemplate(props) {
  const dispatch = useDispatch();
  const [templateTitle, setTemplateTitle] = useState();

  function callCreateTemplate(e) {
    if (e.target.value.length > 1) {
      dispatch(createTemplate({ name: e.target.value, content: props.msg.content }));
      dispatch(uiActions.toggleToast({ content: 'Template created' }));
    }
    toggleShowSaveAs();
  }

  return (
    <div className={'relative'}>
      <div onClick={toggleShowSaveAs} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (showSaveAs.value ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4" src={braces} alt="edit" />
        </div>
      </div>
      <div className={"absolute z-50 border rounded right-0 top-10 bg-white " + (showSaveAs.value ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input onChangeCapture={(event) => callCreateTemplate(event)} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
          <div className={'text-[10px] mt-0.5 text-right text-[#747474]'}>
            press 'Enter' to confirm
          </div>
        </div>
      </div>
    </div>
  )
}