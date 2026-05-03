import axios from "../../../services/axiosInstance";

// Get all products (with optional filters, pagination, search, etc.)
export const getProducts = (params = {}) => {
  return axios.get("/api/product", { params });
};

// Get single product by ID
export const getProductById = (id) => {
  return axios.get(`/api/product/${id}`);
};

// Get user's products
export const getUserProducts = () => {
  return axios.get("/api/product/user/my-products");
};

// Create a new product
export const createProduct = (data) => {
  return axios.post("/api/product", data);
};

export const deleteProduct = (productId) => {
  return axios.delete(`/api/product/${productId}`);
};

export const unlistProduct = (productId) => {
  return axios.patch(`/api/product/${productId}/unlist`);
};

export const relistProduct = (productId) => {
  return axios.patch(`/api/product/${productId}/relist`);
};
