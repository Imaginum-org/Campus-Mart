import axios from "../../../services/axiosInstance";

// Get all products (with optional filters, pagination, search, etc.)
export const getProducts = (params = {}) => {
  return axios.get("/api/product", { params });
};

// Get single product by ID
export const getProductById = (id) => {
  return axios.get(`/api/product/${id}`);
};
