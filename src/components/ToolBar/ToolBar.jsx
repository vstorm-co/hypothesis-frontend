import { signal } from '@preact/signals';

import { Edit } from './Edit';
import { Share } from './Share';
import { Delete } from './Delete';


const showEdit = signal(false);

function toggleEdit() {
  showEdit.value = !showEdit.value;
}

export function ToolBar() {
  return (
    <div className="flex">
      <Share />
      <Edit show={showEdit.value} onToggle={toggleEdit} />
    </div>
  )
}