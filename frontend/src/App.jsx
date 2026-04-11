import { useState, useEffect } from "react";
import "./App.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Profile from "./Pages/Profile";
import Termscondition from "./Pages/Termscondition";
import Notification from "./Pages/Notification";
import Myorders from "./Pages/Myorders";
import Wishlist from "./Pages/Wishlist";
import ProductListed from "./Pages/ProductListed";
import ContactUs from "./Pages/ContactUs";
import Home from "./Pages/Home";
import ProductDescription from "./Pages/ProductDescription";
import ProductListing from "./Pages/ProductListing";
import PricingModel from "./Pages/PricingModel";
import Chat from "./Pages/Chat";
import { Toaster } from "react-hot-toast";
import Loader from "./Components/Loder";
import ProductCategory from "./Pages/ProductCategory.jsx"
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import CheckEmail from "./Pages/CheckEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkEmail" element={<CheckEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={
            <ResetPassword/>

          } />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/notification" element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>

        } />
        <Route path="/myorders" element={
          <ProtectedRoute>
            <Myorders />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/productlisted" element={
          <ProtectedRoute>
            <ProductListed />
          </ProtectedRoute>

        } />
        <Route path="/termscondition" element={
          <ProtectedRoute>
            <Termscondition />
          </ProtectedRoute>

        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        } />
        <Route path="/product" element={
          <ProtectedRoute>
            <ProductDescription />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <ProductListing />
          </ProtectedRoute>
        } />
        <Route path="/price" element={
          <ProtectedRoute>
            <PricingModel />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/category/:categoryName" element={
          <ProtectedRoute>
            <ProductCategory />
          </ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;