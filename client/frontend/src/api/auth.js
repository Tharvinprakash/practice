import axiosInstance from "./axios";

export const authAPI = {
    register: (data) => axiosInstance.post(`/auth/register`,data),
    login : (data) => axiosInstance.post(`/auth/login`,data),

    // Need To Check
    googleLogin : (data) => axiosInstance.get(`/auth//google`,data),
    googleCallback : (data) => axiosInstance.get(`/auth/google/callback`,data),


    forgotPassword: (data) => axiosInstance.post(`/auth/forgotpassword`,data),
    verify: (data) => axiosInstance.post(`/auth/verify`,data),
    resetPassword: (data) => axiosInstance.post(`/auth/resetpassword`,data)
}