import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const getAllCustomers = (params: any, token: string) => {
    return axios.get(`${ENV.API_URL}/customers`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
};

export const addCustomer = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/customers/add-new-customer`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export const updateCustomer = (payload: any, cusId: string, token: string) => {
    return axios.patch(`${ENV.API_URL}/customers/${cusId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export const removeCustomer = (id: string, token: string) => {
    return axios.delete(`${ENV.API_URL}/customers/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export const removeAFile = (file: any, token: string) => {
    return axios.post(`${ENV.API_URL}/customers/file/`, file, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export const getUser = (id: string, token: string) => {
    return axios.get(`${ENV.API_URL}/customers/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};