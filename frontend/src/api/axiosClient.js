// api/axiosClient.js
import axios from 'axios';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import LogHelper from 'general/helpers/LogHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import UserHelper from 'general/helpers/UserHelper';
import queryString from 'query-string';

const sTag = '[AxiosClient]';

// Cai dat config mac dinh cho http request
// Tham khao: `https://github.com/axios/axios#request-config`
// de xem chi tiet
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  // LogHelper.log(`${sTag} - ${config.baseURL}${config.url}, ${config.method}, ${config.method === 'post' ? JSON.stringify(config.data) : JSON.stringify(config.params)}`);
  LogHelper.log(`${sTag} - headers: ${JSON.stringify(config.headers.common)}`);
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
      UserHelper.signOut();
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
    const token = localStorage.getItem(PreferenceKeys.accessToken);
    updateAxiosAccessToken(token);
  } else {
    UserHelper.signOut();
  }
})();

export { updateAxiosAccessToken, removeAxiosAccessToken, updateAxiosBaseURL };

export default axiosClient;
