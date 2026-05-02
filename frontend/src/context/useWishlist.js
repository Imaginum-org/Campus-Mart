import { useState, useCallback } from "react";
import axios from "../services/axiosInstance.js";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/wishlist");

      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWishlist = useCallback(async (productId, productData = null) => {
    try {
      const response = await axios.post("/api/wishlist/toggle", {
        productId,
      });

      if (response.data.success) {
        if (response.data.data.isInWishlist) {
          // ADD
          if (productData) {
            setWishlist((prev) => [...prev, productData]);
          } else {
            setWishlist((prev) => [...prev, productId]);
          }
        } else {
          // REMOVE
          setWishlist((prev) =>
            prev.filter((item) => {
              const itemId = typeof item === "string" ? item : item._id;
              return itemId !== productId;
            }),
          );
        }

        return response.data.data.isInWishlist;
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  }, []);

  const checkProductInWishlist = useCallback(async (productId) => {
    try {
      const response = await axios.get(`/api/wishlist/check/${productId}`);

      if (response.data.success) {
        return response.data.data.isInWishlist;
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }

    return false;
  }, []);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => {
        const itemId = typeof item === "string" ? item : item._id;
        return itemId === productId;
      });
    },
    [wishlist],
  );

  const addToWishlist = useCallback(async (productId) => {
    try {
      const response = await axios.post("/api/wishlist/add", {
        productId,
      });

      if (response.data.success) {
        setWishlist(response.data.data);
        return true;
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const response = await axios.post("/api/wishlist/remove", {
        productId,
      });

      if (response.data.success) {
        setWishlist((prev) =>
          prev.filter((item) => {
            const itemId = typeof item === "string" ? item : item._id;
            return itemId !== productId;
          }),
        );

        return true;
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  }, []);

  return {
    wishlist,
    loading,
    fetchWishlist,
    toggleWishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    checkProductInWishlist,
    setWishlist,
  };
};
