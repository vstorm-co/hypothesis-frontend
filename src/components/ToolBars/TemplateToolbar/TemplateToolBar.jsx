import { useSelector } from 'react-redux';
import { Edit } from './Edit';

export function TemplateToolBar(props) {
  const user = useSelector(state => state.user.currentUser);
  const currentTemplate = useSelector(state => state.templates.currentTemplate);

  return (
    <div className="flex">
      <Edit callEditTemplate={props.callEditTemplate} />
    </div>
  )
}