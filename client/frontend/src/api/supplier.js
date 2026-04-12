import axiosInstance from "./axios";

export const supplierAPI = {
    addSupplier: (data) => axiosInstance.post(`/supplier/add`,data),
    getSuppliers: () => axiosInstance.get(`/supplier/`),
    getSupplierById: (id) => axiosInstance.get(`/supplier/${id}`),
    updateSupplier: (id) => axiosInstance.put(`/supplier/update/${id}`),
    deleteById: (id) => axiosInstance.delete(`/supplier/delete/${id}`)
}

