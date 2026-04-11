import { LogOut } from "lucide-react";

export const baseURL = "http://localhost:5000"; 

const SummaryApi = { 
    register: {
        url: '/api/auth/register',
        method: 'post'
    },
    login: {
        url: '/api/auth/login', 
        method: 'post'
    },
    otpVerification: {
        url: '/api/auth/verify-forgot-password-otp', 
        method: 'put'
    },
    userProfile:{
        url: '/api/user/userProfile',
        method: 'get'
    },
    deleteAccount: {
        url: '/api/user/deleteAccount',
        method: 'delete'
    },
    logoutUser:{
        url: '/api/auth/logoutUser',
        method: 'get'
    },
    forgot_password:{
        url: '/api/auth/forgot-password',
        method: 'post'
    },
    reset_password: {
        url: '/api/auth/reset-password/',
        method: 'post'
    },
    resend_verification: {
        url: '/api/auth/resend-verification',
        method: 'post'
    },
    verify_email: {
        url: '/api/auth/verify-email',
        method: 'post'
    }

};

export default SummaryApi;