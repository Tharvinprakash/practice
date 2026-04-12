import axiosInstance from "./axios";

export const brandAPI = {
    create: (data) => axiosInstance.post(`/brand/create`,data),
    getBrands: () => axiosInstance.get(`/brand/`),
    getBrandById: (id) => axiosInstance.get(`/brand/${id}`),
    update: (id) => axiosInstance.put(`/brand/${id}`), 
    delete: (id) => axiosInstance.delete(`/brand/${id}`)
}