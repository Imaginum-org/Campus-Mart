import { memo, forwardRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const FALLBACK_IMAGE = "/image10.png";

const ProductCard = memo(
  forwardRef(({ product }, ref) => {
    if (!product) return null;

    const { _id, title, images, category, selling_price, original_price } =
      product;

    const imageUrl = images?.length > 0 ? images[0] : FALLBACK_IMAGE;

    const discount =
      original_price && original_price > selling_price
        ? original_price - selling_price
        : 0;

    const handleClick = useCallback(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

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
          <button
            className="absolute flex items-center justify-center lg:w-10 w-7 lg:h-10 h-7 right-5 top-5"
            aria-label="Add to wishlist"
          >
            <div className="relative lg:w-4 w-3 lg:h-4 h-3 transform rotate-45 bg-white group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-md">
              <div className="absolute top-[-50%] left-0 lg:w-4 w-3 lg:h-4 h-3 bg-white rounded-full"></div>
              <div className="absolute top-0 left-[-50%] lg:w-4 w-3 lg:h-4 h-3 bg-white rounded-full"></div>
            </div>
          </button>

          {/* CATEGORY */}
          <div className="bg-[#394FF1] text-white px-2 py-1 rounded md:text-sm text-[2.9vw] font-medium absolute md:bottom-6 md:left-6 bottom-4 left-4">
            {category}
          </div>

          <img
            src={imageUrl}
            alt={title || "Product image"}
            className="rounded-lg w-full h-full"
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
  }),
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
