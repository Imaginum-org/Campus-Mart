import axios from "../../../services/axiosInstance";

export const searchProducts = (query) => {
  return axios.get("/api/product/search", {
    params: { q: query },
  });
};
