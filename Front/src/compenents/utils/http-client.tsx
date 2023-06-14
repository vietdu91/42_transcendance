import axios, { AxiosRequestConfig } from 'axios';

export const httpClient = {
    post: (url: string, data: any, config?: AxiosRequestConfig) => axios.post(url, data, { withCredentials: true, ...config }),
    get: (url: string, config?: AxiosRequestConfig) => axios.get(url, { withCredentials: true, ...config }),
};