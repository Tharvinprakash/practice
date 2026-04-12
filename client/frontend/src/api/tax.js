import axiosInstance from "./axios";

export const taxAPI = {
    create: (data) => axiosInstance.post(`/tax/create`,data),
    getTaxes: () => axiosInstance.get(`/tax/`),
    getTaxById: (id) => axiosInstance.get(`/tax/${id}`),
    update: (id) => axiosInstance.put(`/tax/update/${id}`),
    delete: (id) => axiosInstance.delete(`/tax/delete/${id}`),
}

