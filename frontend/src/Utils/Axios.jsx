import axios from 'axios'
import { baseURL } from "../Common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

Axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
      
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(Axios(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {}, {
          withCredentials: true
        })

        if (response.data.success) {
          const { accessToken } = response.data.data
          isRefreshing = false
          onRefreshed(accessToken)
          return Axios(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/login'
        isRefreshing = false
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default Axios
