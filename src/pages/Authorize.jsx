import { signal } from '@preact/signals';
import { Loading } from '../components/Loading';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/user-slice';
import { uiActions } from '../store/ui-slice';
import { route } from 'preact-router';

import docdrop from '../assets/images/docdrop.png';

const loading = signal(false);

function toggleLoading() {
  loading.value = !loading.value;
}

import google from '../assets/google.svg';
import arrow from '../assets/arrow.svg';
import { Message } from '../components/Message';

export function Authorize() {
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  dispatch(uiActions.setHideSideBar(true));

  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?code=${response.code}`).then(res => res.json()).catch(err => {
        toggleLoading();
      });

      dispatch(userActions.setUser(data));
      dispatch(uiActions.setOrganizationCreated(data.organization))
      dispatch(userActions.setUsers(data));

      toggleLoading();
      route('/setup')
    },
    flow: 'auth-code',
    onError: err => {
      toggleLoading();
    },
    onNonOAuthError: () => {
      toggleLoading();
    },
    scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly",
  })

  function runLogin() {
    toggleLoading();
    signIn();
  }

  let messages = [
    {
      created_by: 'bot',
      content: "Welcome to your new favorite collaborative chat tool **Docdrop chat**. To get started, you must first add an account, then you can create **chats, templates** or **invite others** to chat with you.",
    },
    {
      created_by: 'bot',
      content: "Add your Google account now:",
    },
  ]

  return (
    <div className={'w-full h-[100vh] bg-[#202020]'}>
      <div className={'w-[720px] mx-auto'}>
        <div className={'py-9 flex items-center'}>
          <img src={docdrop} className={'w-6'} alt="" />
          <h1 className={'font-bold ml-2 text-lg leading-6 text-white'}>Docdrop chat</h1>
          <div className={'text-sm leading-6 ml-4 text-[#747474]'}>
            Your Team and AI Everywhere
          </div>
        </div>
        <div className={'px-8 pb-8 bg-white rounded'}>
          <div className={'mx-auto'}>
            <div className={'text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
              Getting Started
            </div>
            <div className={'flex justify-center py-4 ' + (loading.value ? '' : 'hidden')}>
              <Loading />
            </div>
            <div className={(loading.value ? 'hidden' : '')}>
              <Message Message={messages[0]} />
              <Message Message={messages[1]} />
              <div className={'w-[240px] ml-14 -mt-4 border border-[#DBDBDB] rounded-lg ' + (loading.value ? 'hidden' : '')}>
                <div onClick={runLogin} className={'pl-2 py-2 flex items-center cursor-pointer'}>
                  <img src={google} alt="" />
                  <div className={'mx-4'}>
                    <div className={'text-sm leading-6 font-bold'}>Google</div>
                    <div className={'text-xs text-[#747474]'}>Click to Authorize</div>
                  </div>
                  <div className={'ml-auto p-3'}>
                    <img src={arrow} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}