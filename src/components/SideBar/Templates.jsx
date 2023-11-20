import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, getTemplatesData, templatesActions } from '../../store/templates-slice';
import { TemplateBar } from './TemplateBar';
import plus from '../../assets/plus.svg';
import arrowDown from '../../assets/arrow-down.svg';
import { useEffect, useState } from 'preact/hooks';
import { Loading } from '../Loading';

export function Templates() {
  const templates = useSelector(state => state.templates.templates);
  const user = useSelector(state => state.user.currentUser);
  const size = useSelector(state => state.templates.size);
  const info = useSelector(state => state.templates.info);
  const ui = useSelector(state => state.ui);
  const dispatch = useDispatch();

  const [loadSize, setLoadSize] = useState(0);

  function callCreateTemplate() {
    dispatch(createTemplate({ name: 'New Template', content: '' }));
  }

  useEffect(() => {
    if (info.total > 5) {
      setLoadSize(5);
    }
    if (info.total < 5) {
      setLoadSize(0);
    }

    if ((info.total - size) < 5) {
      setLoadSize(info.total - size);
    }
  }, [info.total]);

  function callLoadMore() {
    dispatch(templatesActions.setSize(size + loadSize));

    if (info.total > 20) {
      setLoadSize(10);
    }

    if (info.total < 5) {
      setLoadSize(0);
    }

    if ((info.total - (size + loadSize)) < 5) {
      setLoadSize(info.total - (size + loadSize));
    }

    dispatch(getTemplatesData());
  }

  return (
    <div className="mt-4">
      <div className="text-xs leading-6 font-bold mb-2 flex items-center pl-2">
        <div>Templates</div> <div className={"ml-2 w-6 h-6 border border-[#595959] flex justify-center items-center rounded-[4px] " + ((info?.total > 0 && templates?.length > 0) ? '' : 'hidden')}>{info?.total}</div>
        <div onClick={callCreateTemplate} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {!ui.chatsLoading &&
        <div>
          <div className={''}>
            {templates?.map(temp => {
              return temp.user_id === user.user_id ? <TemplateBar TemplateData={temp} /> : '';
            })}
          </div>
          {(loadSize > 0 && templates?.length > 0) && <div onClick={callLoadMore} className={"flex items-center py-2 px-2 rounded cursor-pointer border-dashed border border-[#595959]"}>
            <div className={'py-[2px] px-[3px]'}>
              <img className={"w-[10px] h-[12px]"} src={arrowDown} alt="" />
            </div>
            <div className="font-normal text-sm leading-6 ml-2">
              Load {loadSize} More
            </div>
          </div>}
          <div className={'text-[#747474] px-2 text-sm mt-2 ' + (templates?.length === 0 ? '' : 'hidden')}>
            No templates
          </div>
        </div>
      }
      {ui.chatsLoading &&
        <div className={'flex items-center justify-center pb-2'}>
          <Loading />
        </div>}

    </div >
  )
}