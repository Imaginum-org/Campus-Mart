import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  createAddress,
  updateAddress,
} from "../../../features/user/api/userApi.js";

const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  addressId,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    line1: "",
    line2: "",
    state: "",
    city: "",
    pincode: "",
    isDefault: false,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      if (!/^\d*$/.test(value) || value.length > 6) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.line1.trim()) return "Address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.pincode || formData.pincode.length !== 6)
      return "Valid pincode required";

    return null;
  };

  const handleSubmit = async () => {
    if (onSave) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const error = validateForm();
    if (error) return toast.error(error);

    setIsSubmitting(true);

    try {
      let res;

      if (mode === "create") {
        res = await createAddress(formData);
      } else {
        res = await updateAddress(addressId, formData);
      }

      if (res.data.success) {
        toast.success(
          res.data.message ||
            `Address ${mode === "create" ? "added" : "updated"}`,
        );

        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`,
          );

          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            city: data.city || data.locality || "",
            state: data.principalSubdivision || "",
            pincode: data.postcode || "",
            line1: `${data.locality || data.city || ""}${
              data.principalSubdivision ? ", " + data.principalSubdivision : ""
            }`.trim(),
          }));
        } catch {
          toast.error("Unable to fetch location");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setLoadingLocation(false);
      },
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#1A1D20] w-[90vw] md:w-[450px] rounded-[20px] shadow-2xl p-6 relative font-['Poppins']"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-lg font-semibold text-[#2d3339] dark:text-white font-poppins">
              {mode === "create" ? "Add Address" : "Edit Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleCurrentLocation}
              disabled={loadingLocation}
              className="flex items-center text-sm lg:text-[15px] justify-center gap-2 w-full py-3 border border-gray-300 rounded-[10px] text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#2a2e33]"
            >
              <MapPin size={18} />
              {loadingLocation ? "Locating..." : "Select Current Location"}
            </button>

            <input
              type="text"
              name="line1"
              value={formData.line1}
              onChange={handleChange}
              placeholder="Street/Address Line 1"
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-[12px] lg:text-[13px]"
            />

            <input
              type="text"
              name="line2"
              value={formData.line2}
              onChange={handleChange}
              placeholder="Address Line 2 (Optional)"
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-[12px] lg:text-[13px]"
            />

            <div className="flex gap-4">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-1/2 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-[12px] lg:text-[13px]"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-1/2 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-[12px] lg:text-[13px]"
              />
            </div>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500 dark:bg-[#2D3339] dark:border-gray-600 dark:text-white text-[12px] lg:text-[13px]"
            />

            <div className="flex items-center gap-3 p-3 bg-[#F0F2FF] dark:bg-[#2D3339] rounded-[10px]">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
                className="w-4 h-4 cursor-pointer accent-blue-500"
              />
              <label
                htmlFor="isDefault"
                className="text-sm lg:text-[13px] text-gray-700 dark:text-gray-300 cursor-pointer font-medium"
              >
                Set as default address
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-sm text-gray-700 rounded-[10px] font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#4d4ef2] text-sm text-white rounded-[10px] font-medium hover:bg-[#3b3be0] transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddressModal;
