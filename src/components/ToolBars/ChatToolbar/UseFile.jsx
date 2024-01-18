import { useSelector } from 'react-redux';
import { signal, useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import useDrivePicker from 'react-google-drive-picker'

import fileImport from '../../../assets/file-import.svg';
import googleDrive from '../../../assets/google-drive.svg';
import arrow from '../../../assets/arrow.svg';

const isVisible = signal(false);

function toggleVisible() {
  isVisible.value = !isVisible.value
}

function outsideClickHanlder(ref, callback) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
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

export function UseFile(props) {
  const useTempRef = useRef(null);
  outsideClickHanlder(useTempRef, () => { props.onToggleVisible(false) });

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DEV_KEY,
      viewId: "DOCUMENTS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)
      },
    })
  }

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [props.Visible]);

  const url = useSignal('');

  function handleurlUpdate(e) {
    console.log(e);
  }

  return (
    <div title={'Insert File - ++'} ref={useTempRef} className={'relative'}>
      <div onClick={() => props.onToggleVisible()} className={'border p-1 border-l-0 border-b-0 cursor-pointer rounded-tr border-[#DBDBDB] w-8 h-8 flex items-center justify-center '}>
        <div className={'p-1 hover:bg-[#F2F2F2] ' + (props.Visible ? 'bg-[#F2F2F2]' : '')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3333 4C16.465 4 16.5913 4.05192 16.6849 4.1445L18.8516 6.28736C18.9466 6.38128 19 6.50929 19 6.64286V19.5C19 19.7761 18.7761 20 18.5 20H5.5C5.22386 20 5 19.7761 5 19.5V4.5C5 4.22386 5.22386 4 5.5 4H16.3333ZM15 5H6V19H18V8H15.5C15.2239 8 15 7.77614 15 7.5V5ZM12 15.25C12 14.8358 11.6642 14.5 11.25 14.5H8.75C8.33579 14.5 8 14.8358 8 15.25C8 15.6642 8.33579 16 8.75 16H11.25C11.6642 16 12 15.6642 12 15.25ZM15.25 11.75C15.6642 11.75 16 12.0858 16 12.5C16 12.9142 15.6642 13.25 15.25 13.25H8.75C8.33579 13.25 8 12.9142 8 12.5C8 12.0858 8.33579 11.75 8.75 11.75H15.25ZM16 9.75C16 9.33579 15.6642 9 15.25 9H8.75C8.33579 9 8 9.33579 8 9.75C8 10.1642 8.33579 10.5 8.75 10.5H15.25C15.6642 10.5 16 10.1642 16 9.75Z" fill="#747474" />
          </svg>
        </div>
      </div>
      <div className={"absolute w-[320px] border rounded bg-white z-50 transform max-h-[225px] overflow-y-auto scrollBar-dark " + (props.Visible ? '' : 'hidden ') + (props.Position === 'top' ? 'bottom-10 left-0' : '-top-2 right-10')}>
        <div className={'p-2 border-b'}>
          <div className="border border-[#DBDBDB] rounded-lg flex items-center p-2">
            <img className="w-4" src={fileImport} alt="" />
            <input ref={inputRef} onInput={(e) => handleurlUpdate(e)} value={url.value} type="text" className="bg-transparent placeholder:text-[#747474] focus:outline-none ml-2 max-w-full text-sm leading-6" placeholder="URL of text…" />
          </div>
        </div>
        <div>
          <div onClick={handleOpenPicker} className={'py-2 flex cursor-pointer'}>
            <img src={googleDrive} className={'mx-2'} alt="" />
            <div>Pick Google Drive file</div>
            <img className={'ml-auto mr-3'} src={arrow} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}