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
      dispatch(userActions.setUsers(data));

      route('/setup');

      toggleShowAddAccount();
      toggleLoading();
      dispatch(uiActions.setHideSideBar(true));
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
    <div className={'relative'}>
      <div onClick={toggleShowAddAccount} className={'flex px-3 py-2 border border-dashed hover:bg-[#0F0F0F] rounded border-[#595959] mt-3 cursor-pointer'}>
        <img src={plus} alt="" />
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