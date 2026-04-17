import React, { useState, useEffect } from "react";
import Loader from "../Components/Loder.jsx";
import Profile_left_part from "../Components/Profile_left_part";
import AlertDialogDemo from "../Components/Deletebutton";
import AvatarComponent from "../Components/AvatarComponent";

import { toast } from "react-hot-toast";
import EditButton from "../Components/editbutton";
import SecuritySettings from "../Components/SecuritySettings";
import Header from "../Components/Header";
import AddressModal from "../Components/AddressModal";
import { Pencil, Trash2 } from "lucide-react";
import bag from "../assets/bag.png";
import bluebag from "../assets/bluebag.png";
import { FiLogOut } from "react-icons/fi";
import StatsPanel from "../Components/StatsPanel";
import { baseURL } from "../Common/SummaryApi.js";
import axios from "axios";
import SummaryApi from "../Common/SummaryApi.js";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [gender, setGender] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);


  const fetchAddresses = async () => {
    try {
      const response = await axios({
        method: SummaryApi.getUserAddresses.method,
        url: `${baseURL}${SummaryApi.getUserAddresses.url}`,
        withCredentials: true
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  // Handle saving address (create or update)
  const handleSaveAddress = async (addressData) => {
    try {
      let response;

      if (editingIndex !== null) {

        const addressId = addresses[editingIndex]._id;
        response = await axios({
          method: SummaryApi.updateAddress.method,
          url: `${baseURL}${SummaryApi.updateAddress.url}${addressId}`,
          data: addressData,
          withCredentials: true
        });
      } else {

        response = await axios({
          method: SummaryApi.createAddress.method,
          url: `${baseURL}${SummaryApi.createAddress.url}`,
          data: addressData,
          withCredentials: true
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || "Address saved successfully");
        await fetchAddresses(); 
        setIsModalOpen(false);
        setEditingIndex(null);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage = error.response?.data?.message || "Failed to save address";
      toast.error(errorMessage);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileChanged) return true;

    try {
      setIsSavingProfile(true);
      const updateData = { mobile: phone };
      if (gender) updateData.gender = gender;

      const response = await axios({
        method: SummaryApi.updateProfile.method,
        url: `${baseURL}${SummaryApi.updateProfile.url}`,
        data: updateData,
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully");
        setUserDetails(response.data.user);
        setProfileChanged(false);
        return true;
      }

      return false;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleProfileEdit = async () => {
    if (!isProfileEditing) {
      setIsProfileEditing(true);
      return;
    }

    const saved = await handleSaveProfile();
    if (saved) {
      setIsProfileEditing(false);
    }
  };

 
  const handleDeleteAddress = async (index) => {
    try {
      const addressId = addresses[index]._id;
      const response = await axios({
        method: SummaryApi.deleteAddress.method,
        url: `${baseURL}${SummaryApi.deleteAddress.url}${addressId}`,
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Address deleted successfully");
        await fetchAddresses(); 
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  // Handle setting address as default
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await axios({
        method: SummaryApi.setDefaultAddress.method,
        url: `${baseURL}${SummaryApi.setDefaultAddress.url}${addressId}/default`,
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Default address updated successfully");
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error?.response || error);
      const fallbackStatus = error.response?.status;
      if (fallbackStatus === 404 || fallbackStatus === 405 || fallbackStatus === 500) {
        try {
          const fallbackResponse = await axios({
            method: SummaryApi.updateAddress.method,
            url: `${baseURL}${SummaryApi.updateAddress.url}${addressId}`,
            data: { isDefault: true },
            withCredentials: true,
          });

          if (fallbackResponse.data.success) {
            toast.success("Default address updated successfully");
            await fetchAddresses();
            return;
          }
        } catch (fallbackError) {
          console.error("Fallback default address update failed:", fallbackError?.response || fallbackError);
        }
      }

      const errorMessage = error.response?.data?.message || error.message || "Failed to set default address";
      toast.error(errorMessage);
    }
  };

  // Handle editing address
  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleAddAddress = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };
            
  const handleLogout = async () => {
    try {
     
      const response =await axios({
          method : SummaryApi.logoutUser.method,
          url : `${baseURL}${SummaryApi.logoutUser.url}`,
          withCredentials : true
        });

      if (response.data.success) {
        localStorage.removeItem("isAuthenticated");
      
        toast.success("Logged out successfully");
      
        navigate("/login"); 
      }
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try{

        const response =await axios({
          method : SummaryApi.userProfile.method,
          url : `${baseURL}${SummaryApi.userProfile.url}`,
          withCredentials : true
        });
        if(response.data.success){
          setUserDetails(response.data.user);
          setPhone(response.data.user?.mobile || "");
          setGender(response.data.user?.gender || "");
        }
      }
      catch(error){
       if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        } else {
          toast.error("Failed to load profile data");
        }
      }
      finally {
        setLoading(false);
      }

    }
    fetchUserProfile();
  },[navigate])

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-[#131313]"><Loader /></div>;
  }

  return (
    <>
      <div className="w-full h-screen overflow-hidden dark:bg-[#131313]">
        <Header bagUrl={bag} darkUrl={bluebag} />

        <div className="flex h-[calc(100vh-70px)]">
          {/* LEFT PANEL */}
          <div className="hidden md:block md:w-[37%] lg:w-[28%] xl:w-[26%] pt-[3.5vh] pl-[2vw] pr-[1.75vw] pb-[2vh] bg-[#FBFBFB]  dark:bg-[#131313] xl:pt-[2.5vh] xl:-mr-4 xl:pb-0">
            <Profile_left_part />
          </div>

          {/* RIGHT PANEL */}
          <div className="h-full md:w-[63%] lg:w-[72%] xl:w-[73.5%] overflow-y-auto no-scrollbar bg-[#FBFBFB] dark:bg-[#131313]">
            {/* PROFILE BANNER */}
            <div className="bg-white dark:bg-[#1A1D20] rounded-t-2xl shadow mx-[3vw] mt-[5vh] overflow-hidden xl:mt-[2.5vh]">
              <div className="bg-gradient-to-l from-[#364EF2] to-[#534FF2] flex items-center px-[3vw] py-[2vh] xl:py-[2.5vh]">
                <div className="relative">
                  <div className="bg-[#292929] rounded-full p-1 border-white border shadow">
                    <AvatarComponent
                      name={userDetails?.name}
                      imageUrl={userDetails?.avatar}
                      size="large"
                      className="w-[70px] h-[70px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col ml-[2vw] xl:ml-[1vw] font-poppins">
                  <div className="text-white text-[22px] font-medium xl:text-[20px]">
                    {userDetails?.name || "User"} 
                  </div>
                  <div className="text-white text-sm opacity-80 font-light">
                    Member since October 2022
                  </div>
                </div>
              </div>
            </div>

            <StatsPanel />

            {/* PERSONAL INFO */}
            <div className="bg-white dark:bg-[#1A1D20] rounded-2xl shadow mt-[3vh] mx-[3vw] p-[3vh] xl:p-[5vh] relative font-poppins">
              <div className="text-xl dark:text-[#D7D7D7] xl:text-lg font-semibold mb-4">
                Personal Information
              </div>

              <div className="grid grid-cols-2 gap-y-4 xl:px-3">
                <div className="flex-col items-center">
                  <div className="text-[#848484] dark:text-[#848484] text-sm">
                    Name
                  </div>
                  <div className="text-lg xl:mt-1 dark:text-[#BBC2C9]">
                    {userDetails?.name || "User"}
                  </div>
                </div>

                <div className="flex-col items-center">
                  <div className="text-[#848484] dark:text-[#848484] text-sm">
                    Email
                  </div>
                  <div className="text-lg xl:mt-1 dark:text-[#BBC2C9]">
                   {userDetails?.email} 
                  </div>
                </div>

                <div className="flex-col items-center">
                  <div className="text-[#848484] text-sm dark:text-[#848484]">
                    Phone
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setProfileChanged(true);
                    }}
                    placeholder="+91XXXXXXXXXX"
                    disabled={!isProfileEditing}
                    className={`bg-transparent border p-1 rounded xl:mt-1 outline-none dark:border-[#848484] ${
                      !isProfileEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div className="flex-col items-center">
                  <div className="text-[#848484] text-sm dark:text-[#848484]">
                    Gender
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setProfileChanged(true);
                    }}
                    disabled={!isProfileEditing}
                    className={`bg-transparent border p-2 rounded xl:mt-1 outline-none dark:border-[#848484] dark:bg-[#2D3339] dark:text-white ${
                      !isProfileEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="absolute top-9 right-6">
                <EditButton isEditing={isProfileEditing} onClick={handleToggleProfileEdit} />
              </div>
            </div>

            <SecuritySettings />

            {/* ADDRESS SECTION */}
            <div className="bg-white dark:bg-[#1A1D20] rounded-2xl shadow mt-[3vh] mx-[3vw] p-[3vh] xl:p-[5vh] font-poppins">
              <div className="text-xl xl:text-lg font-semibold mb-4 dark:text-[#D7D7D7]">
                Addresses
              </div>

              <div className="flex flex-wrap gap-4">
                {addresses.map((addr, index) => (
                  <div
                    key={addr._id || index}
                    className={`rounded-xl p-4 xl:px-8 xl:py-5 w-[90%] md:w-[45%] xl:w-[38%] relative transition-all duration-200 ${
                      addr.isDefault
                        ? "bg-gradient-to-br from-[#E5E8FF] to-[#F0F2FF] dark:from-[#2D3339] dark:to-[#383D44] border-2 border-[#364EF2] dark:border-[#364EF2] shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30"
                        : "bg-[#F2F4FF] dark:bg-[#2D3339]"
                    }`}
                  >
                    {/* Default Address Ring Indicator */}
                    {addr.isDefault && (
                      <div className="absolute -top-3 -left-3 bg-[#364EF2] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </div>
                    )}

                    <div className={`font-semibold mb-1 ${addr.isDefault ? "text-[#364EF2] dark:text-[#6B9AFF]" : "dark:text-[#EBEDFF]"}`}>
                      {addr.isDefault ? "📍 Default Address" : `Address ${index + 1}`}
                    </div>

                    <div className="text-sm opacity-80 dark:text-[#7991A4]">
                      <div>{addr.line1}</div>
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-4 mb-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 absolute bottom-3 right-3">
                      <button onClick={() => handleDeleteAddress(index)}>
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                      <button
                        onClick={() => handleEditAddress(index)}
                        className="dark:text-[white]"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {addresses.length < 3 && (
                  <button
                    onClick={handleAddAddress}
                    className="border-2 border-dashed rounded-lg p-4 text-blue-500 xl:px-6 hover:bg-blue-100 transition-all duration-150 ease-linear"
                  >
                    + Add New Address
                  </button>
                )}
              </div>
            </div>

            <AddressModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveAddress}
              initialData={
                editingIndex !== null
                  ? addresses[editingIndex]
                  : {
                      line1: "",
                      line2: "",
                      state: "",
                      city: "",
                      pincode: "",
                    }
              }
              mode={editingIndex !== null ? "update" : "create"}
              addressId={editingIndex !== null ? addresses[editingIndex]?._id : null}
            />

            {/* ACCOUNT ACTIONS */}
            <div className="bg-white dark:bg-[#1A1D20] rounded-2xl shadow mt-[3vh] mx-[3vw] p-[3vh] xl:p-[5vh] mb-[5vh] font-poppins ">
              <div className="text-xl xl:text-lg font-semibold mb-4 xl:mb-5 dark:text-[#AAB9C5]">
                Account Actions
              </div>

              <div className="flex justify-between items-center mb-6 xl:px-3">
                <div>
                  <div className="text-base font-medium dark:text-[#BBC2C9]">
                    Logout
                  </div>
                  <div className="text-sm text-[#64707D] dark:text-[#64707D]">
                    Sign out from all devices
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#E5E8FF] px-4 py-2 rounded-lg hover:bg-[#d6dbfd] flex items-center justify-center gap-2 xl:px-[1.4vw] xl:py-[1vh] text-[15px] transition-all duration-300"
                >
                  <FiLogOut className="text-[#364EF2]" />
                  <span className="text-[#313131] dark:text-[#313131]">
                    Logout
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center xl:px-3">
                <div>
                  <div className="text-base font-medium dark:text-[#BBC2C9]">
                    Delete Account
                  </div>
                  <div className="text-sm text-[#64707D] dark:text-[#64707D]">
                    Permanently delete your account
                  </div>
                </div>
                <AlertDialogDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
