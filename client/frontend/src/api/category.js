import axiosInstance from "./axios";

export const categoryAPI = {
    addCategory: (data) => axiosInstance.post(`/category/add`,data),
    getCategory: () => axiosInstance.get(`/category/`),
    getCategoryById: (id) => axiosInstance.get(`/category/${id}`),
    updateCategory: (id) => axiosInstance.put(`/category/${id}`),
    deleteById: (id) => axiosInstance.delete(`/brand/${id}`),
    searchCategory: (name) => axiosInstance.get(`/brand/search/${name}`),
    sortByCategoryName: (asc) => axiosInstance.get(`/brand/sort/${asc}`)
}