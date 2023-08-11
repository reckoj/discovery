import axios from 'axios';
import { getEnv } from '../env';

const ENV = getEnv();

export const getStats = (token: string) => {
  return axios.get(`${ENV.API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStatsOrg = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/dashboard/org`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const getStatsUsers = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/dashboard/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};
