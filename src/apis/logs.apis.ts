import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const stateReason = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/logs/add-new-log`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};

export const stateReasonOrg = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/logs/org-add-new-log`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};

export const getLogs = (params: any, token: string) => {
    return axios.get(`${ENV.API_URL}/logs`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
};

export const removeLog = (id: string, token: string) => {
    return axios.delete(`${ENV.API_URL}/logs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};
