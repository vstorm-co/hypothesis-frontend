import { Edit } from './Edit';

export function TemplateToolBar(props) {
  return (
    <div className="flex">
      <Edit callEditTemplate={props.callEditTemplate} />
    </div>
  )
}