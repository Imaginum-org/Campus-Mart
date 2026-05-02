import { memo, forwardRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../../context/useWishlist.js";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "/image10.png";

const ProductCard = memo(
  forwardRef(
    ({ product, showRemoveButton = false, onRemove, onRemoveError }, ref) => {
      const { toggleWishlist, removeFromWishlist, checkProductInWishlist } =
        useWishlist();

      const [inWishlist, setInWishlist] = useState(false);
      const [loading, setLoading] = useState(false);

      if (!product) return null;

      const { _id, title, images, category, selling_price, original_price } =
        product;

      useEffect(() => {
        let isMounted = true;

        const checkWishlist = async () => {
          try {
            const inWish = await checkProductInWishlist(_id);
            if (isMounted) setInWishlist(inWish);
          } catch (err) {
            console.error("Wishlist check failed:", err);
          }
        };

        if (_id) checkWishlist();

        return () => {
          isMounted = false;
        };
      }, [_id, checkProductInWishlist]);

      const imageUrl = images && images.length > 0 ? images[0] : FALLBACK_IMAGE;

      const discount =
        original_price && original_price > selling_price
          ? original_price - selling_price
          : 0;

      const handleClick = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);

      // ✅ Fixed wishlist handler (no spam clicks + safe)
      const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading || !_id) return;

        setLoading(true);

        try {
          const result = await toggleWishlist(_id, product);
          setInWishlist(result);

          toast.success(
            result ? "Added to Wishlist" : "Removed from Wishlist",
            { id: "wishlist-toast" },
          );
        } catch (error) {
          toast.error("Failed to update wishlist", {
            id: "wishlist-error",
          });
          console.error("Wishlist error:", error);
        } finally {
          setLoading(false);
        }
      };

      const handleRemoveClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setInWishlist(false);
        onRemove?.(_id);
        toast.success("Removed from Wishlist", { id: "wishlist-remove" });

        try {
          await removeFromWishlist(_id);
        } catch (error) {
          setInWishlist(true);
          onRemoveError?.(_id);
          toast.error("Failed to remove from wishlist", {
            id: "wishlist-error",
          });
          console.error("Remove error:", error);
        }
      };

      return (
        <Link
          ref={ref}
          to={`/product/${_id}`}
          onClick={handleClick}
          aria-label={`View product ${title}`}
          className="lg:w-[28vw] xl:w-[21vw] w-[44.7vw] md:w-[29vw] rounded-xl overflow-hidden shadow-[0px_4.115523815155029px_28.808666229248047px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1.03px] outline-zinc-300 hover:shadow-sm animation duration-300 ease-linear hover:scale-105 dark:bg-[#121212] dark:shadow-[0px_4.115523815155029px_28.808666229248047px_0px_rgba(0,0,0,0.10)] dark:outline dark:outline-1 dark:outline-offset-[-1.03px] dark:outline-zinc-600"
        >
          {/* IMAGE */}
          <div className="md:p-3 p-2 w-full h-[22vh] md:h-[21vh] lg:h-[19vh] xl:h-[40vh] object-contain relative">
            {showRemoveButton ? (
              <button
                onClick={handleRemoveClick}
                disabled={loading}
                className={`absolute flex items-center justify-center lg:w-10 w-7 lg:h-10 h-7 right-5 top-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
                }`}
                aria-label="Remove from wishlist"
                title="Remove from wishlist"
              >
                <FaHeart className="lg:w-4 w-3 lg:h-4 h-3 text-pink-500 group-hover:scale-110 transition-transform duration-300" />
              </button>
            ) : (
              <button
                onClick={handleWishlistClick}
                disabled={loading}
                className="absolute flex items-center justify-center lg:w-10 w-7 lg:h-10 h-7 right-5 top-5 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Add to wishlist"
              >
                {inWishlist ? (
                  <FaHeart className="lg:w-4 w-3 lg:h-4 h-3 text-pink-500 transition-colors duration-300" />
                ) : (
                  <FaRegHeart className="lg:w-4 w-3 lg:h-4 h-3 text-gray-400 hover:text-pink-500 transition-colors duration-300" />
                )}
              </button>
            )}

            {/* CATEGORY */}
            <div className="bg-[#394FF1] text-white px-2 py-1 rounded md:text-sm text-[2.9vw] font-medium absolute md:bottom-6 md:left-6 bottom-4 left-4">
              {category}
            </div>

            <img
              src={imageUrl}
              alt={title || "Product image"}
              className="rounded-lg w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          {/* TITLE */}
          <h1 className="md:pb-2 xl:pb-3 pb-1 pl-4 lg:text-[1.6vw] xl:text-[1.3vw] text-xs font-semibold text-[#313131] xl:mt-1 dark:text-white">
            {title}
          </h1>

          {/* RATING */}
          <div className="flex md:gap-2 gap-5 pl-4">
            <div className="bg-[#E5FDDF] dark:bg-[#0D3804] px-2 py-1 rounded text-[#319F43] font-semibold flex items-center gap-1">
              <span>4.0</span>
              <FaStar />
            </div>
          </div>

          {/* PRICE */}
          <div className="pl-3 pr-3 mt-3 pb-3 flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-zinc-800 font-bold flex items-center dark:text-white">
                <MdOutlineCurrencyRupee />
                {selling_price}
              </h2>

              {original_price && (
                <h2 className="text-neutral-400 line-through flex items-center">
                  <MdOutlineCurrencyRupee />
                  {original_price}
                </h2>
              )}
            </div>

            {/* DISCOUNT */}
            {discount > 0 && (
              <div className="flex items-center pl-1">
                <h2 className="text-[#06981E] font-bold flex items-center">
                  Save <MdOutlineCurrencyRupee /> {discount}
                </h2>
              </div>
            )}
          </div>
        </Link>
      );
    },
  ),
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
