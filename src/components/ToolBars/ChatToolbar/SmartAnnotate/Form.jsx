import arrow from '../../../../assets/arrow.svg';
import angleDown from '../../../../assets/angle-down.svg';
import checkGreen from '../../../../assets/check-green.svg';
import { ResponseTemplateInput } from './ResponseTemplateInput';
import googleDrive from '../../../../assets/google-drive.svg';
import { Loading } from '../../../Loading';
import share from '../../../../assets/share.svg';
import { HelpToolTip } from '../../../Tooltips/HelpToolTip';
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDrivePicker from 'react-google-drive-picker';
import { useSignal } from '@preact/signals';

import { createAnnotations, getProfileInfo, hSliceActions } from '../../../../store/h-slice';
import { createChat, getChatsData } from '../../../../store/chats-slice';

export function Form() {
  const annotationFormRef = useRef(null);
  const currentChat = useSelector(state => state.chats.currentChat);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentModel = useSelector(state => state.ui.currentModel);
  const expandSidebar = useSelector(state => state.ui.expandSidebar);

  const visible = useSelector(state => state.h.formVisible);

  const token = useSignal('');
  const username = useSignal('');

  const group = useSignal('placeholder');
  const groupValid = useSignal(true);
  const tags = useSignal('');

  const url = useSignal('');
  const urlType = useSignal('url');
  const fileId = useSignal('');
  const urlValid = useSignal(true);

  const response_template = useSignal('');
  const showResponseTemplate = useSignal(false);

  const prompt = useSignal('');
  const promptValid = useSignal(true);

  const confirmDeleteAnnotations = useSignal(false);
  const showConfirmDeleteAnnotations = useSignal(false);

  const infoLoading = useSignal(false);
  const annotationLoading = useSignal(false);

  const profileInfo = useSelector(state => state.h.profileInfo);

  const dispatch = useDispatch();

  useEffect(async function () {
    urlValid.value = true
    promptValid.value = true;
    groupValid.value = true;

    confirmDeleteAnnotations.value = false;
    showConfirmDeleteAnnotations.value = false;


    url.value = '';

    let ProfileData = JSON.parse(localStorage.getItem("ANT_hProfile"));

    if (ProfileData) {
      username.value = ProfileData.username ? ProfileData.username : '';
      token.value = ProfileData.token;
      group.value = ProfileData.group ? ProfileData.group : 'placeholder';
      if (!profileInfo.userid) {
        infoLoading.value = true;
        await dispatch(getProfileInfo({ username: username.value, token: token.value, group: group.value }));
        infoLoading.value = false;
      }
    }

    if (currentChat.uuid != null) {
      let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

      if (hChats) {
        let target = hChats.find(c => c.uuid === currentChat.uuid);
        if (target) {
          url.value = target.url.content;

          if (target.url.type != 'url') {
            fileId.value = target.url.fileId;
            urlType.value = target.url.type;
          } else {
            urlType.value = target.url.type;
            fileId.value = '';
          }

        } else {
          url.value = '';
        }
      }
    }
  }, [visible])

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target) && !annotationLoading.value) {
          dispatch(hSliceActions.toggleFormVisible(false));
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  outsideClickHanlder(annotationFormRef);

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    // const customViewsArray = [new google.picker.DocsView(google.picker.ViewId.PDFS)];

    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DEV_KEY,
      viewId: "PDFS",
      token: currentUser.google_token,
      supportDrives: false,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          urlType.value = 'url';
        } else if (data.docs.length > 0) {
          const file = data.docs[0];

          url.value = file.name;
          fileId.value = file.id;

          let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

          if (hChats) {
            let index = hChats.findIndex(c => c.uuid === currentChat.uuid);
            if (index != -1) {
              hChats[index].url.content = url.value;
              hChats[index].url.type = urlType.value;
              hChats[index].url.fileId = fileId.value;
            } else {
              let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value, fileId: fileId.value } };
              hChats = [...hChats, data];
            }

            localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
          } else {
            let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value, fileId: fileId.value } };
            hChats = [data];
            localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
          }
        }
      },
    })
  }

  function handleInputType() {
    if (urlType.value === 'url') {
      urlType.value = 'google-drive';
      handleOpenPicker();
    } else {
      urlType.value = 'url';
      url.value = '';

      let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

      if (hChats) {
        let index = hChats.findIndex(c => c.uuid == currentChat.uuid);
        if (index != -1) {
          hChats[index].url.content = url.value;
          hChats[index].url.type = urlType.value;
        } else {
          let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value } };
          hChats = [...hChats, data];
        }

        localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
      } else {
        let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value } };
        hChats = [data];
        localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
      }
    }
  }

  const onInput = event => {
    dispatch(hSliceActions.resetInfo());
    token.value = event.currentTarget.value
  };

  const onGroupInput = event => {
    groupValid.value = true;
    group.value = event.currentTarget.value
    let ProfileData = JSON.parse(localStorage.getItem("ANT_hProfile"));

    if (ProfileData) {
      ProfileData = { ...ProfileData, group: group.value };
      localStorage.setItem("ANT_hProfile", JSON.stringify(ProfileData));
    }
  };
  const onTagsInput = event => {
    tags.value = event.currentTarget.value
  };
  const onUrlInput = event => {
    url.value = event.currentTarget.value
    urlValid.value = true;

    let hChats = JSON.parse(localStorage.getItem("ANT_hChats"));

    if (hChats) {
      let index = hChats.findIndex(c => c.uuid == currentChat.uuid);
      if (index != -1) {
        hChats[index].url.content = url.value;
      } else {
        let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value } };
        hChats = [...hChats, data];
      }

      localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
    } else {
      let data = { uuid: currentChat.uuid, url: { type: urlType.value, content: url.value } };
      hChats = [data];
      localStorage.setItem("ANT_hChats", JSON.stringify(hChats))
    }
  };

  function handleResponseTemplateData(data) {
    response_template.value = data.promptArray[0].prompt;
  }

  function handlePromptData(data) {
    prompt.value = data.promptArray[0].prompt;
  }

  function resetForm() {
    username.value = ''
    group.value = ''
    tags.value = ''
    url.value = ''
    response_template.value = ''
    prompt.value = ''
  }


  function handleConfirmDeleteAnt() {
    confirmDeleteAnnotations.value = !confirmDeleteAnnotations.value;
  }

  function tryHandleSubmit() {
    if (confirmDeleteAnnotations.value) {
      showConfirmDeleteAnnotations.value = true;
    } else {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    if (!profileInfo.userid) {
      infoLoading.value = true;
      await dispatch(getProfileInfo({ token: token.value }));
      infoLoading.value = false;
    } else {

      let formData = {
        username: profileInfo.userid.split(":")[1].split("@")[0],
        api_key: token.value,
        group: group.value,
        tags: tags.value.split(","),
        url: urlType.value === 'url' ? url.value : fileId.value,
        input_type: urlType.value,
        response_template: response_template.value,
        prompt: prompt.value,
        room_id: currentChat.uuid ? currentChat.uuid : false,
        delete_annotations: confirmDeleteAnnotations.value,
        model: currentModel.defaultSelected,
        user_model_uuid: currentModel.uuid,
      }

      const regex = /^https:\/\/.*/;
      urlValid.value = regex.test(formData.url) || urlType.value === 'google-drive';
      promptValid.value = prompt.value.length > 0;

      groupValid.value = formData.group != 'placeholder'

      if (!urlValid.value || !promptValid.value || formData.group === 'placeholder') {
        return;
      }

      if (currentChat.uuid) {
        annotationLoading.value = true;

        await dispatch(createAnnotations(formData));

        annotationLoading.value = false;
        dispatch(hSliceActions.toggleFormVisible(false));


        resetForm();

        dispatch(getChatsData(currentChat.uuid))
      } else {
        annotationLoading.value = true;
        localStorage.setItem("ANT_annotateToCreate", JSON.stringify(formData));
        await dispatch(createChat('New Chat'));
        annotationLoading.value = false;
        dispatch(hSliceActions.toggleFormVisible(false));
      }
    }
  }

  return (
    <div ref={annotationFormRef} className={'pb-8 bg-white rounded z-50 top-2 left-1/2 transform w-[640px] border shadow-xl ' + (visible ? 'fixed ' : 'hidden ') + (expandSidebar ? '-translate-x-36' : '-translate-x-1/2')}>
      <div className={'mx-auto'}>
        <div className={'px-8'}>
          <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
            AI Annotations
          </div>
        </div>
        <div className={'max-h-[76vh] overflow-y-auto pl-8 pr-4 mr-4'}>
          <div className={'py-4 text-sm leading-6'}>
            <div className={'font-bold text-[#202020]'}>Create smart annotations from any URL</div>
            <p className={'text-[#595959] mt-2'}>Already using Hypothesis and want to add some annotations to spark a conversation? Get started by configuring your account below:</p>
          </div>
          <div className={''}>
            <div className={'text-xs text-[#747474] mb-1 flex justify-between'}>
              <div className="font-bold flex">
                API Key
                <span>
                  <HelpToolTip content={'Provide your Hypothesis API key to automatically create annotations'} />
                </span>
                <img src={checkGreen} className={'ml-1 ' + (profileInfo.userid != null ? '' : 'hidden')} alt="" />
                {profileInfo.userid &&
                  <span class="ml-0.5 font-normal"> ({profileInfo.userid.split(":")[1].split("@")[0]})</span>
                }
              </div>
              <div className={'flex gap-1'}>
                <a className={'underline'} target={'_blank'} href="https://hypothes.is/profile/developer">Get Key</a><img src={arrow} alt="" />
              </div>
            </div>
            <input value={token.value} onInput={onInput} className={'inputtext w-full'} placeholder={'Enter your key...'} type="text" />
            <div className={'text-red-500 text-xs pl-1 mt-0.5 ' + (profileInfo.userid === null && profileInfo.groups.length ? '' : 'hidden')}>
              Wrong api key
            </div>
          </div>
          <div className={'mt-4 flex justify-center ' + (infoLoading.value ? '' : 'hidden')}>
            <Loading />
          </div>
          <div className={profileInfo.userid ? '' : 'hidden'}>
            <div className={'mt-4'}>
              <div className={'flex gap-4'}>
                <div className={'w-full'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    Group <HelpToolTip content={'Select a Hypothesis group to add annotations to'} />
                  </div>

                  <div class="relative">
                    <select onChange={onGroupInput} value={group.value} className={"overflow-hidden pr-6 " + (group.value === 'placeholder' ? 'text-[#747474]' : '')} >
                      <option disabled selected value="placeholder" className={'text-[#747474]'}>{profileInfo.groups?.filter(g => g.id != "__world__").length < 1 ? 'No group available' : 'Choose Group'}</option>
                      {profileInfo.groups?.filter(g => g.id != "__world__").map(g => (
                        <option value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                  </div>
                  <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (profileInfo.groups?.filter(g => g.id != "__world__").length < 1 ? '' : 'hidden')}>
                    Create a group in order to make annotations
                  </div>
                  <div className={'text-red-500 text-center text-[10px] pl-1 mt-0.5 ' + (groupValid.value ? 'hidden' : '')}>
                    You need to choose a group
                  </div>
                </div>
                <div className={'w-full'}>
                  <div className="text-xs font-bold text-[#747474] mb-1 flex">
                    <div>Tags <span className={'font-normal'}>(optional)</span> </div> <HelpToolTip content={'A tag to add to your annotations. Multiple tags can be separated by commas.'} />
                  </div>
                  <input value={tags.value} onInput={onTagsInput} className={'inputtext w-full'} placeholder={'Enter tags (comma-separated)...'} type="text" />
                </div>
              </div>
            </div>
            <div className={'mt-4'}>
              <div className="text-xs font-bold text-[#747474] mb-1 flex">
                URL or File to Annotate <HelpToolTip content={'The page or file to annotate'} />
                {!urlValid.value &&
                  <div class="text-[#EF4444] text-[10px] leading-4 text-center mt-0.5 justify-self-center ml-12">This doesn't look like a link...</div>
                }
              </div>
              <div className={'flex items-center text-sm leading-6 text-[#202020] border border-[#DBDBDB] bg-[#FAFAFA] rounded-[4px] ' + (urlValid.value ? '' : 'border-[#EF4444]')}>
                <div className={'px-2 shrink-0'}>
                  <img src={urlType.value === 'url' ? share : googleDrive} className={'w-[16px] h-[16px]'} alt="" />
                </div>
                <input value={url.value} onInput={onUrlInput} disabled={urlType.value === 'google-drive'} className={'w-full disabled:opacity-100 focus:outline-none placeholder:text-[#747474] border-r py-2 bg-[#FAFAFA]'} placeholder={'Enter HTML, PDF, YouTube URL or choose file from Google →'} type="text" />
                <div title={urlType.value === 'url' ? 'Click to select a file in google drive' : 'Click to insert Url'} onClick={() => { handleInputType() }} className={'rounded-[4px] rounded-l-none  cursor-pointer shrink-0 p-3 bg-white'}>
                  <img src={urlType.value === 'url' ? googleDrive : share} className={''} alt="" />
                </div>
              </div>

            </div>

            <div className={'mt-6'}>
              <div className={'w-full'}>
                <div className="text-xs relative z-[10] font-bold text-[#747474] mb-1 flex w-[100px]">
                  Prompt <HelpToolTip content={'The specific prompt that will create the annotations you’re interested in.'} />
                </div>
                <div class="relative -mt-[25px]">
                  <ResponseTemplateInput
                    loadPrompt={true}
                    showModels={true}
                    WSsendMessage={value => { }}
                    visible={visible}
                    handleSubmitButton={value => { handlePromptData(value) }}
                  // clearInputOnSubmit={true}
                  />
                </div>
                {!promptValid.value &&
                  <div class="text-[#EF4444] text-[10px] leading-4 text-center">You have to add a prompt...</div>
                }
              </div>
            </div>

            <div className={'mt-6'}>
              <div className={'w-full'}>
                <div onClick={() => showResponseTemplate.value = !showResponseTemplate.value} className={"text-xs relative z-[10] font-bold text-[#747474] border-[#747474] mb-1 flex cursor-pointer " + (showResponseTemplate.value ? '' : 'border-b pb-1')}>
                  Scaffolding Prompt <span className={'font-normal ml-1'}>(optional)</span>  <HelpToolTip content={'The base template of instructions for running your prompt and creating the JSON file of annotations'} />
                  <img src={angleDown} className={"pointer-events-none duration-300 ml-auto transform " + (showResponseTemplate.value ? 'rotate-180' : '')}></img>
                </div>
                <div className={'overflow-hidden ' + (showResponseTemplate.value ? 'max-h-[700px]' : 'max-h-0')}>
                  <a href="/default-scafold-prompt" target="_blank" className="text-xs relative z-[10] underline text-[#747474] mt-3 w-[200px] flex">
                    Default Scaffold Prompt
                  </a>
                  <div class="relative -mt-[26px]">
                    <ResponseTemplateInput
                      WSsendMessage={value => { }}
                      handleSubmitButton={value => { handleResponseTemplateData(value) }}
                      visible={visible}
                    // clearInputOnSubmit={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={'mt-4 flex justify-center ' + (annotationLoading.value ? '' : 'hidden')}>
            <Loading />
          </div>
          <div className={'mt-4 pb-2 flex w-full justify-between items-center'}>
            <div className={'flex items-center gap-2 -mt-1 text-sm leading-6 shrink-0'}>
              <label class="switch">
                <input type="checkbox" onChange={() => handleConfirmDeleteAnt()} checked={confirmDeleteAnnotations.value} />
                <span class="slider round"></span>
              </label>
              <span>Delete existing annotations</span>
            </div>
            <div className={'flex gap-1 justify-end'}>
              <button disabled={annotationLoading.value} type="button" onClick={() => { dispatch(hSliceActions.toggleFormVisible(false)); }} className="btn-second">Cancel</button>
              <button disabled={annotationLoading.value} onClick={() => tryHandleSubmit()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">{profileInfo.userid ? 'Create Annotations' : 'Next Step'}</button>
            </div>
          </div>
        </div>
      </div>
      <div className={'absolute z-20 top-72 left-1/2 transform -translate-x-1/2 w-[320px] bg-[#202020] border border-[#595959] text-sm leading-6 rounded ' + (showConfirmDeleteAnnotations.value ? '' : 'hidden')}>
        <div className={'p-4 text-white text-center'}>
          You are about to delete all existing annotations attached to this URL before generating new annotations.
        </div>
        <div className={'flex gap-1 justify-center py-2 border-t border-[#595959]'}>
          <button onClick={() => showConfirmDeleteAnnotations.value = false} type="button" className="btn-second light-gray">Cancel</button>
          <button onClick={() => handleSubmit()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white px-2 py-1 rounded flex items-center">I Understand</button>
        </div>
      </div>
    </div>
  )
}