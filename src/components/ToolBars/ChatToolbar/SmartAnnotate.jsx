import arrow from '../../../assets/arrow.svg';
import angleDown from '../../../assets/angle-down.svg';
import checkGreen from '../../../assets/check-green.svg';
import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnotations, getProfileInfo, hSliceActions } from '../../../store/h-slice';
import { Loading } from '../../Loading';
import { getChatsData } from '../../../store/chats-slice';
import { ResponseTemplateInput } from './SmartAnnotate/ResponseTemplateInput';

export function SmartAnnotate(props) {
  const currentChat = useSelector(state => state.chats.currentChat)

  const visible = useSignal(false);
  const token = useSignal('');
  const username = useSignal('');
  const group = useSignal('__world__');
  const tags = useSignal('');
  const url = useSignal('');
  const response_template = useSignal('');
  const prompt = useSignal('');
  const infoLoading = useSignal(false);
  const annotationLoading = useSignal(false);

  const dispatch = useDispatch();
  const profileInfo = useSelector(state => state.h.profileInfo);

  function outsideClickHanlder(ref) {
    useEffect(() => {
      function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target) && !annotationLoading.value) {
          visible.value = false;
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
      }
    }, [ref])
  }

  const onInput = event => {
    dispatch(hSliceActions.resetInfo());
    token.value = event.currentTarget.value
  };
  const onUsernameInput = event => {
    username.value = event.currentTarget.value
  };
  const onGroupInput = event => {
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
  };
  const onResponseTemplateInput = event => {
    response_template.value = event.currentTarget.value
  };
  const onPromptInput = event => {
    prompt.value = event.currentTarget.value
  };

  const FormRef = useRef(null);
  outsideClickHanlder(FormRef);


  async function toggleVisible() {
    let ProfileData = JSON.parse(localStorage.getItem("ANT_hProfile"));

    if (ProfileData) {
      username.value = ProfileData.username ? ProfileData.username : '';
      token.value = ProfileData.token;
      group.value = ProfileData.group ? ProfileData.group : '__world__';
      visible.value = !visible.value;
      if (!profileInfo.userid) {
        infoLoading.value = true;
        await dispatch(getProfileInfo({ username: username.value, token: token.value, group: group.value }));
        infoLoading.value = false;
      }
    }
    else {
      visible.value = !visible.value;
    }
  }

  async function handleSubmit() {
    if (!profileInfo.userid) {
      infoLoading.value = true;
      await dispatch(getProfileInfo({ username: username.value, token: token.value }));
      infoLoading.value = false;
    } else {
      let data = {
        username: username.value,
        api_key: token.value,
        group: group.value,
        tags: tags.value.split(","),
        url: url.value,
        response_template: response_template.value,
        prompt: prompt.value,
        room_id: currentChat.uuid,
      }

      annotationLoading.value = true;
      await dispatch(createAnnotations(data));
      annotationLoading.value = false;
      visible.value = false;
      resetForm();
      dispatch(getChatsData(currentChat.uuid))
    }
  }

  function resetForm() {
    username.value = ''
    group.value = ''
    tags.value = ''
    url.value = ''
    response_template.value = ''
    prompt.value = ''
  }

  function handleResponseTemplateData(data) {
    response_template.value = data.promptArray[0].prompt;
  }

  return (
    <div className={'relative'}>
      <div onClick={() => toggleVisible()} className={'border p-1 border-b-0 border-l-0 cursor-pointer border-[#DBDBDB] w-8 h-8 flex items-center justify-center rounded-tr'}>
        <div className={'hover:bg-[#F2F2F2]'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 4C19.1046 4 20 4.89543 20 6V19C20 19.5523 19.5523 20 19 20C18.8026 20 18.6096 19.9416 18.4453 19.8321L14.1831 18.0754C14.0622 18.0256 13.9327 18 13.802 18H6C4.89543 18 4 17.1046 4 16V6C4 4.89543 4.89543 4 6 4H18ZM15.8911 7.5H15.4067L15.2679 7.50595L15.1448 7.52381C15.0679 7.53969 15.0015 7.5635 14.9454 7.59524L14.869 7.64882L14.7607 7.74864L14.6642 7.84969L13.0317 9.84803L12.9407 9.96753L12.8568 10.0967C12.7765 10.2308 12.7068 10.3794 12.6477 10.5425C12.6149 10.6332 12.5875 10.7254 12.5656 10.8193L12.5369 10.9614L12.5092 11.1791L12.5 11.4024V14.048L12.5092 14.1338L12.5369 14.2148C12.5615 14.2671 12.5985 14.3163 12.6477 14.3622C12.6871 14.3989 12.7287 14.4283 12.7725 14.4504L12.8398 14.478L12.9105 14.4945L12.9844 14.5H15.8911L15.9651 14.4945L16.0585 14.47C16.1189 14.4471 16.1753 14.4112 16.2278 14.3622C16.2607 14.3316 16.288 14.2995 16.3099 14.2661L16.3386 14.2148L16.3663 14.1338L16.3755 14.048V11.3362L16.3696 11.2635L16.3519 11.1951C16.3283 11.129 16.2869 11.0694 16.2278 11.0165C16.195 10.9871 16.1607 10.9626 16.1248 10.943L16.0698 10.9173L15.983 10.8925L15.8911 10.8843H15.3121L15.2549 10.8784L15.2014 10.8608C15.1669 10.8452 15.1349 10.8218 15.1054 10.7906C15.0817 10.7656 15.0666 10.7397 15.06 10.7129L15.0564 10.6722L15.0657 10.63L15.0876 10.5866L16.3992 8.35984L16.446 8.26952L16.483 8.1638C16.5185 8.02478 16.4984 7.89354 16.4228 7.77008C16.3598 7.66719 16.2749 7.5937 16.1682 7.54961L16.084 7.52205L15.9917 7.50551L15.8911 7.5ZM9.96721 7.5H9.54332L9.42195 7.50595L9.31422 7.52381C9.24695 7.53969 9.18878 7.5635 9.1397 7.59524L9.07291 7.64882L8.97814 7.74864L8.89371 7.84969L7.46524 9.84803L7.38563 9.96753L7.28914 10.1419C7.22849 10.264 7.17518 10.3975 7.12923 10.5425C7.10052 10.6332 7.07658 10.7254 7.05744 10.8193L7.03231 10.9614L7.00808 11.1791L7 11.4024V14.048L7.00808 14.1338L7.03231 14.2148C7.05385 14.2671 7.08616 14.3163 7.12923 14.3622C7.1637 14.3989 7.20009 14.4283 7.23841 14.4504L7.29734 14.478L7.35917 14.4945L7.42389 14.5H9.96721L10.0319 14.4945L10.1137 14.47C10.1665 14.4471 10.2159 14.4112 10.2619 14.3622C10.2906 14.3316 10.3145 14.2995 10.3337 14.2661L10.3588 14.2148L10.383 14.1338L10.3911 14.048V11.3362L10.3859 11.2635L10.363 11.1733C10.3415 11.1158 10.3078 11.0636 10.2619 11.0165C10.2331 10.9871 10.2031 10.9626 10.1717 10.943L10.1236 10.9173L10.0477 10.8925L9.96721 10.8843H9.46061L9.41054 10.8784L9.36369 10.8608C9.33353 10.8452 9.30553 10.8218 9.27969 10.7906C9.25901 10.7656 9.24578 10.7397 9.23999 10.7129L9.23688 10.6722L9.24495 10.63L9.26418 10.5866L10.4118 8.35984L10.4527 8.26952L10.4851 8.1638C10.5162 8.02478 10.4986 7.89354 10.4325 7.77008C10.3773 7.66719 10.303 7.5937 10.2096 7.54961L10.136 7.52205L10.0552 7.50551L9.96721 7.5Z" fill="#747474" />
          </svg>
        </div>
      </div>
      <div ref={FormRef} className={'pb-8 bg-white rounded z-50 top-4 left-1/2 transform -translate-x-36 w-[640px] border shadow-xl ' + (visible.value ? 'fixed' : 'hidden')}>
        <div className={'mx-auto'}>
          <div className={'px-8'}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
              Smart Annotations
            </div>
          </div>
          <div className={'max-h-[82vh] overflow-y-scroll pl-8 pr-4 mr-4 mt'}>
            <div className={'py-4 text-sm leading-6'}>
              <div className={'font-bold text-[#202020]'}>Create smart annotations from any URL</div>
              <p className={'text-[#595959] mt-2'}>Already using Hypothesis and want to add some annotations to spark a conversation? Get started by configuring your account below:</p>
            </div>
            <div className={''}>
              <div className={'text-xs text-[#747474] mb-1 flex justify-between'}>
                <div className="font-bold flex">
                  API Key
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
                    <div className="text-xs font-bold text-[#747474] mb-1">
                      Group
                    </div>
                    <div class="relative">
                      <select onChange={onGroupInput} value={group.value} class="">
                        {profileInfo.groups?.map(g => (
                          <option value={g.id}>{g.name}</option>
                        ))}
                      </select>
                      <img src={angleDown} className="pointer-events-none top-1/2 right-2 transform -translate-y-1/2 absolute"></img>
                    </div>
                  </div>
                  <div className={'w-full'}>
                    <div className="text-xs font-bold text-[#747474] mb-1">
                      Tags <span className={'font-normal'}>(optional)</span>
                    </div>
                    <input value={tags.value} onInput={onTagsInput} className={'inputtext w-full'} placeholder={'Enter tags (comma-separated)...'} type="text" />
                  </div>
                </div>
              </div>
              <div className={'mt-4'}>
                <div className="text-xs font-bold text-[#747474] mb-1">
                  URL to Annotate
                </div>
                <input value={url.value} onInput={onUrlInput} className={'inputtext w-full'} placeholder={'Enter URL to annotate...'} type="text" />
              </div>
              <div className={'mt-6'}>
                <div className={'w-full'}>
                  <div className="text-xs font-bold text-[#747474] mb-1">
                    Response Template <span className={'font-normal'}>(optional)</span>
                  </div>
                  <div class="relative -mt-[25px]">
                    <ResponseTemplateInput
                      WSsendMessage={value => { }}
                      handleSubmitButton={value => { handleResponseTemplateData(value) }}
                    // clearInputOnSubmit={true}
                    />
                  </div>
                </div>
              </div>
              <div className={'mt-4'}>
                <div className="text-xs font-bold text-[#747474] mb-1">
                  Prompt
                </div>
                <textarea value={prompt.value} onInput={onPromptInput} className={'inputtext w-full'} placeholder={'Enter your prompt...'} type="text" />
              </div>
            </div>
            <div className={'mt-4 flex justify-center ' + (annotationLoading.value ? '' : 'hidden')}>
              <Loading />
            </div>
            <div className={'mt-4 pb-2'}>
              <div className={'flex gap-1 mt-2 justify-end'}>
                <button disabled={annotationLoading.value} type="button" onClick={() => { visible.value = false }} className="btn-second">Cancel</button>
                <button disabled={annotationLoading.value} onClick={() => handleSubmit()} type="button" className="bg-[#595959] text-sm leading-6 font-bold text-white p-2 rounded flex items-center">{profileInfo.userid ? 'Create Annotations' : 'Next Step'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
