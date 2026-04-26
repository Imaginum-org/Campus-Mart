import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../Hooks/useUserContext";

const ProtectedLayout = () => {
  const { userDetails, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userDetails?._id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
