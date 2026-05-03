import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "../../product/components/DeleteProductModal.jsx";
import UnlistProductModal from "../../product/components/UnlistProductModal.jsx";
import RelistProductModal from "../../product/components/RelistProductModal.jsx";
import {
  deleteProduct,
  unlistProduct,
  relistProduct,
} from "../../product/api/productApi.js";
import toast from "react-hot-toast";

const OrderCard = ({
  orderId,
  placedOn,
  imageUrl,
  name,
  color,
  attr,
  status,
  price,
  onProductDeleted,
  onProductUnlisted,
  onProductRelisted,
}) => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unlistModalOpen, setUnlistModalOpen] = useState(false);
  const [relistModalOpen, setRelistModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnlisting, setIsUnlisting] = useState(false);
  const [isRelisting, setIsRelisting] = useState(false);

  const normalized = (status || "").toLowerCase().trim();

  const handleArrowClick = () => {
    navigate(`/product/${orderId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteProduct(orderId);

      if (res.data.success) {
        toast.success("Product deleted successfully");
        if (onProductDeleted) onProductDeleted(orderId);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnlistProduct = async () => {
    try {
      setIsUnlisting(true);
      const res = await unlistProduct(orderId);

      if (res.data.success) {
        toast.success("Product unlisted successfully");
        if (onProductUnlisted) onProductUnlisted(orderId);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to unlist product");
    } finally {
      setIsUnlisting(false);
    }
  };

  const handleRelistProduct = async () => {
    try {
      setIsRelisting(true);
      const res = await axios.patch(`/api/product/${orderId}/relist`);

      if (res.data.success) {
        toast.success("Product relisted successfully");
        if (onProductRelisted) onProductRelisted(orderId);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to relist product");
    } finally {
      setIsRelisting(false);
    }
  };

  const statusClasses =
    normalized === "delivered"
      ? "bg-[#E6FFEB] text-[#008526]"
      : normalized === "cancelled" || normalized === "canceled"
        ? "bg-[#FFECEC] text-[#D12929]"
        : "bg-[#E5E8FF] dark:bg-[#E5E8FF] text-[#534FF2] dark:text-[#534FF2]";

  return (
    <div className="bg-white dark:bg-[#1A1D20] rounded-[15px] lg:rounded-[20px] shadow-md overflow-hidden pl-[3.4vw] pr-[3.5vw] pt-[1.8vh] pb-[1.8vh] lg:px-[1.8vw] lg:py-[1.9vh] xl:py-8 font-poppins mb-6">
      <div className="flex justify-between items-center">
        <div className="text-[#2d3339] dark:text-[#F1F1F1] text-[13px] lg:text-lg lg:font-medium">
          #Order id : {orderId}
        </div>
        <div className="text-[#646464] dark:text-[#D6D6D6] text-[12px] lg:text-[16px] font-light">
          Placed on : {placedOn}
        </div>
      </div>

      <div className="w-full h-[0px] border lg:border-1 border-[#ECEEFF] mt-[2vh] mb-[2.4vh] lg:my-[1.5vh] xl:my-[2vh]" />

      <div className="lg:flex lg:justify-between lg:mt-[2vh] xl:mt-[3vh]">
        <div className="flex ml-[4vw] lg:ml-[0vw]">
          <img
            className="w-[90px] h-[90px] lg:w-[88px] lg:h-[88px] rounded-[9.06px]"
            src={imageUrl}
            alt={name || "product image"}
          />
          <div className="flex flex-col ml-[4vw] lg:ml-[1.5vw] max-sm:mt-[1.2vh]">
            <div className="text-[#2d3339] dark:text-[#F1F1F1] text-[15px] font-medium lg:text-[19px]">
              {name}
            </div>
            <div className="text-[#64707d] dark:text-[#848484] text-[13px] lg:text-[15px] font-light mt-[-0.6vh]">
              {color} | {attr}
            </div>

            <div className="lg:mt-[1.2vh]">
              {/* status badge */}
              <div
                className={`rounded-[5px] lg:rounded-[7px] inline-block px-[2vw] py-[0.2vh] lg:py-[0.3vh] lg:px-[1vw] ${statusClasses} xl:py-1 xl:px-4`}
              >
                <div className="text-[12px] font-normal lg:text-[14px]">
                  {status}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-[2.4vh] w-full h-0 border border-[#cacaca]" />

        <div className="flex lg:flex lg:flex-col lg:justify-center lg:items-end mt-[3vh] lg:mt-[0px]">
          <div className="text-[#555555] dark:text-[#BBC2C9] mr-[3vw] lg:mr-[0] text-[0.95rem] lg:text-[1.1rem] font-normal">
            Total
          </div>
          <div className="text-black dark:text-[#F1F1F1] text-[0.9rem] lg:text-[18px] md:mb-[1.7vh] lg:font-medium lg:mt-[-0.7vh]">
            ₹{price}
          </div>

          <button
            onClick={handleArrowClick}
            data-svg-wrapper
            className="max-sm:absolute bottom-[1.5vh] right-[4vw] lg:static md:absolute md:bottom-[1.5vh] md:right-[3.3vw] cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="View product details"
            title="View product details"
          >
            <svg
              className="max-sm:h-[25px] max-sm:w-[25px]"
              width="30"
              height="31"
              viewBox="0 0 30 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                width="30"
                height="30"
                rx="15"
                transform="matrix(-1 0 0 1 30 0.253723)"
                fill="#534FF2"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.2636 7.53034C11.6151 7.16152 12.1849 7.16152 12.5364 7.53034L19.7364 15.0859C20.0879 15.4547 20.0879 16.0527 19.7364 16.4215L12.5364 23.9771C12.1849 24.3459 11.6151 24.3459 11.2636 23.9771C10.9121 23.6083 10.9121 23.0103 11.2636 22.6415L17.8272 15.7537L11.2636 8.86599C10.9121 8.49716 10.9121 7.89917 11.2636 7.53034Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="w-full h-[0px] border lg:border-1 border-[#ECEEFF] mt-[2vh] mb-[2vh] lg:my-[1.5vh] xl:my-[2vh]" />

      <div className="flex flex-wrap gap-[2vw] lg:gap-[1vw] lg:justify-end items-center">
        <button className="px-[3vw] py-[0.8vh] lg:px-[1.2vw] lg:py-[0.6vh] bg-[#534FF2] text-white rounded-[8px] text-[13px] lg:text-[14px] font-medium hover:bg-[#4239D4] transition-colors whitespace-nowrap">
          Boost Visibility
        </button>
        <button className="px-[3vw] py-[0.8vh] lg:px-[1.2vw] lg:py-[0.6vh] bg-white dark:bg-[#2A2D31] border border-[#D0D0D0] dark:border-[#444] text-[#333] dark:text-[#E1E1E1] rounded-[8px] text-[13px] lg:text-[14px] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#333] transition-colors whitespace-nowrap">
          Edit Details
        </button>
        {normalized === "unlisted" ? (
          <button
            onClick={() => setRelistModalOpen(true)}
            disabled={isRelisting}
            className="px-[3vw] py-[0.8vh] lg:px-[1.2vw] lg:py-[0.6vh] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-[8px] text-[13px] lg:text-[14px] font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRelisting ? "Listing..." : "List"}
          </button>
        ) : (
          <button
            onClick={() => setUnlistModalOpen(true)}
            disabled={isUnlisting}
            className="px-[3vw] py-[0.8vh] lg:px-[1.2vw] lg:py-[0.6vh] bg-white dark:bg-[#2A2D31] border border-[#D0D0D0] dark:border-[#444] text-[#333] dark:text-[#E1E1E1] rounded-[8px] text-[13px] lg:text-[14px] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#333] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnlisting ? "Unlisting..." : "Unlist"}
          </button>
        )}
        <button
          onClick={() => setDeleteModalOpen(true)}
          disabled={isDeleting}
          className="p-[0.8vh] lg:p-[0.6vh] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-[8px] hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Delete Product Modal */}
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        productName={name}
        isLoading={isDeleting}
      />

      {/* Unlist Product Modal */}
      <UnlistProductModal
        isOpen={unlistModalOpen}
        onClose={() => setUnlistModalOpen(false)}
        onConfirm={handleUnlistProduct}
        productName={name}
        isLoading={isUnlisting}
      />

      {/* Relist Product Modal */}
      <RelistProductModal
        isOpen={relistModalOpen}
        onClose={() => setRelistModalOpen(false)}
        onConfirm={handleRelistProduct}
        productName={name}
        isLoading={isRelisting}
      />
    </div>
  );
};

export default OrderCard;
