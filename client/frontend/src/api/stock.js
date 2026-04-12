import axiosInstance from "./axios";

export const stockAPI = {
    getLowStocks: () => axiosInstance.get(`/stock/low-stock`)
}

