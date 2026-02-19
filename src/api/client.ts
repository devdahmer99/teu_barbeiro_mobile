import axios from 'axios';

import {API_BASE_URL, API_TIMEOUT_MS} from '@/config/env';

let authToken: string | null = null;

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/mobile`,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Interceptor para desempacotar respostas no formato Laravel { success, data, message }
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      // Se a resposta tem o formato { success, data, message }, extrai o 'data'
      const extracted = response.data.data;
      console.log('Extracted data:', extracted);
      response.data = extracted !== undefined ? extracted : response.data;
    }
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null) {
  authToken = token;
}
