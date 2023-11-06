import axiosClient from './axiosClient';

const accountApi = {
  getAccountProfile: (params) => {
    const url = '/account/me';
    return axiosClient.get(url, { params });
  },
  changePassword: (params) => {
    const url = '/change-password';
    return axiosClient.post(url, params);
  },
};

export default accountApi;
