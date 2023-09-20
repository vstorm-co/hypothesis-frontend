import { signal } from '@preact/signals';
import { Loading } from '../components/Loading';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';
import { useLocation } from 'preact-iso';


const loading = signal(false);

function toggleLoading() {
  loading.value = !loading.value;
}

import google from '../assets/google.svg';
import arrow from '../assets/arrow.svg';

export function Authorize() {
  const dispatch = useDispatch();
  const location = useLocation();

  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?code=${response.code}`).then(res => res.json()).catch(err => {
        toggleLoading();
      });

      dispatch(userActions.setUser(data));
      dispatch(userActions.setUsers(data));

      toggleLoading();
      location.route('/setup')
    },
    flow: 'auth-code',
    onError: err => {
      toggleLoading();
    },
    onNonOAuthError: () => {
      toggleLoading();
    }
  })

  function runLogin() {
    toggleLoading();
    signIn();
  }

  return (
    <div className={'mx-auto mt-6'}>
      <div className={'w-[720px] text-[#595959] font-bold text-lg leading-6 py-5 text-center border-b border-[#DBDBDB]'}>
        Authorize an Account to Begin
      </div>
      <div className={'flex justify-center py-4 ' + (loading.value ? '' : 'hidden')}>
        <Loading />
      </div>
      <div className={'w-[320px] mx-auto mt-4 border border-[#DBDBDB] rounded ' + (loading.value ? 'hidden' : '')}>
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
  )
}