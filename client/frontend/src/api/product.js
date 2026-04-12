import axiosInstance from "./axios";

export const productAPI = {
    bulkUpload: (data) => axiosInstance.post(`/product/bulk-upload`,data,{
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }),
    uploadCheck: (data) => axiosInstance.post(`/product/upload`,data,{
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    }),
    exportProducts: (data) => axiosInstance.post(`/product/export-products`,data),
    addProduct: (data) => axiosInstance.post(`/product/add`,data),
    getProducts: () => axiosInstance.get(`/product/`),

    // Need to check
    pagination: (page,limit) => axiosInstance.get(`/product/pagination`,{
        params: {
            page: page,
            limit: limit
        }
    }),
    getProductById: (id) => axiosInstance.get(`/product/${id}`),
    updateProduct: (id) => axiosInstance.put(`/product/update/${id}`),
    deleteById: (id) => axiosInstance.delete(`/product/delete/${id}`),
    filterByCategory: (name) => axiosInstance.get(`/product/filter/${name}`),
    searchProduct: (name) => axiosInstance.get(`/product/search/${name}`),
    sortByProductName: (asc) => axiosInstance.get(`/product/sort/${asc}`),
}
