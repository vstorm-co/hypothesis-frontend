import { Edit } from './Edit';
import { ReturnResponse } from './ReturnResponse';

export function TemplateToolBar(props) {
  return (
    <div className="flex">
      <Edit callEditTemplate={props.callEditTemplate} />
    </div>
  )
}