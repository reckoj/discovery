import axios from "axios";
import { getEnv } from "../env";

const ENV = getEnv();

export const getUserNotes = (userId: string, token: string) => {
    return axios.get(`${ENV.API_URL}/notes/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const postUserNotes = (payload: any, token: string) => {
    return axios.post(`${ENV.API_URL}/notes/add-new-notes`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}