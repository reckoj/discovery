import axios from 'axios';
import { getEnv } from '../env';

const ENV = getEnv();

export const getAllContacts = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const addContact = (payload: any, token: string) => {
  return axios.post(`${ENV.API_URL}/contacts/add-new-contact`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateContact = (payload: any, conId: string, token: string) => {
  return axios.patch(`${ENV.API_URL}/contacts/${conId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeContact = (id: string, token: string) => {
  return axios.delete(`${ENV.API_URL}/contacts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeAFile = (file: any, token: string) => {
  return axios.post(`${ENV.API_URL}/contacts/file/`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getContact = (id: string, token: string) => {
  return axios.get(`${ENV.API_URL}/contacts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
