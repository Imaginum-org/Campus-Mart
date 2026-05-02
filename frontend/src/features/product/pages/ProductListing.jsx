import { useEffect, useState } from "react";
import { IoImages } from "react-icons/io5";
import { ArrowUpFromLine } from "lucide-react";
import { MdChangeCircle } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BiMessageSquareError } from "react-icons/bi";
import { Link } from "react-router-dom";
import { uploadImage } from "../../../utils/imageUpload.js";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/axiosInstance";

const ProductListing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [productImages, setProductImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [userAddress, setUserAddress] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  const [selectedPayment, setSelectedPayment] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState("");
  const [usageDuration, setUsageDuration] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const updateDark = () => {
      setIsDark(root.classList.contains("dark"));
    };

    updateDark();

    const observer = new MutationObserver(updateDark);
    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      productImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productImages]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("/api/address");

        const addresses = res.data?.addresses || [];

        const defaultAddress =
          addresses.find((addr) => addr.isDefault) || addresses[0];

        setUserAddress(defaultAddress || null);
      } catch (err) {
        toast.error("Failed to load address");
      }
    };

    fetchAddresses();
  }, []);

  const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "");
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    for (let file of files) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        toast.error("Only PNG and JPG images are allowed!");
        continue;
      }

      if (imageFiles.length + validFiles.length >= 3) break;

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setProductImages((prev) => [...prev, ...previews]);

    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(productImages[index]);
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (!termsAccepted) return toast.error("Accept terms & conditions");
      if (!selectedCategory) return toast.error("Select category");
      if (!productCondition) return toast.error("Select condition");
      if (!selectedPayment) return toast.error("Select payment method");
      if (!productPrice || Number(productPrice) <= 0)
        return toast.error("Enter valid price");
      if (imageFiles.length === 0)
        return toast.error("Upload at least 1 image");
      if (!userAddress) return toast.error("Please add address first");

      if (originalPrice && Number(productPrice) > Number(originalPrice)) {
        return toast.error(
          "Selling price cannot be greater than original price",
        );
      }

      // Upload images
      const uploads = await Promise.all(
        imageFiles.map((file) => uploadImage(file)),
      );

      const uploadedUrls = uploads.map((img) => img.url);
      const uploadedFileIds = uploads.map((img) => img.fileId);

      await axios.post("/api/product", {
        title: productName.trim(),
        description: productDesc.trim(),

        category: selectedCategory,
        condition: productCondition,

        selling_price: Number(productPrice),
        is_negotiable: priceNegotiable === "true",
        payment_preference: selectedPayment,

        images: uploadedUrls,
        image_file_ids: uploadedFileIds,
        original_price: Number(originalPrice),

        pickup_address_snapshot: {
          address_line: userAddress.address_line || userAddress.line1,
          city: userAddress.city,
          state: userAddress.state,
          pincode: userAddress.pincode,
        },

        attributes: {
          brand,
          color,
          usage_duration: usageDuration,
        },
      });

      toast.success("Product listed successfully");

      setTimeout(() => navigate("/"), 1000);

      setProductImages([]);
      setImageFiles([]);
      setProductName("");
      setProductDesc("");
      setProductPrice("");
      setSelectedCategory("");
      setProductCondition("");
      setSelectedPayment("");
      setPriceNegotiable("");
      setUsageDuration("");
      setTermsAccepted(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "daily_use", label: "Daily Use" },
    { value: "cycle", label: "Cycle" },
    { value: "others", label: "Others" },
  ];

  const conditionOptions = [
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "poor", label: "Poor" },
  ];

  const negotiableOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const usageOptions = [
    { value: "less than 3 months", label: "< 3 months" },
    { value: "6 months", label: "6 months" },
    { value: "9 months", label: "9 months" },
    { value: "12 months", label: "12 months" },
    { value: "more than 12 months", label: "> 12 months" },
  ];

  const selectStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#131313" : "#FFFFFF",
      borderColor: isDark
        ? "transparent"
        : state.isFocused
          ? "#534ff2"
          : "#D1D5DB",
      boxShadow: "none",
      minHeight: 40,
      cursor: "pointer",
      "&:hover": {
        borderColor: isDark
          ? "transparent"
          : state.isFocused
            ? "#534ff2"
            : "#D1D5DB",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#131313" : "#FFFFFF",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? "#111827"
          : "#E5E7EB"
        : isDark
          ? "#131313"
          : "#FFFFFF",
      color: isDark ? "#F9FAFB" : "#111827",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "#F9FAFB" : "#111827",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDark ? "#9CA3AF" : "#111827",
    }),
    input: (provided) => ({
      ...provided,
      color: isDark ? "#F9FAFB" : "#111827",
    }),
  };

  const selectStyles1 = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#131313" : "#EBEDFF",
      borderColor: isDark
        ? "transparent"
        : state.isFocused
          ? "#534ff2"
          : "#D1D5DB",
      boxShadow: "none",
      minHeight: 40,
      cursor: "pointer",
      "&:hover": {
        borderColor: isDark
          ? "transparent"
          : state.isFocused
            ? "#534ff2"
            : "#D1D5DB",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#131313" : "#FFFFFF",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? "#111827"
          : "#E5E7EB"
        : isDark
          ? "#131313"
          : "#FFFFFF",
      color: isDark ? "#F9FAFB" : "#111827",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "#F9FAFB" : "#111827",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDark ? "#9CA3AF" : "#111827",
    }),
    input: (provided) => ({
      ...provided,
      color: isDark ? "#F9FAFB" : "#111827",
    }),
  };

  const isFormValid =
    productName.trim() &&
    productDesc.trim() &&
    selectedCategory &&
    productCondition &&
    selectedPayment &&
    productPrice &&
    Number(productPrice) > 0 &&
    imageFiles.length > 0 &&
    userAddress &&
    termsAccepted &&
    brand.trim() &&
    color.trim() &&
    originalPrice &&
    Number(originalPrice) >= Number(productPrice) &&
    usageDuration &&
    priceNegotiable;

  return (
    <div className="overflow-hidden">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 1500,
          maxToasts: 1,
        }}
      />
      {/* <Header bagUrl={"bag.png"} darkUrl={"/bluebag.png"} /> */}
      {/* start */}
      <div className="flex flex-col dark:bg-[#131313] md:pt-3 xl:pt-1">
        {/* top section */}
        <div className="flex flex-col xl:flex-row w-full xl:h-[78vh]">
          {/* Top left (Images) */}
          <div className="flex flex-col gap-3 xl:h-full w-full xl:w-1/3">
            <div className="flex items-center pl-5 xL:pl-14 lg:pl-10 lg:pt-5 pt-4 gap-2 lg:gap-3 font-medium">
              <img
                src="/group99.png"
                alt="image"
                className="size-6 lg:h-7 xl:h-8 xl:w-7 lg:w-6"
              />
              <h1 className="sm:text-[1.4vw] xl:text-[1.4vw] lg:text-[1.2em] text-[1rem] md:text-[2.4vw] font-poppins leading-normal font-medium dark:text-white">
                List Your Product
              </h1>
            </div>

            {/* Image upload */}
            <div className="xl:w-[25vw] bg-gradient-to-b from-[#394FF1] to-[#534FF2] shadow-[0px_4.410558223724365px_10px_0px_rgba(0,0,0,0.18)] flex flex-col lg:pl-7 items-start ml-5 lg:ml-6 lg:mr-6 mr-5 lg:rounded-2xl rounded-xl text-white gap-2 md:gap-3 pt-6 xl:pl-7 pl-6 pb-6 md:pt-5 md:pb-5 lg:pt-7 lg:pr-7 lg:gap-2 lg:pb-7 pr-6 xl:h-[65vh]">
              {/* Header */}
              <div className="flex justify-center items-center gap-1 lg:gap-2">
                <IoImages className="lg:size-6 size-5 md:size-6" />
                <h1 className="lg:text-lg font-roboto text-base md:text-lg">
                  Product Images
                </h1>
              </div>

              {/* Choose Files bar */}
              <div className="w-full border border-violet-400 rounded-lg p-[1.5vw] xl:p-[0.5vw] md:p-[0.8vw] flex items-center gap-2 lg:mt-2">
                <button
                  type="button"
                  className="bg-white text-black lg:py-3 xl:py-2 py-1 md:py-[0.3vh] lg:px-11 xl:px-4 px-5 lg:rounded-lg rounded-md lg:text-sm text-[3.2vw] flex justify-between gap-2 items-center font-roboto leading-loose md:text-[2.1vw]"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Choose Files
                  <ArrowUpFromLine className="lg:size-4 size-4" />
                </button>

                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={imageFiles.length >= 3}
                  accept="image/*"
                  multiple
                />

                <h1 className="lg:text-sm xl:text-xs font-roboto leading-snug font-light text-[0.64rem] ml-1 md:ml-0 md:text-[1.8vw]">
                  {productImages.length === 0
                    ? "Upload images (up to 3)"
                    : `${productImages.length} image${
                        productImages.length > 1 ? "s" : ""
                      } uploaded`}
                </h1>
              </div>

              {/* Helper text */}
              <h1 className="font-roboto lg:text-[0.8rem] xl:text-[0.8vw] leading-snug text-[0.7rem] md:text-[1.7vw]">
                Select one or more images. PNG & JPG accepted.
              </h1>

              {/* Preview area */}
              {productImages.length > 0 ? (
                <div className="border-dashed border border-violet-200 w-full h-full rounded-2xl relative">
                  <div className="w-full h-full lg:mt-3 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {productImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-full aspect-square"
                      >
                        <img
                          src={img}
                          alt={`Uploaded ${index}`}
                          className="w-full h-full object-cover rounded-md border"
                        />

                        {/* delete icon */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-[#FF3B3B] rounded-full p-[0.35rem] shadow-md flex items-center justify-center"
                        >
                          <MdDelete className="text-white text-xs md:text-sm" />
                        </button>
                      </div>
                    ))}
                    {/* Bottom message */}
                    <div
                      className="
          flex items-center gap-1
          absolute bottom-3
          left-1/2 -translate-x-1/2
          text-[3vw] sm:text-xs md:text-xs lg:text-[0.8vw]
          xl:left-[4vw] xl:-translate-x-0
        "
                    >
                      {productImages.length >= 3 ? (
                        <>
                          <div className="bg-[#FFCECE] rounded-md px-1 py-[2px] flex items-center justify-center">
                            <BiMessageSquareError className="text-[#E40000] text-[3.2vw] sm:text-base md:text-base lg:text-sm" />
                          </div>
                          <span className="text-[0.6rem] sm:text-xs md:text-xs lg:text-[0.8rem] xl:text-[0.8vw]">
                            Max 3 images reached.
                          </span>
                        </>
                      ) : (
                        <>
                          <HiOutlineLightBulb className="text-[3.5vw] sm:text-base md:text-lg lg:text-sm" />
                          <span className="text-[0.6rem] sm:text-xs md:text-xs lg:text-[0.8rem] xl:text-[0.8vw]">
                            Tip: Upload clear images.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-dashed border border-violet-200 w-full h-full flex flex-col items-center justify-center rounded-2xl lg:mt-3 p-[20vw] lg:p-[10vw] md:p-[15vw] xl:p-4 relative">
                  <IoImages className="lg:size-10 size-7 md:size-9 text-violet-300" />
                  <h1 className="text-white text-[0.65rem] md:text-base mt-2">
                    Previews will appear here.
                  </h1>

                  <div
                    className="
          flex items-center gap-1
          absolute bottom-3
          left-1/2 -translate-x-1/2
          text-[0.6rem] sm:text-xs md:text-xs lg:text-[0.8vw]
          xl:left-[4vw] xl:-translate-x-0
        "
                  >
                    <HiOutlineLightBulb className="text-[3.5vw] sm:text-base md:text-lg lg:text-sm" />
                    <span className="text-[0.6rem] sm:text-xs md:text-xs lg:text-[0.8rem] xl:text-[0.8vw]">
                      Tip: Upload clear images.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* top right (Form) */}
          <div className="flex flex-col xl:h-full xl:w-2/3 xl:ml-[-4.7vw] ml-5 mr-5">
            <div className="flex flex-col xl:flex-row w-full gap-6 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.10)] rounded-2xl lg:pt-5 pr-6 lg:pr-8 pl-6 lg:pl-8 pb-5 lg:mt-9 xl:mt-16 md:mt-12 mt-6 dark:bg-[#1A1D20] pt-4">
              <div className="flex flex-col h-full xl:w-1/2">
                {/* Product name */}
                <label
                  htmlFor="productName"
                  className="font-medium text-[#534ff2] text-sm lg:text-base font-roboto leading-7 dark:text-white"
                >
                  Product Name<span className="text-red-500">*</span>
                </label>
                <input
                  required
                  id="productName"
                  maxLength={120}
                  type="text"
                  placeholder="Enter product name"
                  className="py-2 outline-none border border-slate-300 rounded-md px-2 placeholder:text-sm font-roboto dark:bg-[#131313] dark:border-0 dark:placeholder:text-[#848484] dark:text-white"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                {/* Description */}
                <label
                  htmlFor="productDesc"
                  className="font-semibold mt-3 text-[#534ff2] text-sm lg:text-base font-robotoe dark:text-white"
                >
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  id="productDesc"
                  maxLength={2000}
                  placeholder="Add all the details about the product and provide enough details to trust your product."
                  className="outline-none border border-slate-300 rounded-md px-2 py-2 xl:h-[28.5vh] lg:h-[18vh] h-[24vh] w-full resize-none overflow-auto placeholder:text-sm font-roboto dark:bg-[#1A1D20] dark:border-[#515151] dark:placeholder:text-[#D7D7D7] dark:text-white mt-1"
                  onChange={(e) => setProductDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col h-full xl:w-1/2">
                {/* Category */}
                <div className="font-medium flex items-center gap-2 text-sm lg:text-base">
                  <div className="text-[#534ff2] font-roboto dark:text-white">
                    Category<span className="text-red-500">*</span>
                  </div>
                  <h5 className="text-black/50 lg:text-sm text-xs font-normal font-roboto dark:text-[#848484]">
                    Select the appropriate category
                  </h5>
                </div>

                <Select
                  options={categoryOptions}
                  className="mt-1"
                  styles={selectStyles}
                  onChange={handleCategorySelect}
                  isSearchable={false}
                  placeholder="Select category"
                  value={
                    categoryOptions.find(
                      (opt) => opt.value === selectedCategory,
                    ) || null
                  }
                />

                {/* brand and model */}
                <label
                  htmlFor="productBrandModel"
                  className="font-medium mt-4 text-[#534ff2] text-sm lg:text-base font-roboto dark:text-white"
                >
                  Brand & Model (if applicable)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  id="productBrandModel"
                  onChange={(e) => setBrand(e.target.value)}
                  type="text"
                  placeholder="Enter Brand or model name"
                  className="outline-none border border-slate-300 rounded-md px-2 py-2 placeholder:text-sm font-roboto dark:bg-[#131313] dark:placeholder:text-[#848484] dark:text-white dark:border-0 mt-1"
                />

                {/* Color */}
                <label
                  htmlFor="productColor"
                  className="font-medium mt-3 text-[#534ff2] text-sm lg:text-base font-roboto dark:text-white"
                >
                  Color<span className="text-red-500">*</span>
                </label>
                <input
                  required
                  id="productColor"
                  onChange={(e) => setColor(e.target.value)}
                  type="text"
                  placeholder="Product Color"
                  className="outline-none border border-slate-300 rounded-md px-2 py-2 placeholder:text-sm font-roboto dark:bg-[#131313] dark:text-white dark:placeholder:text-[#848484] dark:border-0 mt-1"
                />
                {/* Original Price */}
                <label
                  htmlFor="productOriginalPrice"
                  className="font-medium mt-3 text-[#534ff2] text-sm lg:text-base font-roboto dark:text-white"
                >
                  Original Price<span className="text-red-500">*</span>
                </label>
                <div className="flex outline-none lg:px-2 py-2 lg:ml-[-0.5vw] xl:w-[31.9vw] w-full rounded-md lg:mt-[-1.1vh] font-roboto mt-[-0.4vh]">
                  <div className="bg-neutral-100 outline outline-1 outline-neutral-300 px-4 rounded-s-md flex justify-center items-center font-roboto dark:bg-[#2A2A2A] dark:text-white dark:outline-[#515151] dark:border-0 dark:outline-0">
                    <FaRupeeSign className="size-3 xl:size-4 text-neutral-600 dark:text-[#DEDEDE]" />
                  </div>
                  <input
                    required
                    id="productOriginalPrice"
                    type="number"
                    min="1"
                    placeholder="Enter Brand or model name"
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="outline-none border border-slate-300 rounded-r-md px-2 py-2 xl:w-[30vw] w-full font-roboto dark:bg-[#131313] dark:text-white dark:placeholder:text-[#848484] dark:border-[#515151] dark:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Condition, Date of purchase, Negotiable, Usage */}
            <div className="w-full lg:mt-4 mt-7">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 font-roboto">
                {/* Condition */}
                <div className="shadow-[0px_4px_6px_0px_rgba(111,111,111,0.12)] border-2 border-black/10 flex flex-col justify-center items-start rounded-lg p-3 lg:p-5 dark:bg-[#1A1D20] dark:text-[#DEDEDE]">
                  <h1 className="font-semi text-sm lg:text-base mb-2">
                    Condition<span className="text-red-500">*</span>
                  </h1>
                  <Select
                    options={conditionOptions}
                    styles={selectStyles1}
                    isSearchable={false}
                    placeholder="Select condition"
                    value={
                      conditionOptions.find(
                        (opt) => opt.value === productCondition,
                      ) || null
                    }
                    onChange={(opt) =>
                      setProductCondition(opt ? opt.value : "")
                    }
                  />
                </div>

                {/* Date of Purchase */}
                <div className="shadow-[0px_4px_6px_0px_rgba(111,111,111,0.12)] border-2 border-black/10 flex flex-col justify-center items-start rounded-lg p-3 lg:p-5 dark:bg-[#1A1D20] dark:text-[#DEDEDE]">
                  <h1 className="font-semi text-sm lg:text-base mb-2">
                    Date of Purchase<span className="text-red-500">*</span>
                  </h1>
                  <input
                    type="date"
                    className="w-full bg-[#EBEDFF] px-3 py-2 text-sm lg:text-base rounded-md border border-slate-300 dark:bg-[#131313] dark:text-[#DEDEDE] dark:border-[#515151] focus:outline-none focus:ring-2 focus:ring-[#534ff2]"
                  />
                </div>

                {/* Is the price negotiable */}
                <div className="shadow-[0px_4px_6px_0px_rgba(111,111,111,0.12)] border-2 border-black/10 flex flex-col justify-center items-start rounded-lg p-3 lg:p-5 dark:bg-[#1A1D20] dark:text-[#DEDEDE]">
                  <h1 className="font-semi text-sm lg:text-base mb-2">
                    Is the price negotiable
                    <span className="text-red-500">*</span>
                  </h1>
                  <Select
                    options={negotiableOptions}
                    styles={selectStyles1}
                    isSearchable={false}
                    placeholder="Select option"
                    value={
                      negotiableOptions.find(
                        (opt) => opt.value === priceNegotiable,
                      ) || null
                    }
                    onChange={(opt) => setPriceNegotiable(opt ? opt.value : "")}
                  />
                </div>

                {/* Usage Duration */}
                <div className="shadow-[0px_4px_6px_0px_rgba(111,111,111,0.12)] border-2 border-black/10 flex flex-col justify-center items-start rounded-lg p-3 lg:p-5 dark:bg-[#1A1D20] dark:text-[#DEDEDE]">
                  <h1 className="font-semi text-sm lg:text-base mb-2">
                    Usage Duration<span className="text-red-500">*</span>
                  </h1>
                  <Select
                    options={usageOptions}
                    styles={selectStyles1}
                    isSearchable={false}
                    placeholder="Select duration"
                    value={
                      usageOptions.find((opt) => opt.value === usageDuration) ||
                      null
                    }
                    onChange={(opt) => setUsageDuration(opt ? opt.value : "")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom section */}
        <div className="flex w-full font-roboto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col xl:flex-row w-[93vw] h-full shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] mt-7 lg:pt-5 pt-3 pb-8 lg:pl-10 xl:pl-10 pl-5 mb-8 rounded-2xl lg:mr-6 xl:mr-12 mr-3 xl:ml-14 lg:ml-6 ml-3 dark:bg-[#1A1D20] xl:pr-6 md:w-[95vw] lg:w-[95vw] xl:w-[93vw]"
          >
            <div className="flex flex-col xl:w-1/3 xl:pr-20 pr-5">
              {/* Pickup Address */}
              <div className="flex justify-between items-center">
                <h1 className="font-semibold mt-3 text-sm lg:text-base dark:text-[#D7D7D7]">
                  Pickup Address
                </h1>
                <Link
                  to={"/profile"}
                  className="flex mt-3 justify-center items-center gap-1 text-xs md:text-sm lg:text-base"
                >
                  <h1 className="font-semibold text-[#646464] dark:text-[#D7D7D7]">
                    Change
                  </h1>
                  <MdChangeCircle className="text-blue-500 lg:size-8 size-6" />
                </Link>
              </div>
              {userAddress ? (
                <p className="bg-violet-50 text-sm sm:text-base p-3 sm:p-4 border border-violet-200 rounded-md text-gray-700">
                  {userAddress.address_line || userAddress.line1}{" "}
                  {userAddress.line2 && `, ${userAddress.line2}`} <br />
                  {userAddress.city}, {userAddress.state} <br />
                  {userAddress.pincode}
                </p>
              ) : (
                <p>Loading address...</p>
              )}
              <div></div>
            </div>

            {/* payment method */}
            <div className="flex flex-col xl:w-1/3 xl:pl-8 mt-1 xl:mt-0">
              <label
                htmlFor="payment"
                className="font-semibold mt-3 text-sm lg:text-base md:mt-5 dark:text-[#F1F1F1]"
              >
                Preferred Payment (Cash/UPI){" "}
                <span className="text-red-500 ">*</span>
              </label>

              <div className="flex xl:flex-col lg:gap-4 gap-3 lg:mt-4 mt-2 lg:ml-3">
                <div className="flex items-center lg:gap-2 gap-1 bg-violet-50 dark:bg-[#131313] dark:text-[#D7D7D7] lg:w-28 w-20 py-2 px-4 rounded-lg">
                  <input
                    type="radio"
                    name="payment"
                    id="cash"
                    value="cash"
                    className="cursor-pointer"
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <label
                    htmlFor="cash"
                    className="font-semibold cursor-pointer text-sm lg:text-base"
                  >
                    Cash
                  </label>
                </div>

                <div className="flex items-center lg:gap-2 gap-1 bg-violet-50 dark:bg-[#131313] dark:text-[#D7D7D7] lg:w-28 w-20 py-2 px-4 rounded-lg">
                  <input
                    type="radio"
                    name="payment"
                    id="upi"
                    value="upi"
                    className="cursor-pointer"
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <label
                    htmlFor="upi"
                    className="font-semibold cursor-pointer text-sm lg:text-base"
                  >
                    UPI
                  </label>
                </div>
                <div className="flex items-center lg:gap-2 gap-1 bg-violet-50 dark:bg-[#131313] dark:text-[#D7D7D7] lg:w-28 w-20 py-2 px-4 rounded-lg">
                  <input
                    type="radio"
                    name="payment"
                    id="both"
                    value="both"
                    className="cursor-pointer"
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <label
                    htmlFor="both"
                    className="font-semibold cursor-pointer text-sm lg:text-base"
                  >
                    Both
                  </label>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col h-full xl:w-1/3 lg:mt-3 mt-5 md:mt-6">
              <div>
                <div>
                  <h1 className="lg:text-lg text-base font-bold dark:text-[#F1F1F1]">
                    Price
                  </h1>
                  <div className="xl:mr-14 overflow-hidden md:mr-6 mr-4">
                    <div className="flex items-center gap-1 lg:text-[2.5vw] md:text-[4vw] text-[6vw]">
                      <FaRupeeSign className="shrink-0 lg:text-[2vw] md:text-[3vw] text-[2rem] text-neutral-700 dark:text-[#C6C6C6]" />

                      <input
                        required
                        type="text"
                        name="productPrice"
                        id="productPrice"
                        min="1"
                        className="flex-1 text-black outline-none rounded-md px-2 py-2 xl:py-1 font-tiltWarp bg-[#f2f3f3] dark:bg-[#131313] dark:text-white"
                        placeholder="Enter price"
                        value={productPrice}
                        onChange={(e) =>
                          setProductPrice(
                            e.target.value.replace(/[^0-9.]/g, ""),
                          )
                        }
                        step="any"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1 lg:gap-2 md:mt-3 mt-4 dark:text-[#F1F1F1]">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                      className="lg:w-4 w-3"
                    />
                    <label
                      className="select-none hover:cursor-pointer text-[0.67rem] lg:text-base md:text-sm font-poppins xl:text-sm"
                      htmlFor="terms"
                    >
                      {" "}
                      I acknowledge and accept the{" "}
                      <Link
                        to={"/termscondition"}
                        className="underline hover:text-[#534ff2]"
                      >
                        {" "}
                        terms and conditions{" "}
                      </Link>{" "}
                      .<span className="text-red-500">*</span>{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex md:mt-3 mt-5">
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`${
                    loading || !isFormValid
                      ? "opacity-50 cursor-not-allowed bg-stone-900 text-white rounded-md md:py-3 py-3 lg:w-[83.5vw] xl:w-[26vw] w-[85vw] font-medium text-sm lg:text-base  dark:bg-[#F1F1F1] dark:text-[#1A1D20] md:mt-3 md:text-base md:w-[88vw]"
                      : "bg-stone-900 text-white rounded-md md:py-3 py-3 lg:w-[83.5vw] xl:w-[26vw] w-[85vw] font-medium text-sm lg:text-base  dark:bg-[#F1F1F1] dark:text-[#1A1D20] md:mt-3 md:text-base md:w-[88vw]"
                  }`}
                >
                  {loading ? "Listing..." : "List my Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
