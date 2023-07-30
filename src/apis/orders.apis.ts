import axios from 'axios';
import { getEnv } from '../env';

const ENV = getEnv();

export const addOrder = (payload: any) => {
  return axios.post(`${ENV.API_URL}/orders/add-new-order`, payload);
};

export const resolveOrder = (id: string, payload: any) => {
  return axios.patch(`${ENV.API_URL}/orders/${id}`, payload);
};

export const removeOrder = (id: string) => {
  return axios.delete(`${ENV.API_URL}/orders/${id}`);
};

export const getAllOrders = (role: string, params: any) => {
  return axios.get(`${ENV.API_URL}/orders`, { params });
};
