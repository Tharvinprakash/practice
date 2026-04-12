import axiosInstance from "./axios";

export const quotationAPI = {
    create: (data) => axiosInstance.post(`/quotation/create`,data),
    getQuotation: () => axiosInstance.get(`/quotation/`),
    getQuotationById: (id) => axiosInstance.get(`/quotation/${id}`),
    update: (id) => axiosInstance.put(`/quotation/update/${id}`),
    delete: (id) => axiosInstance.delete(`/quotation/delete/${id}`),
}

