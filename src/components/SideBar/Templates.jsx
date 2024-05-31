import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, getTemplatesData, templatesActions } from '../../store/templates-slice';
import { TemplateBar } from './TemplateBar';
import plus from '../../assets/plus.svg';
import arrowDown from '../../assets/arrow-down.svg';
import { useEffect, useState } from 'preact/hooks';
import { Loading } from '../Loading';
import { Virtuoso } from 'react-virtuoso';
import { useSignal } from '@preact/signals';
import caretDown from '../../assets/caret-down.svg';

export function Templates() {
  const templates = useSelector(state => state.templates.templates);
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const user = useSelector(state => state.user.currentUser);
  const info = useSelector(state => state.templates.info);
  const ui = useSelector(state => state.ui);
  const dispatch = useDispatch();

  const [isScrolling, setIsScrolling] = useState(false);

  const showFadeBottom = useSignal(true);
  const showFadeTop = useSignal(false);

  const isFirstRender = useSignal(true);

  const expanded = useSignal(false);

  function handleExpand(val) {
    expanded.value = val;
  }


  function callCreateTemplate() {
    dispatch(createTemplate({ name: 'New Template', content: '' }));
  }

  useEffect(() => {
    let virtuosoScroll = document.querySelector('.templates div[data-testid="virtuoso-scroller"]');

    if (!isFirstRender.value) {
      if (virtuosoScroll.scrollTop + virtuosoScroll.clientHeight >= virtuosoScroll.scrollHeight - 10) {
        showFadeBottom.value = false;
      } else {
        showFadeBottom.value = true;
      }
    } else {
      isFirstRender.value = false
    }

    if (virtuosoScroll.scrollTop < 80) {
      showFadeTop.value = false
    } else {
      showFadeTop.value = true;
    }
  }, [isScrolling])

  return (
    <div className={"px-3 border-t border-[#747474] flex flex-col overflow-hidden " + (expanded.value ? 'flex-1' : 'h-0 pb-12')}>
      <div className="text-xs leading-6 font-bold flex items-center pl-2 py-4">
        <div onClick={() => handleExpand(!expanded.value)} className={'flex cursor-pointer'}>
          <img src={caretDown} alt="" className={'w-4 mr-1 transform ' + (expanded.value ? '' : '-rotate-90')} />
          <div>TEMPLATES</div> <div className={"ml-2 px-2 border border-[#595959] font-normal flex justify-center items-center rounded-[4px] " + ((info?.total > 0 && templates?.length > 0) ? '' : 'hidden')}>{info?.total}</div>
        </div>
        <div onClick={callCreateTemplate} class="flex items-center justify-center ml-auto font-normal text-sm px-3 bg-[#0F0F0F] border border-[#595959] rounded-[4px] py-0.5 cursor-pointer">
          <div>New</div> <img class="ml-1" src={plus} alt="" />
        </div>
      </div>
      {!ui.chatsLoading &&
        <div className={'flex flex-col overflow-y-auto relative templates'}>
          {/* {templates?.map(temp => (
            <TemplateBar TemplateData={temp} />
          ))} */}
          <Virtuoso
            style={{ height: '400px', scrollbarWidth: 'none' }}
            data={templates}
            topItemCount={currentTemplate.uuid ? 1 : 0}
            isScrolling={setIsScrolling}
            itemContent={(_, template) => (
              <TemplateBar TemplateData={template} />
            )}
          />
          <div className={"fadeBottom " + (showFadeBottom.value ? '' : 'hid')}></div>
          <div className={"fadeTop " + (showFadeTop.value ? '' : 'hid ') + (currentTemplate.uuid ? 'mt-6' : '')}></div>
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