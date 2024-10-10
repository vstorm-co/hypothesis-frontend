import { refreshUserToken } from "./store/user-slice";
import { showToast } from "./store/ui-slice";
import { route } from 'preact-router';

import store from "./store";
const defaultUrl = import.meta.env.VITE_API_URL;

const callApi = async (url, options = {}, skip404 = false, isImage = false) => {
  const user = JSON.parse(localStorage.getItem('ANT_currentUser'));

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${user ? user.access_token : ''}`,
    }
  }
  if (!isImage) {
    defaultOptions.headers = { ...defaultOptions.headers, 'Content-Type': 'application/json' }
  }


  let mergedOptions = { ...defaultOptions, ...options };
  const mergedUrl = defaultUrl + url;

  const response = await fetch(mergedUrl, mergedOptions);

  if (!response.ok) {
    switch (response.status) {
      case 401:
        route(user.refresh_token ? '/refresh-token' : '/auth'); break;
      case 404:
        if (!skip404) {
          route('/_404'); break;
        } break;
    }
    if (user && response.status !== 401) {
      store.dispatch(showToast({ content: `Error occurred` }, true, response))
    };
    throw new Error('server error ocured')
  }

  return response.json();
}

export default callApi;