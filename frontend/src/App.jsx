import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

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
import ProductCategory from "./Pages/ProductCategory.jsx";

import CheckEmail from "./Pages/CheckEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";

import MainLayout from "./Layouts/MainLayout.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/category/:categoryName" element={<ProductCategory />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkEmail" element={<CheckEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/myorders" element={<Myorders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/productlisted" element={<ProductListed />} />
            <Route path="/termscondition" element={<Termscondition />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/upload" element={<ProductListing />} />
            <Route path="/price" element={<PricingModel />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
