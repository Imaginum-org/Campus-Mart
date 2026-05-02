import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useUser } from "../context/useUserContext.jsx";
import { logoutUser } from "../features/auth/api/authApi";
import { getProducts } from "../features/product/api/productApi";

function Home() {
  const { userDetails, clearUserData } = useUser();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products using API layer
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Proper logout
  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      if (response.data.success) {
        clearUserData();
        toast.success("User Logged out");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div>
      <h1>Welcome {userDetails?.name || "User"}</h1>

      <button onClick={handleLogout}>Logout</button>

      <div>
        {products.map((item, index) => (
          <ul key={index}>
            <span>
              {item.title} : {item.selling_price}
            </span>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default Home;
