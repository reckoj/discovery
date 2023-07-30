import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const signupUser = (payload: any, code: string) => {
    return axios.post(`${ENV.API_URL}/users/verify-account/${code}`, payload)
};

export const loginUser = (payload: any) => {
    return axios.post(`${ENV.API_URL}/users/login-user`, payload)
};

export const getVerificationCode = (payload: any) => {
    return axios.post(`${ENV.API_URL}/users/signup-user`, payload)
};

export const addUser = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/users/add-new-user`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};

export const getAlUsers = (params: any, token: string) => {
    return axios.get(`${ENV.API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
};

export const removeUser = (id: any, token: string) => {
    return axios.delete(`${ENV.API_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};

export const updateUser = (id: any, payload: any, token: string) => {
    return axios.patch(`${ENV.API_URL}/users/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};