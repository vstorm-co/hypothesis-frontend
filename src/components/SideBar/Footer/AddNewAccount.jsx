import { signal } from '@preact/signals';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { userActions } from '../../../store/user-slice';
import { Loading } from '../../Loading';

import plus from '../../../assets/plus.svg';
import google from '../../../assets/google.svg';
import arrow from '../../../assets/arrow.svg';
import { route } from 'preact-router';
import { uiActions } from '../../../store/ui-slice';


const showAddAccount = signal(false);
const loading = signal(false);

function toggleShowAddAccount() {
  showAddAccount.value = !showAddAccount.value;
}

function toggleLoading() {
  loading.value = !loading.value;
}

export function AddNewAccount() {
  const dispatch = useDispatch();

  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify?code=${response.code}`).then(res => res.json()).catch(err => {
      });

      dispatch(userActions.setUser(data));
      dispatch(uiActions.setOrganizationCreated(data.organization))
      dispatch(userActions.setUsers(data));

      route('/setup');

      toggleShowAddAccount();
      toggleLoading();
      dispatch(uiActions.setHideSideBar(true));
    },
    flow: 'auth-code',
    scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly",
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
    <div className={'relative'}>
      <div onClick={toggleShowAddAccount} className={'flex px-3 py-2 border border-dashed hover:bg-[#0F0F0F] group rounded border-[#595959] mt-3 cursor-pointer'}>
        <div className={'flex items-center text-[#747474] group-hover:text-[#DBDBDB]'}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.99303 0.866825L7 1V4.999L11 5C11.5523 5 12 5.44772 12 6C12 6.51284 11.614 6.93551 11.1166 6.99327L11 7H7V11C7 12.2874 5.13555 12.3317 5.00697 11.1332L5 11V7H1C0.447715 7 0 6.55228 0 6C0 5.48716 0.38604 5.06449 0.883379 5.00673L1 5H5V1C5 -0.287356 6.86445 -0.331748 6.99303 0.866825Z" fill="currentColor" />
          </svg>
        </div>
        <div className={'ml-4 text-sm leading-6'}>Add New Account</div>
      </div>
      <div className={'absolute z-20 w-[240px] border border-[#747474] bg-[#0F0F0F] rounded -bottom-2 left-[20rem] ' + (showAddAccount.value ? '' : 'hidden')}>
        <div className={'flex items-center justify-between border-b border-[#595959]'}>
          <div className={'text-xs pl-4 py-3 font-bold'}>Add New Account</div>
          <div onClick={toggleShowAddAccount} className={'border rounded border-[#595959] mr-2 cursor-pointer'}>
            <img className={'p-1 transform rotate-45'} src={plus} alt="" />
          </div>
        </div>
        <div>
          <div className={'flex justify-center py-4 ' + (loading.value ? '' : 'hidden')}>
            <Loading />
          </div>
          <div className={(loading.value ? 'hidden' : '')}>
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
  )
}