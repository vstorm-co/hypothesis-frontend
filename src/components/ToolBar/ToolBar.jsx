import { Edit } from './Edit';
import { Share } from './Share';


export function ToolBar() {
  return (
    <div className="flex">
      <Share />
      <Edit />
    </div>
  )
}