import axiosInstance from "./axios";

export const orderAPI = {
    create: (data) => axiosInstance.post(`/order/create`,data),
    bulkUpload: (data) => axiosInstance.post(`/order/bulk-upload`,data,{
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }),

    // Need to check later
    exportOrders: (data) => axiosInstance.get(`/order/export-orders`,data),

    getOrders: (data) => axiosInstance.get(`/order/orders`)
}
