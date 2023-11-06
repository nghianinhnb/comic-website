import axiosClient from './axiosClient';

const authApi = {
  signIn: (params) => {
    const url = '/sign-in';
    return axiosClient.post(url, params);
  },
  logOut: (params) => {
    const url = '/log-out';
    return axiosClient.post(url, params);
  },
  signUp: (params) => {
    const url = '/sign-up';
    return axiosClient.post(url, params);
  },
};

export default authApi;
