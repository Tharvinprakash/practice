import axiosInstance from "./axios";

export const paymentAPI = {
    create: (data) => axiosInstance.post(`/payment/create`,data),
    getPayments: () => axiosInstance.get(`/payment/`),
    getPaymentById: (id) => axiosInstance.get(`/payment/${id}`),
    update: (id) => axiosInstance.put(`/payment/update/${id}`),
    delete: (id) => axiosInstance.delete(`/payment/delete/${id}`),
}

