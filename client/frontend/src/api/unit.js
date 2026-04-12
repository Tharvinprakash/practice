import axiosInstance from "./axios";

export const unitAPI = {
    addUnit: (data) => axiosInstance.post(`/unit/add`,data),
    getUnits: () => axiosInstance.get(`/unit/`),
    getUnitById: (id) => axiosInstance.get(`/unit/${id}`),
    updateUnit: (id) => axiosInstance.put(`/unit/update/${id}`),
    deleteById: (id) => axiosInstance.delete(`/unit/delete/${id}`),
}

