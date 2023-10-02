import { Edit } from './Edit';
import { Share } from './Share';


export function ChatToolBar() {
  return (
    <div className="flex">
      <Share />
      <Edit />
    </div>
  )
}