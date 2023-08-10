import { signal } from '@preact/signals';

const view = signal('justMe');

function Select() {
  if (view.value === 'justMe') {
    view.value = 'organization'
  } else {
    view.value = 'justMe';
  }
}

export function SelectView() {
  return (
    <div className="bg-[#595959] mt-2.5 rounded">
      <div className="font-bold text-sm flex justify-center items-center p-0.5 leading-6">
        <div onClick={Select} className={"text-center w-full rounded cursor-pointer SelectJustMe p-1 " + (view.value === 'justMe' ? 'bg-[#202020]' : '')}>Just Me</div>
        <div onClick={Select} className={"text-center w-full rounded cursor-pointer SelectJustMe p-1 " + (view.value === 'organization' ? 'bg-[#202020]' : '')}>Organization</div>
      </div>
    </div>
  )
}