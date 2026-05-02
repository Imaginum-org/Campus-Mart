import { useState, useEffect } from "react";
import Loader from "../../../components/ui/Loader.jsx";
import Profile_left_part from "../components/Profile_left_part.jsx";
import AlertDialogDemo from "../components/Deletebutton.jsx";
import AvatarComponent from "../../../components/common/AvatarComponent.jsx";

import { toast } from "react-hot-toast";
import EditButton from "../components/editbutton.jsx";
import SecuritySettings from "../components/SecuritySettings.jsx";
import AddressModal from "../components/AddressModal.jsx";
import { Pencil, Trash2 } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import StatsPanel from "../../../components/ui/StatsPanel.jsx";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUserContext.jsx";

import {
  getUserProfile,
  updateProfile,
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../api/userApi";

import { logoutUser } from "../../auth/api/authApi";

function Profile() {
  const navigate = useNavigate();

  const { userDetails: contextUserDetails, updateUserDetails } = useUser();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (contextUserDetails) {
      setUserDetails(contextUserDetails);
      setPhone(contextUserDetails?.mobile || "");
      setGender(contextUserDetails?.gender || "");
      setLoading(false);
    }
  }, [contextUserDetails]);

  useEffect(() => {
    if (contextUserDetails) return;

    const fetchUser = async () => {
      try {
        const res = await getUserProfile();

        if (res.data.success) {
          setUserDetails(res.data.user);
          setPhone(res.data.user?.mobile || "");
          setGender(res.data.user?.gender || "");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("cachedUserDetails");
          navigate("/login");
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [contextUserDetails, navigate]);

  const fetchAddresses = async () => {
    try {
      const res = await getUserAddresses();
      if (res.data.success) setAddresses(res.data.addresses);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveProfile = async () => {
    if (!profileChanged) return true;

    try {
      setIsSavingProfile(true);

      const updateData = { mobile: phone };
      if (gender) updateData.gender = gender;

      const res = await updateProfile(updateData);

      if (res.data.success) {
        toast.success("Profile updated successfully");

        setUserDetails(res.data.user);
        updateUserDetails(res.data.user);

        setProfileChanged(false);
        return true;
      }

      return false;
    } catch {
      toast.error("Failed to update profile");
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
    if (saved) setIsProfileEditing(false);
  };

  const handleAddAddress = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (data) => {
    try {
      let res;

      if (editingIndex !== null) {
        res = await updateAddress(addresses[editingIndex]?._id, data);
      } else {
        res = await createAddress(data);
      }

      if (res.data.success) {
        toast.success("Address saved");
        await fetchAddresses();
        setIsModalOpen(false);
        setEditingIndex(null);
      }
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      await deleteAddress(addresses[index]?._id);
      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      fetchAddresses();
    } catch {
      toast.error("Failed to set default address");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();

      if (res.data.success) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("cachedUserDetails");

        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen overflow-hidden dark:bg-[#131313]">
        {/* <Header bagUrl={bag} darkUrl={bluebag} /> */}

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
                      isLoading={loading}
                      className="w-[70px] h-[70px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col ml-[2vw] xl:ml-[1vw] font-poppins">
                  <div className="text-white text-[22px] font-medium xl:text-[20px]">
                    {userDetails?.name || "User"}
                  </div>
                  <div className="text-white text-sm opacity-80 font-light">
                    {userDetails?.createdAt
                      ? `Member since ${new Date(
                          userDetails.createdAt,
                        ).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}`
                      : "Member since date unavailable"}
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
                <EditButton
                  isEditing={isProfileEditing}
                  onClick={handleToggleProfileEdit}
                />
              </div>
            </div>

            <SecuritySettings />

            {/* ADDRESS SECTION */}
            <div className="bg-white dark:bg-[#1A1D20] rounded-2xl shadow mt-[3vh] mx-[3vw] p-[3vh] xl:p-[5vh] font-poppins">
              <div className="text-xl xl:text-lg font-semibold mb-4 dark:text-[#D7D7D7]">
                Addresses
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {addresses.map((addr, index) => (
                  <div
                    key={addr._id || index}
                    className={`rounded-xl p-6 xl:px-8 xl:py-6 min-w-[290px] sm:min-w-[320px] lg:min-w-[360px] flex-shrink-0 relative overflow-visible transition-all duration-200 ${
                      addr.isDefault
                        ? "bg-gradient-to-br from-[#E5E8FF] to-[#F0F2FF] dark:from-[#2D3339] dark:to-[#383D44] border-2 border-[#364EF2] dark:border-[#364EF2] shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30"
                        : "bg-[#F2F4FF] dark:bg-[#2D3339]"
                    }`}
                  >
                    {/* Default Address Ring Indicator */}
                    {addr.isDefault && (
                      <div className="absolute top-4 left-4 z-10 bg-[#364EF2] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </div>
                    )}

                    <div
                      className={`font-semibold mb-1 ${addr.isDefault ? "text-[#364EF2] dark:text-[#6B9AFF]" : "dark:text-[#EBEDFF]"}`}
                    >
                      {addr.isDefault
                        ? "📍 Default Address"
                        : `Address ${index + 1}`}
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
                    className="border-2 border-dashed rounded-xl p-4 min-w-[290px] sm:min-w-[320px] flex-shrink-0 text-blue-500 xl:px-6 hover:bg-blue-100 transition-all duration-150 ease-linear"
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
              addressId={
                editingIndex !== null ? addresses[editingIndex]?._id : null
              }
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
