import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { IoMdShareAlt } from "react-icons/io";
import { EllipsisVertical, IndianRupee } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquareMore } from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../Utils/api";

const ProductDescription = () => {
  const [report, setReport] = useState(false);
  const [wishlish, setWishlish] = useState(false);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : ["/assets/image10.png"];

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const handleReport = () => {
    setReport((prev) => !prev);
  };

  const reportIssue = () => {
    toast.success("Product Reported", { id: "report-toast" });
    setReport(false);
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleWishlish = () => {
    setWishlish(!wishlish);
    toast.success("Added to Wishlist", { id: "wishlist-toast" });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!", { id: "share-toast" });
    } catch (error) {
      toast.error("Failed to copy!");
      console.error("Copy failed:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/api/product/${id}`);

        setProduct(res.data.data);
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="w-full min-h-screen">
      {/* <Header bagUrl={"bag.png"} darkUrl={"/bluebag.png"} /> */}
      <div className="flex flex-col w-full xl:flex-row 2xl:min-h-screen dark:bg-[#131313] xl:pt-2">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 1500,
            maxToasts: 1,
          }}
        />

        {/* Left side */}
        <div className="w-full mt-3 flex flex-col items-center xl:items-start gap-4 xl:w-1/3 xl:ml-5">
          {/* Left top - images */}
          <div className="rounded-2xl shadow-[0px_3.691620111465454px_12px_0px_rgba(102,102,102,0.10)] border pb-1 bg-white w-[93vw] xl:flex flex-col justify-center md:items-center xl:items-start xl:w-[28vw] dark:bg-[#1A1D20] dark:border-0 dark:shadow-xl">
            {/* FIXED IMAGE VIEWPORT (ADDED) */}
            <div className="w-full h-[360px] md:h-[420px] xl:h-[460px] flex items-center justify-center overflow-hidden">
              <img
                className="max-w-full max-h-full object-contain pl-5 pr-5 pt-3 rounded-xl md:mx-auto lg:mx-auto xl:mx-0"
                src={activeImage}
                alt="Product"
              />
            </div>

            {/* Thumbnails + share */}
            <div className="flex pl-5 pb-3 pt-1 justify-between xl:w-full">
              {/* Thumbnails */}
              <div className="flex gap-3 mt-2 md:mx-auto lg:mx-auto xl:mx-0">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`size-16 rounded-md overflow-hidden border-2 transition-all duration-200 
            ${
              activeImage === img
                ? "border-indigo-500"
                : "border-transparent hover:border-indigo-300"
            }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Share */}
              <div className="flex justify-end items-end pr-6 pt-5">
                <button onClick={handleShare} aria-label="Share product">
                  <IoMdShareAlt className="text-[#848484] hover:text-blue-500 lg:size-6 md:size-4 size-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Left side bottom - seller info (desktop) */}
          <div className="hidden xl:block ml-1 w-[37vw] p-5 rounded-2xl shadow-lg shadow-slate-200 border xl:w-[28vw] dark:bg-[#1A1D20] dark:border-0 dark:shadow-none">
            <h1 className="text-base text-zinc-700 font-bold font-robotoFlex dark:text-[#D7D7D7]">
              Seller Information
            </h1>
            <div className="flex pt-2 pb-1 items-center gap-2">
              <img
                className="size-8 rounded-md object-cover"
                src="/assets/user_img.png"
                alt="Seller"
              />
              <h1 className="font-semibold font-robotoFlex dark:text-[#848484]">
                {product.seller_id?.name}
              </h1>
            </div>

            <div className="flex flex-col pt-1">
              <div className="pl-1 leading-tight">
                <h1 className="text-[#979797] font-medium font-robotoFlex dark:text-[#979797]">
                  {product.pickup_address_snapshot?.address_line}
                </h1>
              </div>

              <div className="flex justify-end items-end pr-3 pt-3 font-medium font-poppins text-sm dark:text-[#D7D7D7]">
                <h1>Listed 10 days ago</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-between w-[93vw] ml-3 lg:ml-9 md:ml-7 mt-4 lg:mt-3 xl:ml-1 xl:mr-5 xl:w-3/4 dark:bg-[#131313] rounded-2xl">
          {/* Right top side */}
          <div className="flex flex-col rounded-2xl shadow-lg shadow-slate-200 border pl-6 pr-6 pb-6 pt-5 w-full xl:pl-12 dark:shadow-none dark:border-0 dark:bg-[#1A1D20]">
            <div className="flex justify-between items-center pr-4">
              <div className=" text-blue-600/80 bg-zinc-100 rounded-md w-28 md:w-36 md:py-2 py-[1vh] flex justify-center items-center font-semibold md:text-base text-sm font-robotoFlex dark:bg-[#131313] dark:text-[#BBC2C9]">
                {product.category}
              </div>

              {/* Animated report dropdown */}
              <div className="relative flex flex-col items-center gap-2">
                <button onClick={handleReport}>
                  <EllipsisVertical className="size-5 md:size-6 dark:text-white hover:text-blue-500 transition" />
                </button>

                <AnimatePresence>
                  {report && (
                    <motion.div
                      key="report-menu"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="absolute top-7 right-0 z-30 bg-white dark:bg-[#1F1F1F] dark:text-white 
                                 border border-gray-200 dark:border-[#555] 
                                 rounded-xl shadow-lg w-40 sm:w-44 overflow-hidden"
                    >
                      {[
                        "Report Product",
                        "Report a user",
                        "Raise an issue",
                      ].map((label, index) => (
                        <button
                          key={index}
                          onClick={reportIssue}
                          className="w-full text-left px-4 py-3 text-sm 
                                     hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-all"
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Product text content */}
            <div className="flex flex-col">
              <h1 className="text-[5.5vw] text-neutral-900 font-bold mt-5 md:text-[3vw] lg:text-[2.7vw] xl:text-[1.8vw] font-robotoFlex dark:text-white">
                {product.title}
              </h1>
              <div className="text-[8vw] flex items-center mt-1 md:text-[5vw] lg:text-[3.8vw] xl:text-[2.8vw]">
                <IndianRupee className="size-6 dark:text-white" />
                <h1 className="text-neutral-900 font-tiltWarp dark:text-white">
                  {product.selling_price}
                </h1>
                <div className="text-zinc-600 flex items-center text-xl md:text-2xl justify-end ml-3 mt-3 font-normal line-through font-poppins leading-none dark:text-[#626262]">
                  <IndianRupee className="size-4" />
                  {product.original_price && <h1>{product.original_price}</h1>}
                </div>
              </div>

              <h1 className="font-semibold md:font-medium mt-4 text-base md:text-lg xl:mt-7 font-poppins dark:text-[#D7D7D7]">
                Product Details
              </h1>
              <p className="text-[#848484] xl:mr-20 font-poppins leading-5 dark:text-[#848484]">
                {product.description}{" "}
                <button className="text-black">more</button>
              </p>
            </div>

            {/* Condition & usage */}
            <div className="flex flex-col mt-8 gap-6 md:flex-row md:gap-36 lg:gap-32 xl:gap-64">
              <div className="flex flex-col gap-2">
                <h1 className="font-medium text-[#828F9B] text-base md:text-base dark:text-[#828F9B]">
                  Condition
                </h1>
                <div className="flex flex-col gap-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-md text-white w-48 py-2 flex px-4 items-center font-medium text-sm md:w-52 md:text-base xl:py-3 xl:w-64 font-robotoFlex lg:px-6">
                    {product.condition}
                  </div>
                  <div className="bg-[#09C712] rounded-md text-white w-48 py-2 flex px-3 items-center font-medium text-sm md:w-52 md:text-base xl:py-3 xl:w-64 font-robotoFlex lg:px-6">
                    Price Negotiable : {product.is_negotiable ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-medium text-[#828F9B] text-base md:text-base dark:text-[#828F9B]">
                  Usage Duration
                </h1>
                <div className="flex flex-col gap-3">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 rounded-md text-white w-48 py-2 flex px-4 items-center font-medium text-sm md:w-52 md:text-base xl:py-3 xl:w-64 font-robotoFlex lg:px-6">
                    {product.attributes?.usage_duration || "N/A"}
                  </div>
                  <div className="bg-[#09C712] rounded-md text-white w-48 py-2 flex px-3 items-center font-medium text-sm md:w-52 md:text-base xl:py-3 xl:w-64 font-robotoFlex lg:px-6">
                    {product.attributes?.color || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & pickup */}
            <div className="bg-[#f5faff] pt-4 pb-4 mt-6 rounded-md md:mt-3 xl:pl-5 pl-4 dark:bg-[#25272A]">
              <h1 className="font-semibold text-base md:text-lg font-robotoFlex leading-7 dark:text-[#D7D7D7]">
                Payment & Pickup
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <h1 className="text-zinc-500 text-sm md:text-base font-robotoFlex dark:text-[#848484]">
                  Payment Mode (Cash/UPI):
                </h1>
                <div className="bg-white border border-gray-200 px-5 py-2 xl:px-8 rounded text-sm font-robotoFlex dark:bg-[#131313] dark:border-0 dark:text-white">
                  {product.payment_preference}
                </div>
              </div>
              <h1 className="text-[#848484] mt-2 text-sm md:text-base font-robotoFlex dark:text-[#848484]">
                Pickup Location
              </h1>
              <p className="w-52 text-[#2D3339] font-medium text-sm leading-5 xl:leading-5 md:leading-7 md:text-base md:w-64 font-robotoFlex dark:text-[#848484]">
                {product.pickup_address_snapshot?.address_line}
              </p>
            </div>
          </div>

          {/* Right bottom side */}
          <div className="flex flex-col w-full justify-between items-center mt-4 mb-6 gap-3 lg:flex-row xl:gap-96 dark:bg-[#131313]">
            <div
              onClick={handleWishlish}
              className="outline outline-2 outline-offset-[-2px] outline-neutral-200 rounded-md text-black w-full py-3 flex justify-center items-center font-semibold text-sm md:text-base font-robotoFlex cursor-pointer gap-2 dark:border-[#DDDDDD] dark:text-[#F1F1F1] dark:outline-[#DDDDDD] dark:outline-1"
            >
              <FaRegHeart className="lg:size-4 hover:text-red-500" />
              Add to Wishlist
            </div>
            <Link
              to={`/chat?seller=${product.seller_id?._id}`}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.17)] rounded-md text-white w-full py-3 flex justify-center items-center font-semibold gap-1 text-sm md:text-base"
            >
              <MessageSquareMore className="pt-1 size-6 block font-robotoFlex" />
              Chat with seller
            </Link>
          </div>

          {/* Mobile Seller Info */}
          <div className="lg:hidden w-full p-5 rounded-2xl shadow-xl dark:bg-[#1A1D20] mb-4">
            <h1 className="text-base text-[#494949] font-medium md:text-lg dark:text-[#D7D7D7]">
              Seller Information
            </h1>
            <div className="flex pt-2 pb-1 items-center gap-2">
              <img
                className="size-7 md:size-8 rounded-md object-cover"
                src="/assets/user_img.png"
                alt="Seller"
              />
              <h1 className="font-semibold dark:text-[#848484]">
                {product.seller_id?.name}
              </h1>
            </div>

            <div className="flex flex-col pt-1">
              <div className="leading-tight">
                <h1 className="text-[#979797] dark:text-[#979797] text-sm md:text-base">
                  {product.pickup_address_snapshot?.address_line}
                </h1>
              </div>

              <div className="flex justify-end items-end pr-3 pt-4 font-medium text-sm md:text-base dark:text-[#D7D7D7]">
                <h1>Listed 10 days ago</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;