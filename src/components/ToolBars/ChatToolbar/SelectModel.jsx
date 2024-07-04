import { useDispatch, useSelector } from 'react-redux';
import OpenAi from '../../../assets/OpenAI-Logo.svg';
import Claude from '../../../assets/Claude.svg';
import Groq from '../../../assets/Groq.svg';
import angleDown from '../../../assets/angle-down.svg';
import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { uiActions } from '../../../store/ui-slice';

export function SelectModel() {
  const models = useSelector(state => state.ui.models);
  const currentModel = useSelector(state => state.ui.currentModel);
  const providersVisible = useSignal(false);
  const modelsVisible = useSignal(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const defaultModel = models.find(m => m.default === true);
    dispatch(uiActions.setCurrentModel(defaultModel));
  }, [models])

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          console.log(ref.current.classList);
          if (ref.current.classList.contains('providers')) {
            providersVisible.value = false;
          } else if (ref.current.classList.contains('models')) {
            modelsVisible.value = false;
          }
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  const modelListRef = useRef(null);
  const providersListRef = useRef(null);
  outsideClickHanlder(providersListRef);
  outsideClickHanlder(modelListRef);

  function handleProviderSelect(model) {
    dispatch(uiActions.setCurrentModel(model))
    providersVisible.value = false;
  }

  function handleModelSelect(model) {
    dispatch(uiActions.setCurrentModelSelected(model));
    modelsVisible.value = false;
  }

  return (
    <div className={'mr-2 flex'}>
      <div ref={providersListRef} className={'relative providers'}>
        <div onClick={() => { if (models.length > 1) providersVisible.value = true }} className={'flex gap-1 border border-[#DBDBDB] text-sm leading-6 rounded-tl font-bold px-2 border-b-0 cursor-pointer ' + (models.length > 1 ? 'py-1' : 'py-2')}>
          <img src={OpenAi} className={'w-4 ' + (currentModel.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
          <img src={Claude} className={'w-4 ' + (currentModel.provider != 'Claude' ? 'hidden' : '')} alt="" />
          <img src={Groq} className={'w-4 ' + (currentModel.provider != 'Groq' ? 'hidden' : '')} alt="" />
          <span className={(models.length > 1 ? '' : 'hidden')}>{currentModel.provider}</span>
          <img src={angleDown} className={'ml-1 ' + (models.length > 1 ? '' : 'hidden')} alt="" />
        </div>

        <div className={'absolute bottom-9 shadow-2xl left-0 bg-white border rounded border-[#DBDBDB] w-[140px] ' + (providersVisible.value ? '' : 'hidden')}>
          {models.map(model => (
            <div onClick={() => handleProviderSelect(model)} className={' max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow ' + (currentModel.provider === model.provider ? 'box-shadow' : '')}>
              <img src={OpenAi} className={'w-4 ' + (model.provider != 'OpenAI' ? 'hidden' : '')} alt="" />
              <img src={Claude} className={'w-4 ' + (model.provider != 'Claude' ? 'hidden' : '')} alt="" />
              <img src={Groq} className={'w-4 ' + (model.provider != 'Groq' ? 'hidden' : '')} alt="" />
              <div className={'max-w-full truncate ml-[5px] text-sm  leading-6 font-bold'}>
                {model.provider}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div ref={modelListRef} className={'relative models'}>
        <div onClick={() => { modelsVisible.value = true }} className={'flex border border-[#DBDBDB] text-sm leading-6 rounded-tr px-2 py-1 border-b-0 border-l-0 cursor-pointer'}>
          {currentModel.defaultSelected}
          <img src={angleDown} className={'ml-1'} alt="" />
        </div>

        <div className={'absolute bottom-9 shadow-2xl left-0 bg-white border rounded border-[#DBDBDB] w-[140px] ' + (modelsVisible.value ? '' : 'hidden')}>
          {currentModel.models.map(model => (
            <div onClick={() => handleModelSelect(model)} className={' max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow ' + (currentModel.defaultSelected === model ? 'box-shadow' : '')}>
              <div className={'max-w-full truncate ml-[5px] text-sm  leading-6'}>
                {model}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}