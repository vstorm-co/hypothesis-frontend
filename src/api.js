import { refreshUserToken } from "./store/user-slice";
import { route } from 'preact-router';

import store from "./store";
const defaultUrl = import.meta.env.VITE_API_URL;

const callApi = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem('ANT_currentUser'));

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${user ? user.access_token : ''}`,
      'Content-Type': 'application/json',
    },
  }


  let mergedOptions = { ...defaultOptions, ...options };
  const mergedUrl = defaultUrl + url;

  const response = await fetch(mergedUrl, mergedOptions);

  if (!response.ok) {
    if (user.refresh_token) {
      route('/refresh-token')
    } else {
      route('/auth');
    }
  }

  return response.json();
}

export default callApi;