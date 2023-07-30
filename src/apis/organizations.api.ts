import axios from 'axios';
import { getEnv } from '../env';

const ENV = getEnv();

export const loginOrganization = (payload: any) => {
  return axios.post(`${ENV.API_URL}/organizations/login-organization`, payload);
};

export const addOrganization = (payload: any, token: string) => {
  return axios.post(
    `${ENV.API_URL}/organizations/add-new-organization`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateOrganization = (
  payload: any,
  orgId: string,
  token: string
) => {
  return axios.patch(`${ENV.API_URL}/organizations/${orgId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAlOrganizations = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/organizations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params
  });
};

export const addOrganizationUser = (payload: any, token: string) => {
  return axios.post(`${ENV.API_URL}/users/add-new-user/organization`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrganizationUser = (
  payload: any,
  id: string,
  token: string
) => {
  return axios.patch(`${ENV.API_URL}/users/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrganizationUsers = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/users/organization`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const getOrganizationCustomers = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/users/organization-customer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const getOrganizationContacts = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/users/organization-contact`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const getOrganizationAdmins = (params: any, token: string) => {
  return axios.get(`${ENV.API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

export const removeOrganization = (id: string, token: string) => {
  return axios.delete(`${ENV.API_URL}/organizations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrganization = (id: string, token: string) => {
  return axios.get(`${ENV.API_URL}/organizations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
