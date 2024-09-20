// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { hSliceActions } from '../../../store/h-slice';

import braces from '../../../assets/braces.svg';
import returnResponse from '../../../assets/return-response.svg';
import useFile from '../../../assets/use-file.svg';
import makeAnnotation from '../../../assets/make-annotation.svg';
import showLogs from '../../../assets/show-logs.svg';
import elips from '../../../assets/ellipsis-vertical.svg';
import loopSvg from '../../../assets/loop.svg';
import fileImport from '../../../assets/file-import.svg';
import plus from '../../../assets/plus.svg';
import googleDrive from '../../../assets/google-drive.svg';
import arrow from '../../../assets/arrow.svg';
import { Loading } from '../../Loading';
import { Form } from './SmartAnnotate/Form';

export function MobileMenu(props) {
  const templates = useSelector(state => state.templates.useTemplates);
  const currentTemplate = useSelector(state => state.templates.currentTemplate);
  const userFiles = useSelector(state => state.files.files);
  const filesLoading = useSelector(state => state.files.loading);

  const isVisible = useSignal(false);
  const listMode = useSignal('start');
  const searchForTemplate = useSignal('');
  const httpsNotFound = useSignal(false);

  const searchTemplateInputRef = useRef(null);
  const uploadFileInputRef = useRef(null);

  const dispatch = useDispatch();

  function outsideClickHanlder(ref, callback) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          isVisible.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", e => {
        // console.log(e);
      })

      return () => {
      }
    }, [ref])
  }

  async function handleUploadFile(e) {
    httpsNotFound.value = false;
    if (e.key === 'Enter') {
      const regex = /^https:\/\/.*/;
      const isHttpsLink = regex.test(e.target.value);
      if (e.target.value.length > 0 && isHttpsLink) {

        let file = await dispatch(uploadFile({ source_type: 'url', source_value: e.target.value }));
        props.FilePicked(file);
      } else {
        httpsNotFound.value = true;
      }
    }
  }

  const handleOpenPicker = async () => {
    const customViewsArray = [new google.picker.DocsView(google.picker.ViewId.PDFS)];

    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DEV_KEY,
      viewId: "DOCUMENTS",
      token: currentUser.google_token,
      supportDrives: false,
      multiselect: false,
      customViews: customViewsArray, // custom view
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        if (data.docs.length > 0) {
          console.log(data);

          if (data.docs[0].mimeType === "application/pdf") {
            let file = await dispatch(uploadFile({ source_type: 'google-drive', source_value: "", id: data.docs[0].id, mime_type: data.docs[0].mimeType }));
            props.FilePicked(file);
          } else {
            try {
              let response = await fetch(`https://www.googleapis.com/drive/v3/files/${data.docs[0].id}/export?mimeType=text/plain`, {
                headers: {
                  Authorization: `Bearer ${currentUser.google_token}`
                }
              })
              if (response.status === 200) {
                const reader = response.body.getReader();
                reader.read().then(async ({ done, value }) => {
                  const string = new TextDecoder().decode(value);
                  let file = await dispatch(uploadFile({ source_type: 'google-drive', source_value: string, id: data.docs[0].id }));
                  props.FilePicked(file);
                })
              } else {
                response = await fetch(`https://www.googleapis.com/drive/v3/files/${data.docs[0].id}?alt=media`, {
                  headers: {
                    Authorization: `Bearer ${currentUser.google_token}`
                  }
                });
                const reader = response.body.getReader();
                reader.read().then(async ({ done, value }) => {
                  const string = new TextDecoder().decode(value);
                  let file = await dispatch(uploadFile({ source_type: 'google-drive', source_value: string, id: data.docs[0].id }));
                  props.FilePicked(file);
                })
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      },
    })
  }

  const mobileMenuRef = useRef(null);
  outsideClickHanlder(mobileMenuRef, () => { props.onToggleVisible(false) });

  function toggleFormVisible() {
    dispatch(hSliceActions.toggleFormVisible(true));
  }

  return (
    <div ref={mobileMenuRef} className={'relative'}>
      <div onClick={(e) => { isVisible.value = !isVisible.value; listMode.value = 'start'; }} className={'border p-1 border-b-0 cursor-pointer rounded-t border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (false ? 'bg-[#F2F2F2]' : '')}>
          <img src={elips} className={'transform w-4 rotate-90'} alt="" />
        </div>
      </div>

      <div className={"absolute border rounded bg-white transform overflow-y-auto scrollBar-dark shadow-2xl " + (listMode.value === 'start' ? 'w-[160px] ' : 'w-[240px] ') + (isVisible.value ? '' : 'hidden ') + (props.Position === 'top' ? 'bottom-10 left-0 ' : '-top-2 left-10 ')}>
        {listMode.value === 'start' &&
          <div>
            <div onClick={(e) => { listMode.value = 'templates' }} className={'p-1 cursor-pointer flex hover:bg-[#F2F2F2] border-b border-[#DBDBDB]'}>
              <div className={'flex p-1' + (false ? 'bg-[#F2F2F2]' : '')}>
                <img src={braces} alt="" className={'w-4'} /> <span className={'ml-2 text-sm leading-6'}>Insert Template</span>
              </div>
            </div>

            <div onClick={(e) => props.ReturnResponse()} className={'hover:bg-[#F2F2F2] cursor-pointer p-1 border-b border-[#DBDBDB] ' + (false ? 'bg-[#F2F2F2]' : '')}>
              <div className={'flex px-1'}>
                <img src={returnResponse} alt="" className={'w-4'} />
                <span className={'ml-2 text-sm leading-6'}>Insert Return</span>
              </div>
            </div>
            <div onClick={(e) => { listMode.value = 'files' }} className={'hover:bg-[#F2F2F2] cursor-pointer p-1 border-b border-[#DBDBDB] ' + (false ? 'bg-[#F2F2F2]' : '')}>
              <div className={'flex px-1'}>
                <img src={useFile} alt="" className={'w-4'} />
                <span className={'ml-2 text-sm leading-6'}>Insert File</span>
              </div>
            </div>
            <div onClick={(e) => { toggleFormVisible() }} className={'hover:bg-[#F2F2F2] cursor-pointer p-1 border-b border-[#DBDBDB] ' + (false ? 'bg-[#F2F2F2]' : '')}>
              <div className={'flex px-1'}>
                <img src={makeAnnotation} alt="" className={'w-4'} />
                <span className={'ml-2 text-sm leading-6'}>AI Annotations</span>
              </div>
            </div>
          </div>
        }
        {listMode.value === 'templates' &&
          <div>
            <div className={'p-2 border-b'}>
              <div className="border border-[#DBDBDB] rounded-lg flex items-center p-2">
                <img className="w-4" src={loopSvg} alt="" />
                <input ref={searchTemplateInputRef} onInput={(e) => { searchForTemplate.value = e.target.value }} value={searchForTemplate.value} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 max-w-full text-sm leading-6" placeholder="Search..." />
              </div>
            </div>
            <div className={' max-h-[160px] overflow-y-auto'}>
              {templates.filter(temp => (temp.name.toLowerCase().includes(searchForTemplate.value) && temp.uuid != currentTemplate.uuid)).map(template => (
                <div onClick={(e) => { isVisible.value = false; props.TemplatePicked(template); }} className={'max-w-[240px] flex items-center py-1 px-2 border-b cursor-pointer hover:bg-[#FAFAFA] hover:box-shadow'}>
                  <img className="w-4" src={braces} alt="" />
                  <div className={'max-w-full truncate ml-[5px] text-sm  leading-6'}>
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }

        {listMode.value === 'files' &&
          <div>
            <div className={'p-2 border-b'}>
              <div className={"border rounded-lg flex items-center p-2 " + (httpsNotFound.value ? 'border-[#EF4444]' : 'border-[#DBDBDB]')}>
                <img className="w-4" src={fileImport} alt="" />
                <input onKeyDown={(e) => { handleUploadFile(e) }} disabled={filesLoading} ref={uploadFileInputRef} type="text" className="bg-transparent w-full placeholder:text-[#747474] focus:outline-none ml-2 max-w-full text-sm leading-6" placeholder="URL of text…" />
              </div>
              {httpsNotFound.value &&
                <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5">This doesn't look like a link...</div>
              }
              {!filesLoading &&
                <div className={'text-xs text-[#747474] mt-2'}>
                  Press enter to confirm
                </div>
              }
              {filesLoading &&
                <div className={'flex items-center justify-center mt-2'}>
                  <Loading />
                </div>
              }
            </div>
            {userFiles.length > 0 &&
              <div className={'w-full'}>
                <div className="text-[10px] leading-4 font-bold text-[#747474] px-2 pt-2">
                  Recent Files
                </div>
                <div className={'overflow-y-auto max-h-[160px]'}>
                  {userFiles.map(file => (
                    <div onClick={() => props.FilePicked(file)} className={'group text-sm leading-6 pl-2 pr-3 py-1 text-[#202020] border-b border-[#DBDBDB] flex justify-between cursor-pointer hover:bg-[#F2F2F2]'}>
                      <div className={''}>{file.title}</div>
                      <img src={plus} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            }
            <div>
              <div onClick={handleOpenPicker} className={'py-2 flex cursor-pointer hover:bg-[#FAFAFA]'}>
                <img src={googleDrive} className={'mx-2'} alt="" />
                <div>Pick Google Drive file</div>
                <img className={'ml-auto mr-3'} src={arrow} alt="" />
              </div>
            </div>
          </div>
        }
      </div>
    </div >

  )
}