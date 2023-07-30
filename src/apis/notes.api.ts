import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const getNotes = (params: any, token: string) => {
    return axios.get(`${ENV.API_URL}/notes/all/admin`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
};

export const removeNote = (id: string, token: string) => {
    return axios.delete(`${ENV.API_URL}/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
};
