import { useState, useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from '../components/Toast';
import { showToast } from '../store/ui-slice';
import { selectTemplate, updateTemplate } from '../store/templates-slice';
import { TemplateToolBar } from '../components/ToolBars/TemplateToolbar/TemplateToolBar';


export function Template(props) {
  const [input, setInput] = useState('');
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const dispatch = useDispatch();

  const chatRef = useRef(null);

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  useEffect(() => {
    dispatch(selectTemplate(props.matches.id));
  }, []);

  useEffect(() => {
    setInput(currentTemplate.content);
  }, [currentTemplate])

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {

      } else {
        event.preventDefault();
        saveContent();
      }
    }
  }

  function saveContent() {
    dispatch(showToast({ content: `Template saved` }))
    dispatch(updateTemplate({ uuid: currentTemplate.uuid, content: input }));
  }

  return (
    <div className={'flex w-full mx-4'} >
      <div>
      </div>
      <div className="mx-auto 2xl:max-w-[1280px] max-w-[860px] w-full">
        <div className="h-[100vh] flex flex-col pt-4 pb-2">
          <div className={'flex justify-between items-center relative'}>
            <div className={'text-lg leading-6 font-bold py-5 text-[#595959] '}>
              {currentTemplate.name}
            </div>

            <div className={'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
              <Toast />
            </div>

            <div>
              <TemplateToolBar />
            </div>
          </div>
          <div className="2xl:max-w-[1280px] max-w-[860px] w-full overflow-y-auto" ref={chatRef}>

            {/* <Message Loading={true} Message={msg} /> */}
          </div>
          <div className={'mt-12'}>
            <div className={'mb-2 pl-1 font-bold text-xs text-[#747474]'}>
              Prompt
            </div>
            <form onSubmit={saveContent} className="">
              <textarea onKeyDown={handleKeyDown} onChange={handleInputChange} value={input} className=" w-full h-[156px] bg-[#F2F2F2] border rounded border-[#DBDBDB] focus:outline-none px-4 py-3 resize-none text-sm leading-6"></textarea>
            </form>
            <div className="flex justify-end items-center mt-2 gap-x-4">
              {/* <button className="text-[#747474] text-sm leading-6 font-bold">Save As Template</button> */}
              <button onClick={saveContent} type="submit" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">Save Template</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}