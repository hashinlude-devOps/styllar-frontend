// utils/axiosClient.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface IConfig {
  apiBaseUrl: string;
  apiPathPrefix: string;
}

const config = (): IConfig => {
  switch (process.env['NODE_ENV']) {
    case 'production':
      return {
        apiBaseUrl: `${process.env['NEXT_PUBLIC_URL']}`,
        apiPathPrefix: 'api',
      };
    case 'development':
      return {
        apiBaseUrl: `${process.env['NEXT_PUBLIC_URL']}`,
        apiPathPrefix: 'api',
      };
    default:
      return {
        apiBaseUrl: 'http://localhost:8000',
        apiPathPrefix: 'api',
      };
  }
};

const configuration = config();
const baseUrl = `${configuration.apiBaseUrl}/`;

const client = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
});

export const axiosClient = async <T>(options: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    const response = await client.request<T>(options);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
