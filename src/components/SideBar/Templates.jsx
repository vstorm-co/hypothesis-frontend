import { useDispatch, useSelector } from 'react-redux';
import { createTemplate } from '../../store/templates-slice';
import { TemplateBar } from './TemplateBar';
import plus from '../../assets/plus.svg';

export function Templates() {
  const templates = useSelector(state => state.templates.templates);
  const dispatch = useDispatch();

  function callCreateTemplate() {
    dispatch(createTemplate({ name: 'New Template', content: '' }));
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
        <div>Templates</div> <div class="ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px]">{templates?.length}</div>
        <div onClick={callCreateTemplate} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      <div className={''}>
        {templates?.map(temp => (
          <TemplateBar TemplateData={temp} />
        ))}
      </div>
      <div className={'text-center text-sm mt-2 ' + (false ? '' : 'hidden')}>
        No templates yet! go ahead create one
      </div>
    </div >
  )
}