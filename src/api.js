const user = JSON.parse(localStorage.getItem('ANT_currentUser'))

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${user?.access_token}`,
    'Content-Type': 'application/json',
  },
}
const defaultUrl = import.meta.env.VITE_API_URL;

const callApi = async (url, options = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const mergedUrl = defaultUrl + url;

  const response = await fetch(mergedUrl, mergedOptions);

  if (!response.ok) {
    if (user.refresh_token) {
      let data = {
        refreshToken: user.refresh_token
      }

      const refreshToken = await fetch(`${defaultUrl}/auth/users/tokens`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (!refreshToken.ok) {
        throw new Error('API call failed: ');
      }
      else {
        throw new Error('No refresh token functionality yet')
        // console.log(refreshToken.json())
        // const reresponse = await fetch(mergedUrl, mergedOptions);

        // if (!reresponse.ok) {
        //   throw new Error('API call failed: ');

        // } else {
        //   return reresponse.json();
        // }
      }
    }
  }

  return response.json();
}

export default callApi;