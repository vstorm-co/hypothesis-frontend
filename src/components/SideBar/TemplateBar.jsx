import { useLocation } from 'preact-iso';
import { useDispatch, useSelector } from 'react-redux';
import { templatesActions } from '../../store/templates-slice';
import { chatsActions } from '../../store/chats-slice';
import { selectTemplate } from '../../store/templates-slice';

import braces from '../../assets/braces.svg'

export function TemplateBar(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  const callSelectTemplate = () => {
    location.route(`/templates/${props.TemplateData.uuid}`);
    dispatch(selectTemplate(props.TemplateData.uuid));
    dispatch(chatsActions.setCurrentChat({ messages: [] }));
  }

  function isSelected() {
    return props.TemplateData.uuid === currentTemplate.uuid
  }

  return (
    <div onClick={callSelectTemplate} className={"flex items-center py-2 px-2 rounded cursor-pointer " + (isSelected() ? 'bg-[#595959]' : 'hover:bg-[#0F0F0F]')}>
      <img className="w-4" src={braces} alt="" />
      <div className="font-base text-sm leading-6 ml-2">
        {props.TemplateData.name}
      </div>
    </div>
  )
}