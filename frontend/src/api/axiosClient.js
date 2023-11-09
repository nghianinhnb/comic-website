// api/axiosClient.js
import axios from 'axios';
import ToastHelper from 'shared/helpers/ToastHelper';

const sTag = '[AxiosClient]';

// Cai dat config mac dinh cho http request
// Tham khao: `https://github.com/axios/axios#request-config`
// de xem chi tiet
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  }
});

axiosClient.interceptors.request.use(async (config) => {
  console.log(`${sTag} - headers: ${JSON.stringify(config.headers.common)}`);
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    LogHelper.log(`${sTag} - ${error}`);

    const { status, data } = error.response || {};

    if (status === 401) {
      window.location.href = '/dang-nhap';
    }

    data?.message?.forEach(ToastHelper.showError);

    throw error;
  }
);

// Update base url
const updateAxiosBaseURL = (baseUrl) => {
  axiosClient.defaults.baseURL = baseUrl;
};

// Update access token
const updateAxiosAccessToken = (accessToken) => {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

// Remove access token
const removeAxiosAccessToken = () => {
  delete axiosClient.defaults.headers.common['Authorization'];
};

(() => {
  const isTokenValid = UserHelper.checkAccessTokenValid();
  if (isTokenValid) {
    updateAxiosAccessToken(token);
  } else {
    UserHelper.signOut();
  }
})();

export { updateAxiosAccessToken, removeAxiosAccessToken, updateAxiosBaseURL };

export default axiosClient;
