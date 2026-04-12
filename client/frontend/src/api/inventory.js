import axiosInstance from "./axios";

export const inventoryAPI = {
    bulkUpload: (data) => axiosInstance.post(`/inventory/bulk-upload`,data,{
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }),
    exportInventory: (data) => axiosInstance.get(`/inventory/export-inventories`,data),
    addInventory: (data) => axiosInstance.post(`/inventory/add`,data),
    getInventory: () => axiosInstance.get(`/inventory/`),
    getInventoryById: (id) => axiosInstance.get(`/inventory/${id}`),
    updateInventory: (id) => axiosInstance.put(`/inventory/update/${id}`),
    deleteById: (id) => axiosInstance.delete(`/inventory/delete/${id}`),
    filterInventoryByPaymentStatus: (data) => axiosInstance.post(`/inventory/filter/${id}`,data)
}
