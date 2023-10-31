// @ts-nocheck
import { useSelector, useDispatch } from 'react-redux';
import { signal } from '@preact/signals';
import { route } from 'preact-router';
import { useRef, useEffect } from 'preact/hooks';
import { createTemplate, deleteTemplate, updateTemplate } from '../../../store/templates-slice';


import dots from '../../../assets/dots.svg';
import bin from '../../../assets/bin.svg';
import duplicate from '../../../assets/duplicate.svg';

const confirmDelete = signal(false);
const showEdit = signal(false);

function toggleEdit() {
  showEdit.value = !showEdit.value;
}

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}

function outsideClickHanlder(ref) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        showEdit.value = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    }
  }, [ref])
}

export function Edit(props) {
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const dispatch = useDispatch();

  const templateEditRef = useRef(null);
  outsideClickHanlder(templateEditRef);

  function callDeleteTemplate() {
    dispatch(deleteTemplate(currentTemplate.uuid));
    route('/');
    toggleConfirmDelete();
    toggleEdit();
    props.onToggle();
  }

  const editTemplateShare = (tgl) => {
    updateTemplateShare(tgl);
  }

  const updateTemplateShare = (tgl) => {
    // dispatch(updateChat({
    //   uuid: currentChat.uuid,
    //   visibility: tgl,
    //   organization_uuid: tgl === "organization" ? user.organization_uuid.toString() : null
    // }));
  }

  function editTemplateTitle(event) {
    props.callEditTemplate(null, event.target.value);
  }

  function duplicateTemplate() {
    dispatch(createTemplate({ name: `Copy of ${currentTemplate.name}`, content: currentTemplate.content }))
  }

  return (
    <div ref={templateEditRef} className="relative">
      <div onClick={toggleEdit} className={"p-1 border border-[#DBDBDB] rounded-r cursor-pointer"}>
        <div className={"p-1 hover:bg-[#F2F2F2] " + (showEdit.value ? 'bg-[#F2F2F2]' : '')}>
          <img className="w-4 rotate-90" src={dots} alt="edit" />
        </div>
      </div>
      <div className={"absolute border rounded right-0 top-10 bg-white " + (showEdit.value ? '' : 'hidden')}>
        <div className="border-b p-2">
          <div className="text-xs font-bold text-[#747474] mb-1">
            Title
          </div>
          <input value={currentTemplate.name} onChangeCapture={(event) => { editTemplateTitle(event) }} type="text" className="bg-[#F2F2F2] border border-[#DBDBDB] rounded focus:outline-none p-2" />
          <div className={'text-[10px] mt-0.5 text-right text-[#747474]'}>
            press 'Enter' to confirm
          </div>
        </div>
        <div className="border-b p-2">
          <div onClick={duplicateTemplate} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
            <img src={duplicate} alt="" />
            <div className={'ml-2'}>
              Duplicate template
            </div>
          </div>
        </div>

        <div className={'p-1.5'}>
          <div onClick={toggleConfirmDelete} className={'flex p-1.5 hover:bg-[#F2F2F2] rounded cursor-pointer'}>
            <img src={bin} alt="" />
            <div className={'ml-2'}>
              Delete Template
            </div>
          </div>
          <div className={'absolute right-0 rounded -bottom-[5.8rem] flex flex-col bg-[#020202] text-white w-[350px] ' + (confirmDelete.value ? '' : 'hidden')}>
            <div className='px-4 py-2'>
              Are you sure you want to delete this template?
            </div>
            <div className='flex justify-center items-center gap-4 border-t border-[#747474] py-2'>
              <div onClick={toggleConfirmDelete} className={'px-2 py-1 cursor-pointer'}>Cancel</div>
              <div onClick={callDeleteTemplate} className={'bg-[#EF4444] px-2 py-1 rounded cursor-pointer'}>Delete</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}