import axiosInstance from "./axios";

export const stripeAPI = {
    getPaymentSuccess: (userId,orderId) => axiosInstance.get(`/stripe-payment/payment-success`,{
        params: {
            userId: userId,
            orderId: orderId
        }
    }),
    getPaymentFail: (userId,orderId) => axiosInstance.get(`/stripe-payment/payment-failed`,{
        params: {
            userId: userId,
            orderId: orderId
        }
    })
}


