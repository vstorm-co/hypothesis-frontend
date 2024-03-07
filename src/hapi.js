import { route } from 'preact-router';

const defaultUrl = "https://hypothes.is/api";

const callhApi = async (url, options = {}, token = "") => {
  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }


  let mergedOptions = { ...defaultOptions, ...options };
  const mergedUrl = defaultUrl + url;

  const response = await fetch(mergedUrl, mergedOptions);

  return response.json();
}

export default callhApi;