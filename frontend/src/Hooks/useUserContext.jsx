import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { baseURL } from "../Common/SummaryApi";
import SummaryApi from "../Common/SummaryApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // start true
  const hasFetchedRef = useRef(false); // prevents multiple API calls

  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem("cachedUserDetails");
      const authStatus = localStorage.getItem("isAuthenticated");

      if (cachedUser) {
        setUserDetails(JSON.parse(cachedUser));
      }

      if (authStatus === "true") {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Error reading cache:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    // Prevent duplicate calls
    if (hasFetchedRef.current) return;

    const authStatus = localStorage.getItem("isAuthenticated");
    if (!authStatus || authStatus !== "true") return;

    hasFetchedRef.current = true;

    try {
      setLoading(true);

      const response = await axios({
        method: SummaryApi.userProfile.method,
        url: `${baseURL}${SummaryApi.userProfile.url}`,
        withCredentials: true,
      });

      if (response.data.success) {
        const user = response.data.user;

        setUserDetails(user);
        setIsLoggedIn(true);

        // cache
        localStorage.setItem("cachedUserDetails", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        clearUserData();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserDetails = useCallback((updatedFields) => {
    setUserDetails((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...updatedFields };

      localStorage.setItem("cachedUserDetails", JSON.stringify(updated));

      return updated;
    });
  }, []);

  const clearUserData = useCallback(() => {
    setUserDetails(null);
    setIsLoggedIn(false);
    hasFetchedRef.current = false;

    localStorage.removeItem("cachedUserDetails");
    localStorage.removeItem("isAuthenticated");
  }, []);

  useEffect(() => {
    if (isLoggedIn && !userDetails) {
      fetchUserProfile();
    }
  }, [isLoggedIn, userDetails, fetchUserProfile]);

  return (
    <UserContext.Provider
      value={{
        userDetails,
        isLoggedIn,
        loading,
        fetchUserProfile,
        updateUserDetails,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
