import axiosInstance from "./axios";

export const dashboardAPI = {
    getRecentSales: () => axiosInstance.get(`/dashboard/recent-sales`),
    getRecentPurchases: () => axiosInstance.get(`/dashboard/recent-purchases`),
    topProductsOnSale: () => axiosInstance.get(`/dashboard/top-products-sale`),
    topProductsOnPurchase: () => axiosInstance.get(`/dashboard/top-products-purchase`),
    getTopSuppliers: () => axiosInstance.get(`/dashboard/top-suppliers`),
    getTopCustomers: () => axiosInstance.get(`/dashboard/top-customers`),
    totalSales: () => axiosInstance.get(`/dashboard/total-sales`),
    totalPurchases: () => axiosInstance.get(`/dashboard/total-purchases`),
    profit: () => axiosInstance.get(`/dashboard/total-profit`),
    getTotalCustomers: () => axiosInstance.get(`/dashboard/total-customers`),
    getTotalStaffs: () => axiosInstance.get(`/dashboard/total-staffs`),
    getTotalSuppliers: () => axiosInstance.get(`/dashboard//total-suppliers`)
}
