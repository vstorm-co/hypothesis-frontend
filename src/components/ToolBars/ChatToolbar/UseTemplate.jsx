import { useSelector } from 'react-redux';
import { signal } from '@preact/signals';

import braces from '../../../assets/braces.svg';

const isVisible = signal(false);

function toggleVisible() {
  isVisible.value = !isVisible.value
}


export function UseTemplate(props) {
  const templates = useSelector(state => state.templates.templates);

  return (
    <div className={'relative'}>
      <div onClick={toggleVisible} className={'border border-b-0 rounded-t border-[#DBDBDB] w-8 h-8 flex items-center justify-center'}>
        <img src={braces} alt="" />
      </div>
      <div className={"absolute border rounded left-8 w-5/12 bottom-12 p-2 transform bg-[#202020] text-white " + (isVisible.value ? '' : 'hidden')}>
        {templates.map(template => (
          <div onClick={() => { props.TemplatePicked(template); toggleVisible() }} className={'p-2 hover:bg-[#0F0F0F] cursor-pointer rounded-lg'}>{template.name}</div>
        ))}
      </div>
    </div>

  )
}