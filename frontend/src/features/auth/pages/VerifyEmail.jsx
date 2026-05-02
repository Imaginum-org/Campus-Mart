import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import axios from "../../../services/axiosInstance";
import Loader from "../../../components/ui/Loader.jsx";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const code = searchParams.get("code");

      if (!code) {
        toast.error("Invalid verification link.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.post("/api/auth/verify-email", {
          code,
        });

        if (response.data.success) {
          toast.success("Email verified successfully! Please log in.");
          navigate("/login");
        } else {
          toast.error(response.data.message || "Verification failed.");
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Verification failed.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (loading) {
    return <Loader />;
  }

  return null;
}

export default VerifyEmail;
